import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, isBreakingNews } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }
    
    // Update the article's breaking news status
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { isBreakingNews: Boolean(isBreakingNews) },
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
      article: updatedArticle
    })
  } catch (error) {
    console.error('Error updating breaking news status:', error)
    return NextResponse.json(
      { error: 'Failed to update breaking news status' },
      { status: 500 }
    )
  }
}
