import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const pool = (auth.options.database as any)
    
    // Get all user details
    const users = await pool.query('SELECT id, email, name, "createdAt" FROM "user" LIMIT 10')
    
    // Get table schemas
    const schemas = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `)
    
    // Group by table
    const tableSchemas: Record<string, any[]> = {}
    schemas.rows.forEach((row: any) => {
      if (!tableSchemas[row.table_name]) {
        tableSchemas[row.table_name] = []
      }
      tableSchemas[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable
      })
    })
    
    return Response.json({
      status: "ok",
      users: {
        count: users.rows.length,
        data: users.rows
      },
      tables: tableSchemas
    })
  } catch (error: any) {
    return Response.json({
      status: "error",
      message: error?.message || String(error),
      code: error?.code,
    }, { status: 500 })
  }
}
