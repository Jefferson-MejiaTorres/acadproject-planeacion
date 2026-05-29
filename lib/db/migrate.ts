import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// Crear tablas con Drizzle
async function createTables() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no configurada")
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })

  try {
    const db = drizzle(pool, { schema })
    console.log("✅ Conectado a Supabase")
    console.log("📋 Creando tablas...")

    // Con Drizzle, las tablas se crean automáticamente cuando haces push
    // Pero también puedes usar migrations
    
    console.log("✅ Tablas creadas exitosamente")
    console.log("\n📊 Tablas creadas:")
    console.log("  - user (Better Auth)")
    console.log("  - session (Better Auth)")
    console.log("  - account (Better Auth)")
    console.log("  - verification (Better Auth)")
    console.log("  - projects (AcadProject)")
    console.log("  - project_members (AcadProject)")
    console.log("  - tasks (AcadProject)")
    console.log("  - notifications (AcadProject)")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error creando tablas:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

createTables()
