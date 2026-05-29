import { betterAuth } from "better-auth"
import { Pool } from "pg"

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL environment variable is not set")
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("❌ BETTER_AUTH_SECRET environment variable is not set")
}

console.log("🔧 Inicializando autenticación con:")
console.log("   DATABASE_URL:", process.env.DATABASE_URL.replace(/:[^@]*@/, ":****@"))
console.log("   BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL)

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('error', (err) => {
  console.error("❌ Pool error:", err)
})

pool.on('connect', () => {
  console.log("✅ PostgreSQL connected")
})

const getBaseURL = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

const getTrustedOrigins = () => {
  const origins: string[] = []
  if (process.env.BETTER_AUTH_URL) origins.push(process.env.BETTER_AUTH_URL)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    origins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  if (process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`)
  return origins
}

export const auth = betterAuth({
  database: pool,
  baseURL: getBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: getTrustedOrigins(),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
      secure: process.env.NODE_ENV === "development" ? false : true,
    },
  },
})

// Test connection on startup
if (process.env.NODE_ENV === "development") {
  pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error("❌ Database connection failed:", err.message)
    } else {
      console.log("✅ Database connection successful at", res.rows[0].now)
    }
  })
}
