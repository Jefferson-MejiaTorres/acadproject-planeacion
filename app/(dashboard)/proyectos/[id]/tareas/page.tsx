import { notFound } from "next/navigation"
import Link from "next/link"
import { getProject, getTasks } from "@/app/actions/actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { TasksClient } from "@/components/tareas/tasks-client"

export default async function TareasPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let project
  let tasks

  try {
    project = await getProject(id)
    tasks = await getTasks(id)
  } catch {
    notFound()
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/proyectos/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Tareas: {project.name}</h1>
          <p className="text-muted-foreground">
            Arrastra y suelta las tareas para cambiar su estado
          </p>
        </div>
      </div>

      <TasksClient tasks={tasks} projectId={id} members={project.members} />
    </div>
  )
}
