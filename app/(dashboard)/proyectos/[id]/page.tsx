import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getProject, getTasks } from "@/app/actions/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MembersList } from "@/components/proyectos/members-list"
import { ArrowLeft, Kanban, Settings } from "lucide-react"

const statusColors: Record<string, string> = {
  activo: "bg-green-100 text-green-700",
  completado: "bg-blue-100 text-blue-700",
  archivado: "bg-gray-100 text-gray-700",
}

const statusLabels: Record<string, string> = {
  activo: "Activo",
  completado: "Completado",
  archivado: "Archivado",
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  
  let project
  let tasks
  
  try {
    project = await getProject(id)
    tasks = await getTasks(id)
  } catch {
    notFound()
  }

  const completedTasks = tasks.filter((t) => t.status === "completada").length
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/proyectos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <Badge variant="secondary" className={statusColors[project.status || "activo"]}>
              {statusLabels[project.status || "activo"]}
            </Badge>
          </div>
          {project.description && (
            <p className="text-muted-foreground mt-1">{project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/proyectos/${id}/tareas`}>
              <Kanban className="mr-2 h-4 w-4" />
              Ver Tareas
            </Link>
          </Button>
          {project.userRole === "lider" && (
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progreso del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tareas completadas</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center p-3 rounded-lg bg-amber-50">
                  <p className="text-2xl font-bold text-amber-600">
                    {tasks.filter((t) => t.status === "pendiente").length}
                  </p>
                  <p className="text-xs text-amber-600">Pendientes</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50">
                  <p className="text-2xl font-bold text-blue-600">
                    {tasks.filter((t) => t.status === "en_progreso").length}
                  </p>
                  <p className="text-xs text-blue-600">En progreso</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50">
                  <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                  <p className="text-xs text-green-600">Completadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Tareas Recientes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/proyectos/${id}/tareas`}>Ver todas</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay tareas aún. ¡Crea la primera!
                </p>
              ) : (
                <div className="space-y-2">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        {task.assignee && (
                          <p className="text-xs text-muted-foreground">
                            Asignado a: {task.assignee.name}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          task.status === "completada"
                            ? "bg-green-100 text-green-700"
                            : task.status === "en_progreso"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      >
                        {task.status === "completada"
                          ? "Completada"
                          : task.status === "en_progreso"
                          ? "En progreso"
                          : "Pendiente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <MembersList
                projectId={id}
                members={project.members}
                userRole={project.userRole}
                currentUserId={session?.user?.id || ""}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
