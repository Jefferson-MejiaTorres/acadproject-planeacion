"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCheck, FolderKanban, UserPlus, CheckCircle } from "lucide-react"
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/app/actions/actions"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import type { Notification } from "@/lib/db/schema"

interface NotificationsClientProps {
  notifications: Notification[]
}

const typeIcons: Record<string, typeof Bell> = {
  task_assigned: CheckCircle,
  project_invite: UserPlus,
  default: Bell,
}

const typeColors: Record<string, string> = {
  task_assigned: "bg-blue-100 text-blue-600",
  project_invite: "bg-green-100 text-green-600",
  default: "bg-gray-100 text-gray-600",
}

export function NotificationsClient({ notifications }: NotificationsClientProps) {
  const router = useRouter()
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    router.refresh()
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Notificaciones</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {unreadCount} nueva{unreadCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Marcar todas como leídas
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No tienes notificaciones</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type] || typeIcons.default
              const colorClass = typeColors[notification.type] || typeColors.default

              const content = (
                <div
                  className={`flex items-start gap-3 p-4 rounded-lg transition-colors ${
                    notification.read ? "bg-background" : "bg-muted/50"
                  } hover:bg-muted`}
                >
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`font-medium text-sm ${notification.read ? "" : "text-foreground"}`}>
                          {notification.title}
                        </p>
                        {notification.message && (
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {notification.message}
                          </p>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.createdAt
                        ? formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              )

              if (notification.link) {
                return (
                  <Link
                    key={notification.id}
                    href={notification.link}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  >
                    {content}
                  </Link>
                )
              }

              return (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  className="cursor-pointer"
                >
                  {content}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
