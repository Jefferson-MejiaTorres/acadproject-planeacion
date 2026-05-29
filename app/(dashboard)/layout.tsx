import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { mockUser } from "@/lib/mock-data"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // En modo mock, permitir acceso directo
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === "true"
  
  let user = mockUser

  if (!isMockMode) {
    // En modo real, verificar sesión
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) redirect("/login")
    user = session.user
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userName={user.name || "Usuario"} userEmail={user.email} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
