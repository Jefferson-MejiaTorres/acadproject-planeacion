import { getNotifications } from "@/app/actions/actions"
import { NotificationsClient } from "@/components/notificaciones/notifications-client"
import { mockNotifications } from "@/lib/mock-data"

export default async function NotificacionesPage() {
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === "true"
  
  let notifications = mockNotifications

  if (!isMockMode) {
    try {
      notifications = await getNotifications()
    } catch (error) {
      console.error("Error fetching notifications:", error)
      // Fallback a mock data
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notificaciones</h1>
        <p className="text-muted-foreground">
          Mantente al día con la actividad de tus proyectos
        </p>
        {isMockMode && (
          <p className="text-xs text-yellow-600 mt-2">
            🎭 Modo de prueba - Usando datos de demostración
          </p>
        )}
      </div>

      <NotificationsClient notifications={notifications} />
    </div>
  )
}
