"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, GraduationCap } from "lucide-react"

interface AuthFormProps {
  mode: "sign-in" | "sign-up"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (mode === "sign-up") {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        })
        if (result.error) {
          setError(result.error.message || "Error al crear la cuenta")
          setLoading(false)
          return
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        })
        if (result.error) {
          setError(result.error.message || "Credenciales incorrectas")
          setLoading(false)
          return
        }
      }
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Ocurrió un error. Intenta de nuevo.")
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
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
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
