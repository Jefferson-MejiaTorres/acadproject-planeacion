import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderKanban, ArrowRight } from "lucide-react"
import type { Project } from "@/lib/db/schema"

interface RecentProjectsProps {
  projects: Project[]
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

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Proyectos Recientes</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/proyectos" className="text-muted-foreground hover:text-foreground">
            Ver todos <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No tienes proyectos aún</p>
            <Button asChild className="mt-4">
              <Link href="/proyectos/nuevo">Crear proyecto</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/proyectos/${project.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FolderKanban className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">
                      {project.name}
                    </p>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className={statusColors[project.status || "activo"]}>
                  {statusLabels[project.status || "activo"]}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
