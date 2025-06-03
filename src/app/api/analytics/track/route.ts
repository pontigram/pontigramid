import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, title, articleId, referrer, sessionId } = body

    // Get client info
    const userAgent = request.headers.get('user-agent') || undefined
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown'
    
    // Hash IP address for privacy
    const hashedIp = crypto.createHash('sha256').update(clientIp).digest('hex').substring(0, 16)

    // Create analytics record
    const analytics = await prisma.analytics.create({
      data: {
        page,
        title,
        userAgent,
        ipAddress: hashedIp,
        referrer,
        sessionId,
        articleId: articleId || undefined,
      }
    })

    return NextResponse.json({ success: true, id: analytics.id })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}
