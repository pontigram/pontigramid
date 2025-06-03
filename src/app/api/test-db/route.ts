import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  try {
    console.log('Testing database connection...')

    // Create a direct PostgreSQL connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })

    const client = await pool.connect()

    try {
      // Test basic connection
      const result = await client.query('SELECT NOW() as current_time')
      console.log('Database connected at:', result.rows[0].current_time)

      // Check if tables exist
      const tablesQuery = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'categories', 'articles', 'analytics')
        ORDER BY table_name;
      `
      const tablesResult = await client.query(tablesQuery)
      const tables = tablesResult.rows.map(row => row.table_name)

      // Count records in each table
      const counts = {}
      for (const table of tables) {
        try {
          const countResult = await client.query(`SELECT COUNT(*) as count FROM "${table}"`)
          counts[table] = parseInt(countResult.rows[0].count)
        } catch (error) {
          counts[table] = `Error: ${error.message}`
        }
      }

      // Check admin user specifically
      let adminUser = null
      if (tables.includes('users')) {
        try {
          const adminResult = await client.query(
            'SELECT "email", "name", "role" FROM "users" WHERE "role" = $1',
            ['ADMIN']
          )
          adminUser = adminResult.rows[0] || null
        } catch (error) {
          adminUser = `Error: ${error.message}`
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        data: {
          connected: true,
          currentTime: result.rows[0].current_time,
          tablesFound: tables,
          recordCounts: counts,
          adminUser: adminUser,
          environment: {
            nodeEnv: process.env.NODE_ENV,
            hasDbUrl: !!process.env.DATABASE_URL,
            hasDirectUrl: !!process.env.DIRECT_URL,
            dbUrlPreview: process.env.DATABASE_URL ? 
              process.env.DATABASE_URL.substring(0, 50) + '...' : 'Not set'
          }
        }
      })

    } finally {
      client.release()
      await pool.end()
    }

  } catch (error) {
    console.error('Database test failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
        dbUrlPreview: process.env.DATABASE_URL ? 
          process.env.DATABASE_URL.substring(0, 50) + '...' : 'Not set'
      }
    }, { status: 500 })
  }
}
