import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Testing authentication for:', email)

    // Create direct PostgreSQL connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })

    const client = await pool.connect()

    try {
      // Check if user exists
      const userQuery = 'SELECT "id", "email", "password", "name", "role" FROM "users" WHERE "email" = $1'
      const userResult = await client.query(userQuery, [email])

      if (userResult.rows.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'User tidak ditemukan',
          debug: {
            email: email,
            userCount: userResult.rows.length
          }
        }, { status: 401 })
      }

      const user = userResult.rows[0]
      console.log('User found:', { email: user.email, role: user.role })

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      
      if (!isPasswordValid) {
        return NextResponse.json({
          success: false,
          message: 'Password salah',
          debug: {
            email: user.email,
            passwordProvided: password.length + ' characters',
            hashInDb: user.password.substring(0, 20) + '...'
          }
        }, { status: 401 })
      }

      // Check if user is admin
      if (user.role !== 'ADMIN') {
        return NextResponse.json({
          success: false,
          message: 'Akses ditolak. Diperlukan hak admin.',
          debug: {
            email: user.email,
            role: user.role
          }
        }, { status: 403 })
      }

      return NextResponse.json({
        success: true,
        message: 'Authentication berhasil',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      })

    } finally {
      client.release()
      await pool.end()
    }

  } catch (error) {
    console.error('Authentication test failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Authentication test gagal',
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlPreview: process.env.DATABASE_URL ? 
          process.env.DATABASE_URL.substring(0, 50) + '...' : 'Not set'
      }
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Test database connection and show table info
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })

    const client = await pool.connect()

    try {
      // Check tables
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'categories', 'articles', 'analytics')
      `)

      // Count users
      const usersResult = await client.query('SELECT COUNT(*) as count FROM "users"')
      const adminResult = await client.query('SELECT "email", "role" FROM "users" WHERE "role" = $1', ['ADMIN'])

      return NextResponse.json({
        success: true,
        message: 'Database connection berhasil',
        data: {
          tables: tablesResult.rows.map(r => r.table_name),
          userCount: parseInt(usersResult.rows[0].count),
          adminUsers: adminResult.rows,
          environment: {
            nodeEnv: process.env.NODE_ENV,
            hasDbUrl: !!process.env.DATABASE_URL,
            hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
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
      message: 'Database test gagal',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
