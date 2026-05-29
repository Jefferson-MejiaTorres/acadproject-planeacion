import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  FolderKanban,
  Users,
  Kanban,
  Bell,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

const features = [
  {
    icon: FolderKanban,
    title: "Gestión de Proyectos",
    description: "Crea y organiza proyectos académicos con tu equipo de forma sencilla.",
  },
  {
    icon: Kanban,
    title: "Tablero Kanban",
    description: "Visualiza el progreso de tareas con arrastrar y soltar intuitivo.",
  },
  {
    icon: Users,
    title: "Colaboración en Equipo",
    description: "Invita compañeros, asigna tareas y trabaja en conjunto.",
  },
  {
    icon: Bell,
    title: "Notificaciones",
    description: "Mantente informado sobre cambios y asignaciones en tiempo real.",
  },
]

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">AcadProject</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/registro">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <CheckCircle2 className="h-4 w-4" />
            Ideal para estudiantes universitarios
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight max-w-4xl mx-auto text-balance">
            Gestiona tus proyectos académicos de forma{" "}
            <span className="text-primary">simple y efectiva</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto text-pretty">
            AcadProject te ayuda a organizar proyectos grupales, asignar tareas, hacer seguimiento del
            progreso y mantener a tu equipo coordinado.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button size="lg" asChild>
              <Link href="/registro">
                Comenzar gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Ya tengo cuenta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Todo lo que necesitas para tu equipo</h2>
            <p className="text-muted-foreground mt-2">
              Herramientas diseñadas para facilitar la colaboración académica
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">¿Listo para organizar tus proyectos?</h2>
          <p className="text-muted-foreground mt-2 mb-8">
            Crea tu cuenta gratis y comienza a colaborar con tu equipo
          </p>
          <Button size="lg" asChild>
            <Link href="/registro">
              Crear cuenta gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AcadProject. Diseñado para estudiantes.</p>
        </div>
      </footer>
    </div>
  )
}
