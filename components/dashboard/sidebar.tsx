"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  User,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/notificaciones", label: "Notificaciones", icon: Bell },
  { href: "/perfil", label: "Mi Perfil", icon: User },
]

interface SidebarProps {
  userName: string
  userEmail: string
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-card border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shrink-0">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-lg">AcadProject</span>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center mb-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
        
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full text-muted-foreground hover:text-foreground", collapsed ? "justify-center" : "justify-start")}
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="ml-2">Cerrar sesión</span>}
        </Button>
      </div>
    </aside>
  )
}
