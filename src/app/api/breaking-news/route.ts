import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        isBreakingNews: true,
        published: true
      },
      include: {
        author: {
          select: { name: true, email: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 5
    })

    return NextResponse.json({
      articles,
      total: articles.length
    })
  } catch (error) {
    console.error('Error fetching breaking news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch breaking news' },
      { status: 500 }
    )
  }
}
