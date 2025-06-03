import { NextResponse } from 'next/server'
import { prisma, testDatabaseConnection } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const dbConnected = await testDatabaseConnection()
    
    if (!dbConnected) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Test basic queries
    const [articleCount, categoryCount, userCount] = await Promise.all([
      prisma.article.count().catch(() => 0),
      prisma.category.count().catch(() => 0),
      prisma.user.count().catch(() => 0)
    ])

    return NextResponse.json({
      status: 'ok',
      message: 'Server is healthy',
      database: {
        connected: true,
        articles: articleCount,
        categories: categoryCount,
        users: userCount
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasDirectUrl: !!process.env.DIRECT_URL,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
