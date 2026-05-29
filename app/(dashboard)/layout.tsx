import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/login")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
