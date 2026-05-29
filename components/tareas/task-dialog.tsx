"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createTask, updateTask } from "@/app/actions/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface Member {
  id: string
  name: string
  email: string
  image: string | null
  role: string | null
}

interface Task {
  id: string
  title: string
  description: string | null
  status: string | null
  dueDate: string | null
  assignee: { id: string; name: string; image: string | null } | null
}

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  members: Member[]
  task?: Task | null
}

export function TaskDialog({ open, onOpenChange, projectId, members, task }: TaskDialogProps) {
  const router = useRouter()
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [assignedTo, setAssignedTo] = useState(task?.assignee?.id || "")
  const [dueDate, setDueDate] = useState(task?.dueDate || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEditing = !!task

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isEditing) {
        await updateTask(task.id, {
          title,
          description: description || null,
          assignedTo: assignedTo || null,
          dueDate: dueDate || null,
        })
      } else {
        await createTask({
          projectId,
          title,
          description: description || undefined,
          assignedTo: assignedTo || undefined,
          dueDate: dueDate || undefined,
        })
      }
      onOpenChange(false)
      resetForm()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la tarea")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setAssignedTo("")
    setDueDate("")
    setError("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm()
    onOpenChange(newOpen)
  }

  // Update form when task changes
  if (task && title !== task.title) {
    setTitle(task.title)
    setDescription(task.description || "")
    setAssignedTo(task.assignee?.id || "")
    setDueDate(task.dueDate || "")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica los detalles de la tarea"
                : "Crea una nueva tarea para el proyecto"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Título</Label>
              <Input
                id="task-title"
                placeholder="Ej: Investigar bibliografía"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Descripción (opcional)</Label>
              <Textarea
                id="task-description"
                placeholder="Describe los detalles de la tarea..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-assignee">Asignar a</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo} disabled={loading}>
                  <SelectTrigger id="task-assignee">
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due">Fecha límite</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Guardar" : "Crear Tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
