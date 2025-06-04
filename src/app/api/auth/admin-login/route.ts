import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('🔐 Admin login attempt via custom endpoint')
  
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      console.log('❌ Missing credentials')
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Attempting authentication for:', email)

    // Direct database connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost') ? false : {
        rejectUnauthorized: false
      }
    })

    try {
      const client = await pool.connect()
      
      try {
        const userQuery = 'SELECT "id", "email", "password", "name", "role" FROM "users" WHERE "email" = $1'
        const result = await client.query(userQuery, [email])

        if (result.rows.length === 0) {
          console.log('❌ User not found:', email)
          return NextResponse.json(
            { success: false, error: 'Invalid credentials' },
            { status: 401 }
          )
        }

        const user = result.rows[0]
        console.log('✅ User found:', { email: user.email, role: user.role })

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          console.log('❌ Invalid password for user:', email)
          return NextResponse.json(
            { success: false, error: 'Invalid credentials' },
            { status: 401 }
          )
        }

        if (user.role !== 'ADMIN') {
          console.log('❌ User is not admin:', email)
          return NextResponse.json(
            { success: false, error: 'Admin access required' },
            { status: 403 }
          )
        }

        // Create JWT token
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          process.env.NEXTAUTH_SECRET || 'fallback-secret',
          { expiresIn: '24h' }
        )

        console.log('✅ Authentication successful for:', email)

        // Set cookie and return success
        const response = NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          redirectTo: '/admin'
        })

        // Set authentication cookie
        response.cookies.set('admin-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 // 24 hours
        })

        return response

      } finally {
        client.release()
      }
    } finally {
      await pool.end()
    }

  } catch (error) {
    console.error('💥 Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
