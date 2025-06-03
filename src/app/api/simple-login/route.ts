import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Simple login attempt for:', email)

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
          message: 'Email atau password salah'
        }, { status: 401 })
      }

      const user = userResult.rows[0]

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      
      if (!isPasswordValid) {
        return NextResponse.json({
          success: false,
          message: 'Email atau password salah'
        }, { status: 401 })
      }

      // Check if user is admin
      if (user.role !== 'ADMIN') {
        return NextResponse.json({
          success: false,
          message: 'Akses ditolak. Diperlukan hak admin.'
        }, { status: 403 })
      }

      // Create JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.NEXTAUTH_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      )

      // Set cookie
      const response = NextResponse.json({
        success: true,
        message: 'Login berhasil',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        redirectUrl: '/admin'
      })

      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 // 24 hours
      })

      return response

    } finally {
      client.release()
      await pool.end()
    }

  } catch (error) {
    console.error('Simple login failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
