import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check for admin token in cookies
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any

    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Invalid or insufficient permissions' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      }
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // Logout endpoint
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  
  // Clear the admin token cookie
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0 // Expire immediately
  })

  return response
}
