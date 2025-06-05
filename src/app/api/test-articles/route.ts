import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      count: articles.length,
      articles
    })
  } catch (error) {
    console.error('Test articles fetch error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch articles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
