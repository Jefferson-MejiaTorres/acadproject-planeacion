import { getProjects } from "@/app/actions/actions"
import { ProjectCard } from "@/components/proyectos/project-card"
import { CreateProjectDialog } from "@/components/proyectos/create-project-dialog"
import { FolderKanban } from "lucide-react"
import { mockProjects } from "@/lib/mock-data"

export default async function ProyectosPage() {
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === "true"
  
  let projects = mockProjects

  if (!isMockMode) {
    try {
      projects = await getProjects()
    } catch (error) {
      console.error("Error fetching projects:", error)
      // Fallback a mock data
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis Proyectos</h1>
          <p className="text-muted-foreground">
            Gestiona y organiza tus proyectos académicos
          </p>
          {isMockMode && (
            <p className="text-xs text-yellow-600 mt-2">
              🎭 Modo de prueba - Usando datos de demostración
            </p>
          )}
        </div>
        <CreateProjectDialog />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <FolderKanban className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No tienes proyectos aún</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Crea tu primer proyecto para empezar a organizar las tareas de tu equipo
          </p>
          <CreateProjectDialog />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      )}
    </div>
  )
}
