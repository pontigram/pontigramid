import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Invalid JSON in analytics request:', parseError)
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
    }

    const { page, title, articleId, referrer, sessionId } = body

    // Validate required fields
    if (!page) {
      return NextResponse.json({ success: false, error: 'Page is required' }, { status: 400 })
    }

    // Get client info safely
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown'

    // Hash IP address for privacy
    let hashedIp = 'unknown'
    try {
      hashedIp = crypto.createHash('sha256').update(clientIp).digest('hex').substring(0, 16)
    } catch (hashError) {
      console.warn('Failed to hash IP address:', hashError)
    }

    // Try to create analytics record with fallback
    try {
      const analytics = await prisma.analytics.create({
        data: {
          page: page.substring(0, 255), // Limit length
          title: title ? title.substring(0, 255) : null,
          userAgent: userAgent.substring(0, 500),
          ipAddress: hashedIp,
          referrer: referrer ? referrer.substring(0, 255) : null,
          sessionId: sessionId ? sessionId.substring(0, 100) : null,
          articleId: articleId || null,
        }
      })

      return NextResponse.json({ success: true, id: analytics.id })
    } catch (dbError) {
      console.error('Database error in analytics:', dbError)

      // Return success even if analytics fails (don't break user experience)
      return NextResponse.json({
        success: true,
        warning: 'Analytics tracking temporarily unavailable'
      })
    }

  } catch (error) {
    console.error('Analytics tracking error:', error)

    // Return success to not break user experience
    return NextResponse.json({
      success: true,
      warning: 'Analytics tracking temporarily unavailable'
    })
  }
}
