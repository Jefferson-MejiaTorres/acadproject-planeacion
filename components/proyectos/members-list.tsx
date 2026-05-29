"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus, Crown, Loader2, X } from "lucide-react"
import { addMemberByEmail, removeMember } from "@/app/actions/actions"
import { useRouter } from "next/navigation"

interface Member {
  id: string
  name: string
  email: string
  image: string | null
  role: string | null
}

interface MembersListProps {
  projectId: string
  members: Member[]
  userRole: string | null
  currentUserId: string
}

export function MembersList({ projectId, members, userRole, currentUserId }: MembersListProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const isLeader = userRole === "lider"

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await addMemberByEmail(projectId, email)
      setOpen(false)
      setEmail("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar miembro")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("¿Estás seguro de remover a este miembro?")) return
    
    try {
      await removeMember(projectId, memberId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al remover miembro")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Miembros del equipo</h3>
        {isLeader && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddMember}>
                <DialogHeader>
                  <DialogTitle>Agregar Miembro</DialogTitle>
                  <DialogDescription>
                    Ingresa el correo electrónico del usuario que deseas agregar al proyecto
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-email">Correo electrónico</Label>
                    <Input
                      id="member-email"
                      type="email"
                      placeholder="correo@universidad.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading || !email.trim()}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Agregar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.image || undefined} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{member.name}</span>
                  {member.role === "lider" && (
                    <Crown className="h-3.5 w-3.5 text-amber-500" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{member.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {member.role === "lider" ? "Líder" : "Colaborador"}
              </Badge>
              {isLeader && member.id !== currentUserId && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
