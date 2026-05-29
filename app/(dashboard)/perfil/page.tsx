import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getDashboardStats } from "@/app/actions/actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function PerfilPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const stats = await getDashboardStats()
  const user = session?.user

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Información de tu cuenta</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.image || undefined} />
                <AvatarFallback className="text-2xl">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-2">
                Estudiante
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-primary">{stats.totalProjects}</p>
                <p className="text-sm text-muted-foreground">Proyectos</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
                <p className="text-sm text-muted-foreground">Completadas</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-amber-600">{stats.pendingTasks}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-blue-600">{stats.activeProjects}</p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Información de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg bg-muted/50">
                <dt className="text-sm text-muted-foreground">Nombre completo</dt>
                <dd className="font-medium mt-1">{user?.name}</dd>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <dt className="text-sm text-muted-foreground">Correo electrónico</dt>
                <dd className="font-medium mt-1">{user?.email}</dd>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <dt className="text-sm text-muted-foreground">Estado de la cuenta</dt>
                <dd className="font-medium mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Activa
                </dd>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <dt className="text-sm text-muted-foreground">Miembro desde</dt>
                <dd className="font-medium mt-1">
                  {user?.createdAt
                    ? format(new Date(user.createdAt), "d 'de' MMMM, yyyy", { locale: es })
                    : "N/A"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
