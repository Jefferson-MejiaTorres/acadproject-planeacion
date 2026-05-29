import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getDashboardStats, getRecentProjects, getUpcomingTasks } from "@/app/actions/actions"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"
import { mockUser, mockProjects, mockTasks } from "@/lib/mock-data"

export default async function DashboardPage() {
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === "true"
  
  let userName = mockUser.name
  let stats = {
    totalProjects: 3,
    activeProjects: 3,
    totalTasks: 5,
    completedTasks: 1,
  }
  let recentProjects = mockProjects
  let upcomingTasks = mockTasks.filter((t) => t.status !== "completado")

  if (!isMockMode) {
    // Modo real - obtener datos de la BD
    const session = await auth.api.getSession({ headers: await headers() })
    userName = session?.user?.name?.split(" ")[0] || "Usuario"
    
    try {
      stats = await getDashboardStats()
      recentProjects = await getRecentProjects()
      upcomingTasks = await getUpcomingTasks()
    } catch (error) {
      console.error("Error fetching real data:", error)
      // Fallback a mock data en caso de error
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          ¡Hola, {userName?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Aquí tienes un resumen de tus proyectos y tareas
        </p>
        {isMockMode && (
          <p className="text-xs text-yellow-600 mt-2">
            🎭 Modo de prueba - Usando datos de demostración
          </p>
        )}
      </div>

      <StatsCards {...stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects projects={recentProjects} />
        <UpcomingTasks tasks={upcomingTasks} />
      </div>
    </div>
  )
}
