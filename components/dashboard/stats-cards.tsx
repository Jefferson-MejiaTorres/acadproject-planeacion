import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, CheckCircle, Clock, Bell } from "lucide-react"

interface StatsCardsProps {
  totalProjects: number
  activeProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  unreadNotifications: number
}

export function StatsCards({
  totalProjects,
  activeProjects,
  completedTasks,
  pendingTasks,
  unreadNotifications,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Proyectos Activos",
      value: activeProjects,
      description: `de ${totalProjects} totales`,
      icon: FolderKanban,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Tareas Completadas",
      value: completedTasks,
      description: "tareas finalizadas",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Tareas Pendientes",
      value: pendingTasks,
      description: "por completar",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Notificaciones",
      value: unreadNotifications,
      description: "sin leer",
      icon: Bell,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
