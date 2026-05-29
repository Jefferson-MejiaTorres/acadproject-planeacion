import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FolderKanban, Users } from "lucide-react"

interface Member {
  id: string
  name: string
  email: string
  image: string | null
  role: string | null
}

interface ProjectCardProps {
  id: string
  name: string
  description: string | null
  status: string | null
  taskCount: number
  completedTasks: number
  members: Member[]
}

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

export function ProjectCard({
  id,
  name,
  description,
  status,
  taskCount,
  completedTasks,
  members,
}: ProjectCardProps) {
  const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0
  const displayStatus = status || "activo"

  return (
    <Link href={`/proyectos/${id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                  {name}
                </h3>
                {description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {description}
                  </p>
                )}
              </div>
            </div>
            <Badge variant="secondary" className={statusColors[displayStatus]}>
              {statusLabels[displayStatus]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedTasks} de {taskCount} tareas completadas
            </p>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex items-center gap-2 w-full">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {members.slice(0, 4).map((member) => (
                <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                  <AvatarImage src={member.image || undefined} />
                  <AvatarFallback className="text-xs">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {members.length > 4 && (
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                  +{members.length - 4}
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground ml-auto">
              {members.length} miembro{members.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
