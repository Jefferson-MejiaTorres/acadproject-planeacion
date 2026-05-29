"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { projects, projectMembers, tasks, notifications, user } from "@/lib/db/schema"
import { and, desc, eq, or, inArray, sql, count } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("No autorizado")
  return session.user.id
}

// Dashboard stats
export async function getDashboardStats() {
  const userId = await getUserId()
  
  // Get projects where user is a member
  const userProjects = await db
    .select({ projectId: projectMembers.projectId })
    .from(projectMembers)
    .where(eq(projectMembers.userId, userId))
  
  const projectIds = userProjects.map((p) => p.projectId)
  
  if (projectIds.length === 0) {
    return {
      totalProjects: 0,
      activeProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      unreadNotifications: 0,
    }
  }
  
  const [projectStats] = await db
    .select({
      total: count(),
      active: sql<number>`count(*) filter (where ${projects.status} = 'activo')`,
    })
    .from(projects)
    .where(inArray(projects.id, projectIds))
  
  const [taskStats] = await db
    .select({
      total: count(),
      completed: sql<number>`count(*) filter (where ${tasks.status} = 'completada')`,
      pending: sql<number>`count(*) filter (where ${tasks.status} = 'pendiente')`,
    })
    .from(tasks)
    .where(inArray(tasks.projectId, projectIds))
  
  const [notifStats] = await db
    .select({ unread: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)))
  
  return {
    totalProjects: projectStats?.total ?? 0,
    activeProjects: Number(projectStats?.active) ?? 0,
    totalTasks: taskStats?.total ?? 0,
    completedTasks: Number(taskStats?.completed) ?? 0,
    pendingTasks: Number(taskStats?.pending) ?? 0,
    unreadNotifications: notifStats?.unread ?? 0,
  }
}

// Projects
export async function getProjects() {
  const userId = await getUserId()
  
  const userProjectIds = await db
    .select({ projectId: projectMembers.projectId })
    .from(projectMembers)
    .where(eq(projectMembers.userId, userId))
  
  const projectIds = userProjectIds.map((p) => p.projectId)
  
  if (projectIds.length === 0) return []
  
  const projectList = await db
    .select()
    .from(projects)
    .where(inArray(projects.id, projectIds))
    .orderBy(desc(projects.createdAt))
  
  // Get task counts and member info for each project
  const projectsWithDetails = await Promise.all(
    projectList.map(async (project) => {
      const [taskCount] = await db
        .select({
          total: count(),
          completed: sql<number>`count(*) filter (where ${tasks.status} = 'completada')`,
        })
        .from(tasks)
        .where(eq(tasks.projectId, project.id))
      
      const members = await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: projectMembers.role,
        })
        .from(projectMembers)
        .innerJoin(user, eq(projectMembers.userId, user.id))
        .where(eq(projectMembers.projectId, project.id))
      
      return {
        ...project,
        taskCount: taskCount?.total ?? 0,
        completedTasks: Number(taskCount?.completed) ?? 0,
        members,
      }
    })
  )
  
  return projectsWithDetails
}

export async function createProject(data: { name: string; description?: string }) {
  const userId = await getUserId()
  const id = crypto.randomUUID()
  
  await db.insert(projects).values({
    id,
    name: data.name,
    description: data.description,
    createdBy: userId,
  })
  
  // Add creator as leader
  await db.insert(projectMembers).values({
    id: crypto.randomUUID(),
    projectId: id,
    userId,
    role: "lider",
  })
  
  revalidatePath("/proyectos")
  revalidatePath("/dashboard")
  return { id }
}

export async function getProject(id: string) {
  const userId = await getUserId()
  
  // Check if user is member
  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, id), eq(projectMembers.userId, userId)))
  
  if (!membership) throw new Error("No tienes acceso a este proyecto")
  
  const [project] = await db.select().from(projects).where(eq(projects.id, id))
  if (!project) throw new Error("Proyecto no encontrado")
  
  const members = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: projectMembers.role,
    })
    .from(projectMembers)
    .innerJoin(user, eq(projectMembers.userId, user.id))
    .where(eq(projectMembers.projectId, id))
  
  return { ...project, members, userRole: membership.role }
}

export async function updateProject(id: string, data: { name?: string; description?: string; status?: string }) {
  const userId = await getUserId()
  
  // Check if user is leader
  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, id), eq(projectMembers.userId, userId), eq(projectMembers.role, "lider")))
  
  if (!membership) throw new Error("Solo el líder puede editar el proyecto")
  
  await db.update(projects).set({ ...data, updatedAt: new Date() }).where(eq(projects.id, id))
  
  revalidatePath("/proyectos")
  revalidatePath(`/proyectos/${id}`)
}

export async function deleteProject(id: string) {
  const userId = await getUserId()
  
  // Check if user is leader
  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, id), eq(projectMembers.userId, userId), eq(projectMembers.role, "lider")))
  
  if (!membership) throw new Error("Solo el líder puede eliminar el proyecto")
  
  await db.delete(projects).where(eq(projects.id, id))
  
  revalidatePath("/proyectos")
  revalidatePath("/dashboard")
}

// Tasks
export async function getTasks(projectId: string) {
  const userId = await getUserId()
  
  // Check if user is member
  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)))
  
  if (!membership) throw new Error("No tienes acceso a este proyecto")
  
  const taskList = await db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, projectId))
    .orderBy(desc(tasks.createdAt))
  
  // Get assignee info
  const tasksWithAssignees = await Promise.all(
    taskList.map(async (task) => {
      if (!task.assignedTo) return { ...task, assignee: null }
      const [assignee] = await db.select({ id: user.id, name: user.name, image: user.image }).from(user).where(eq(user.id, task.assignedTo))
      return { ...task, assignee }
    })
  )
  
  return tasksWithAssignees
}

export async function createTask(data: { projectId: string; title: string; description?: string; assignedTo?: string; dueDate?: string }) {
  const userId = await getUserId()
  
  // Check if user is member
  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, data.projectId), eq(projectMembers.userId, userId)))
  
  if (!membership) throw new Error("No tienes acceso a este proyecto")
  
  const id = crypto.randomUUID()
  
  await db.insert(tasks).values({
    id,
    projectId: data.projectId,
    title: data.title,
    description: data.description,
    assignedTo: data.assignedTo,
    dueDate: data.dueDate,
    createdBy: userId,
  })
  
  // Notify assignee
  if (data.assignedTo && data.assignedTo !== userId) {
    await db.insert(notifications).values({
      id: crypto.randomUUID(),
      userId: data.assignedTo,
      type: "task_assigned",
      title: "Nueva tarea asignada",
      message: `Se te ha asignado la tarea: ${data.title}`,
      link: `/proyectos/${data.projectId}/tareas`,
    })
  }
  
  revalidatePath(`/proyectos/${data.projectId}`)
  revalidatePath(`/proyectos/${data.projectId}/tareas`)
  return { id }
}

export async function updateTaskStatus(id: string, status: string) {
  const userId = await getUserId()
  
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id))
  if (!task) throw new Error("Tarea no encontrada")
  
  // Check if user is member of the project
  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, task.projectId), eq(projectMembers.userId, userId)))
  
  if (!membership) throw new Error("No tienes acceso a esta tarea")
  
  await db.update(tasks).set({ status, updatedAt: new Date() }).where(eq(tasks.id, id))
  
  revalidatePath(`/proyectos/${task.projectId}`)
  revalidatePath(`/proyectos/${task.projectId}/tareas`)
  revalidatePath("/dashboard")
}

export async function updateTask(id: string, data: { title?: string; description?: string; assignedTo?: string | null; dueDate?: string | null }) {
  const userId = await getUserId()
  
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id))
  if (!task) throw new Error("Tarea no encontrada")
  
  // Check if user is member of the project
  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, task.projectId), eq(projectMembers.userId, userId)))
  
  if (!membership) throw new Error("No tienes acceso a esta tarea")
  
  await db.update(tasks).set({ ...data, updatedAt: new Date() }).where(eq(tasks.id, id))
  
  revalidatePath(`/proyectos/${task.projectId}`)
  revalidatePath(`/proyectos/${task.projectId}/tareas`)
}

export async function deleteTask(id: string) {
  const userId = await getUserId()
  
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id))
  if (!task) throw new Error("Tarea no encontrada")
  
  // Check if user is member of the project
  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, task.projectId), eq(projectMembers.userId, userId)))
  
  if (!membership) throw new Error("No tienes acceso a esta tarea")
  
  await db.delete(tasks).where(eq(tasks.id, id))
  
  revalidatePath(`/proyectos/${task.projectId}`)
  revalidatePath(`/proyectos/${task.projectId}/tareas`)
}

// Notifications
export async function getNotifications() {
  const userId = await getUserId()
  
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50)
}

export async function markNotificationAsRead(id: string) {
  const userId = await getUserId()
  
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
  
  revalidatePath("/notificaciones")
  revalidatePath("/dashboard")
}

export async function markAllNotificationsAsRead() {
  const userId = await getUserId()
  
  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, userId))
  
  revalidatePath("/notificaciones")
  revalidatePath("/dashboard")
}

// Members
export async function addMemberByEmail(projectId: string, email: string) {
  const userId = await getUserId()
  
  // Check if user is leader
  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId), eq(projectMembers.role, "lider")))
  
  if (!membership) throw new Error("Solo el líder puede agregar miembros")
  
  // Find user by email
  const [targetUser] = await db.select().from(user).where(eq(user.email, email))
  if (!targetUser) throw new Error("No se encontró un usuario con ese correo")
  
  // Check if already member
  const [existing] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, targetUser.id)))
  
  if (existing) throw new Error("El usuario ya es miembro del proyecto")
  
  // Add member
  await db.insert(projectMembers).values({
    id: crypto.randomUUID(),
    projectId,
    userId: targetUser.id,
    role: "colaborador",
  })
  
  // Notify user
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId))
  await db.insert(notifications).values({
    id: crypto.randomUUID(),
    userId: targetUser.id,
    type: "project_invite",
    title: "Te han agregado a un proyecto",
    message: `Has sido agregado al proyecto: ${project?.name}`,
    link: `/proyectos/${projectId}`,
  })
  
  revalidatePath(`/proyectos/${projectId}`)
}

export async function removeMember(projectId: string, memberId: string) {
  const userId = await getUserId()
  
  // Check if user is leader
  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId), eq(projectMembers.role, "lider")))
  
  if (!membership) throw new Error("Solo el líder puede remover miembros")
  
  // Cannot remove yourself if you're the leader
  if (memberId === userId) throw new Error("El líder no puede removerse a sí mismo")
  
  await db
    .delete(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, memberId)))
  
  revalidatePath(`/proyectos/${projectId}`)
}

// Recent activity for dashboard
export async function getRecentProjects() {
  const userId = await getUserId()
  
  const userProjects = await db
    .select({ projectId: projectMembers.projectId })
    .from(projectMembers)
    .where(eq(projectMembers.userId, userId))
  
  const projectIds = userProjects.map((p) => p.projectId)
  
  if (projectIds.length === 0) return []
  
  return db
    .select()
    .from(projects)
    .where(and(inArray(projects.id, projectIds), eq(projects.status, "activo")))
    .orderBy(desc(projects.updatedAt))
    .limit(5)
}

export async function getUpcomingTasks() {
  const userId = await getUserId()
  
  const userProjects = await db
    .select({ projectId: projectMembers.projectId })
    .from(projectMembers)
    .where(eq(projectMembers.userId, userId))
  
  const projectIds = userProjects.map((p) => p.projectId)
  
  if (projectIds.length === 0) return []
  
  const upcomingTasks = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      status: tasks.status,
      dueDate: tasks.dueDate,
      projectId: tasks.projectId,
      projectName: projects.name,
    })
    .from(tasks)
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(
      and(
        inArray(tasks.projectId, projectIds),
        or(eq(tasks.assignedTo, userId), eq(tasks.createdBy, userId)),
        or(eq(tasks.status, "pendiente"), eq(tasks.status, "en_progreso"))
      )
    )
    .orderBy(tasks.dueDate)
    .limit(5)
  
  return upcomingTasks
}
