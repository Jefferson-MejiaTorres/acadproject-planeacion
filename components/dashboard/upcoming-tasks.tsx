import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock, CalendarDays } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Task {
  id: string
  title: string
  status: string | null
  dueDate: string | null
  projectId: string
  projectName: string
}

interface UpcomingTasksProps {
  tasks: Task[]
}

const statusConfig: Record<string, { icon: typeof Circle; color: string; label: string }> = {
  pendiente: { icon: Circle, color: "text-amber-500", label: "Pendiente" },
  en_progreso: { icon: Clock, color: "text-blue-500", label: "En progreso" },
  completada: { icon: CheckCircle2, color: "text-green-500", label: "Completada" },
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Mis Tareas Próximas</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No tienes tareas pendientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const config = statusConfig[task.status || "pendiente"]
              const StatusIcon = config.icon
              
              return (
                <Link
                  key={task.id}
                  href={`/proyectos/${task.projectId}/tareas`}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                >
                  <StatusIcon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium group-hover:text-primary transition-colors truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {task.projectName}
                      </span>
                      {task.dueDate && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {formatDistanceToNow(new Date(task.dueDate), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {config.label}
                  </Badge>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
