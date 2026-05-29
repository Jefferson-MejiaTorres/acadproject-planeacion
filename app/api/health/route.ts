import { auth } from "@/lib/auth"

export async function GET() {
  try {
    // Test database connection
    const pool = (auth.options.database as any)
    const result = await pool.query("SELECT NOW()")
    
    // Check if tables exist
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    
    const userTable = await pool.query(`
      SELECT * FROM "user" LIMIT 1
    `).catch(err => ({ rows: [], error: err.message }))
    
    return Response.json({
      status: "ok",
      database: {
        connected: true,
        time: result.rows[0]?.now,
      },
      tables: tables.rows.map((r: any) => r.table_name),
      userTableExists: !userTable.error,
      userTableError: userTable.error,
    })
  } catch (error: any) {
    return Response.json({
      status: "error",
      message: error?.message || String(error),
      details: error,
    }, { status: 500 })
  }
}
