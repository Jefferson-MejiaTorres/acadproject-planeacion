import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"

export default async function RegistroPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect("/dashboard")

  return <AuthForm mode="sign-up" />
}
