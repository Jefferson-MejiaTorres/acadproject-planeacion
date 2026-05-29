"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { KanbanBoard } from "@/components/tareas/kanban-board"
import { TaskDialog } from "@/components/tareas/task-dialog"
import { Plus } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string | null
  status: string | null
  dueDate: string | null
  assignee: { id: string; name: string; image: string | null } | null
}

interface Member {
  id: string
  name: string
  email: string
  image: string | null
  role: string | null
}

interface TasksClientProps {
  tasks: Task[]
  projectId: string
  members: Member[]
}

export function TasksClient({ tasks, projectId, members }: TasksClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setEditingTask(null)
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <KanbanBoard tasks={tasks} projectId={projectId} onEditTask={handleEditTask} />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        projectId={projectId}
        members={members}
        task={editingTask}
      />
    </>
  )
}
