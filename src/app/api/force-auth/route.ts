import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔐 Force authentication test for:', email)

    // Use direct PostgreSQL connection - bypass Prisma completely
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })

    const client = await pool.connect()

    try {
      console.log('🔗 Database connected successfully')

      // Check if user exists
      const userQuery = 'SELECT "id", "email", "password", "name", "role" FROM "users" WHERE "email" = $1'
      const userResult = await client.query(userQuery, [email])

      if (userResult.rows.length === 0) {
        console.log('❌ User not found:', email)
        return NextResponse.json({
          success: false,
          message: 'User tidak ditemukan',
          debug: {
            email: email,
            userCount: userResult.rows.length,
            connectionString: process.env.DATABASE_URL?.substring(0, 50) + '...'
          }
        }, { status: 401 })
      }

      const user = userResult.rows[0]
      console.log('👤 User found:', { email: user.email, role: user.role })

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      
      console.log('🔐 Password verification:', isPasswordValid ? 'VALID' : 'INVALID')

      if (!isPasswordValid) {
        return NextResponse.json({
          success: false,
          message: 'Password salah',
          debug: {
            email: user.email,
            passwordProvided: password,
            passwordLength: password.length,
            hashInDb: user.password.substring(0, 20) + '...',
            hashLength: user.password.length
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

      console.log('✅ Authentication successful!')

      return NextResponse.json({
        success: true,
        message: 'Authentication berhasil!',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        debug: {
          connectionString: process.env.DATABASE_URL?.substring(0, 50) + '...',
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString()
        }
      })

    } finally {
      client.release()
      await pool.end()
    }

  } catch (error) {
    console.error('💥 Force authentication failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Authentication test gagal',
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlPreview: process.env.DATABASE_URL ? 
          process.env.DATABASE_URL.substring(0, 50) + '...' : 'Not set',
        environment: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log('🔍 Testing database connection and environment...')

    return NextResponse.json({
      success: true,
      message: 'Force auth endpoint ready',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        dbUrlPreview: process.env.DATABASE_URL ? 
          process.env.DATABASE_URL.substring(0, 50) + '...' : 'Not set',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('💥 Environment check failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Environment check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
