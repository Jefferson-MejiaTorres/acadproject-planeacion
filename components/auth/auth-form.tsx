"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { mockAuthClient } from "@/lib/mock-auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, GraduationCap } from "lucide-react"

interface AuthFormProps {
  mode: "sign-in" | "sign-up"
}

// Usar mock auth en desarrollo si NEXT_PUBLIC_MOCK_AUTH está activado
const useAuthClient = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
    return mockAuthClient
  }
  return authClient
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const auth = useAuthClient()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === "true"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!isMockMode) {
        // En modo real, verificar health check
        const healthCheck = await fetch("/api/health")
        const health = await healthCheck.json()
        console.log("🏥 Health check:", health)

        if (!healthCheck.ok) {
          setError("❌ Error de conexión con la base de datos. Verifica tu configuración.")
          setLoading(false)
          return
        }
      } else {
        console.log("🎭 Modo MOCK activado - usando datos de prueba")
      }

      if (mode === "sign-up") {
        console.log("📝 Intentando registrar usuario:", { email, name })
        const result = await auth.signUp.email({
          email,
          password,
          name,
        })

        console.log("📥 Respuesta del servidor:", result)

        if (result.error) {
          const errorMsg =
            result.error && typeof result.error === "object"
              ? JSON.stringify(result.error)
              : String(result.error)
          console.error("❌ Sign up error:", errorMsg)
          setError(
            (result.error as any)?.message || `Error al crear la cuenta: ${errorMsg}`
          )
          setLoading(false)
          return
        }
        console.log("✅ Usuario registrado:", result.data)

        // Guardar sesión mock en localStorage
        if (isMockMode && result.data?.session) {
          localStorage.setItem("mock_session", JSON.stringify(result.data.session))
          localStorage.setItem("mock_user", JSON.stringify(result.data.user))
        }
      } else {
        console.log("🔐 Intentando iniciar sesión:", { email })
        const result = await auth.signIn.email({
          email,
          password,
        })

        console.log("📥 Respuesta del servidor:", result)

        if (result.error) {
          const errorMsg =
            result.error && typeof result.error === "object"
              ? JSON.stringify(result.error)
              : String(result.error)
          console.error("❌ Sign in error:", errorMsg)
          setError((result.error as any)?.message || "Credenciales incorrectas")
          setLoading(false)
          return
        }
        console.log("✅ Sesión iniciada:", result.data)

        // Guardar sesión mock en localStorage
        if (isMockMode && result.data?.session) {
          localStorage.setItem("mock_session", JSON.stringify(result.data.session))
          localStorage.setItem("mock_user", JSON.stringify(result.data.user))
        }
      }

      console.log("🚀 Redirigiendo a /dashboard...")
      // Give it a moment for the session to be established
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 500)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error("❌ Error de autenticación:", errorMsg, err)
      setError(`Ocurrió un error: ${errorMsg}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {mode === "sign-in" ? "Iniciar Sesión" : "Crear Cuenta"}
          </CardTitle>
          <CardDescription>
            {mode === "sign-in"
              ? "Ingresa tus credenciales para acceder"
              : "Completa tus datos para registrarte"}
          </CardDescription>
          {isMockMode && (
            <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              🎭 Modo de prueba (Mock Data)
            </div>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {mode === "sign-up" && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@universidad.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "sign-in" ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {mode === "sign-in" ? (
                <>
                  ¿No tienes cuenta?{" "}
                  <Link href="/registro" className="text-primary hover:underline">
                    Regístrate
                  </Link>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Inicia sesión
                  </Link>
                </>
              )}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
