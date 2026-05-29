import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getDashboardStats, getRecentProjects, getUpcomingTasks } from "@/app/actions/actions"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const stats = await getDashboardStats()
  const recentProjects = await getRecentProjects()
  const upcomingTasks = await getUpcomingTasks()

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          ¡Hola, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Aquí tienes un resumen de tus proyectos y tareas
        </p>
      </div>

      <StatsCards {...stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects projects={recentProjects} />
        <UpcomingTasks tasks={upcomingTasks} />
      </div>
    </div>
  )
}
