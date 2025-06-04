import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Always return success to prevent breaking user experience
  // Analytics is non-critical functionality

  try {
    console.log('📊 Analytics tracking request received')

    // Try to parse body but don't fail if it's invalid
    let body = {}
    try {
      body = await request.json()
      console.log('📊 Analytics data:', body)
    } catch (parseError) {
      console.log('📊 Analytics: Invalid JSON, but continuing...')
    }

    // In production, you could implement actual analytics here
    // For now, just log and return success

    return NextResponse.json({
      success: true,
      message: 'Analytics tracking received',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('📊 Analytics error (non-critical):', error)

    // Always return success - analytics should never break the app
    return NextResponse.json({
      success: true,
      message: 'Analytics tracking completed (with fallback)',
      timestamp: new Date().toISOString()
    })
  }
}

// Also handle GET requests
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Analytics endpoint is operational',
    timestamp: new Date().toISOString()
  })
}
