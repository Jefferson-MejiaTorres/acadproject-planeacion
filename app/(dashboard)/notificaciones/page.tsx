import { getNotifications } from "@/app/actions/actions"
import { NotificationsClient } from "@/components/notificaciones/notifications-client"

export default async function NotificacionesPage() {
  const notifications = await getNotifications()

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notificaciones</h1>
        <p className="text-muted-foreground">
          Mantente al día con la actividad de tus proyectos
        </p>
      </div>

      <NotificationsClient notifications={notifications} />
    </div>
  )
}
