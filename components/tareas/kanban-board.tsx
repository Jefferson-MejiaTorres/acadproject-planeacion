"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, GripVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateTaskStatus, deleteTask } from "@/app/actions/actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Task {
  id: string
  title: string
  description: string | null
  status: string | null
  dueDate: string | null
  assignee: { id: string; name: string; image: string | null } | null
}

interface KanbanBoardProps {
  tasks: Task[]
  projectId: string
  onEditTask: (task: Task) => void
}

const columns = [
  { id: "pendiente", title: "Pendiente", color: "bg-amber-500" },
  { id: "en_progreso", title: "En Progreso", color: "bg-blue-500" },
  { id: "completada", title: "Completada", color: "bg-green-500" },
]

export function KanbanBoard({ tasks, projectId, onEditTask }: KanbanBoardProps) {
  const router = useRouter()
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggingId(taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault()
    if (!draggingId) return

    const task = tasks.find((t) => t.id === draggingId)
    if (task && task.status !== status) {
      await updateTaskStatus(draggingId, status)
      router.refresh()
    }
    setDraggingId(null)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta tarea?")) return
    await deleteTask(taskId)
    router.refresh()
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id)

        return (
          <div
            key={column.id}
            className="flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary" className="ml-auto">
                {columnTasks.length}
              </Badge>
            </div>

            <div className="flex-1 space-y-3 min-h-[200px] p-3 rounded-lg bg-muted/30 border-2 border-dashed border-transparent hover:border-muted-foreground/20 transition-colors">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`cursor-grab active:cursor-grabbing transition-opacity ${
                    draggingId === task.id ? "opacity-50" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                >
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <CardTitle className="text-sm font-medium leading-tight">
                          {task.title}
                        </CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditTask(task)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    {task.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          {format(new Date(task.dueDate), "d MMM", { locale: es })}
                        </div>
                      )}
                      {task.assignee && (
                        <Avatar className="h-6 w-6 ml-auto">
                          <AvatarImage src={task.assignee.image || undefined} />
                          <AvatarFallback className="text-xs">
                            {task.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {columnTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Arrastra tareas aquí
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
