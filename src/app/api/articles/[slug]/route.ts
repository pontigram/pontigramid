import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Unwrap the async params
    const { slug } = await params

    // Check if slug is actually an ID (UUID format)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    let article
    if (isUUID) {
      // Search by ID
      article = await prisma.article.findUnique({
        where: { id: slug },
        include: {
          author: {
            select: { name: true, email: true }
          },
          category: {
            select: { name: true, slug: true }
          }
        }
      })
    } else {
      // Search by slug (for public access)
      article = await prisma.article.findUnique({
        where: {
          slug: slug,
          published: true
        },
        include: {
          author: {
            select: { name: true, email: true }
          },
          category: {
            select: { name: true, slug: true }
          }
        }
      })
    }

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Unwrap the async params
    const { slug } = await params

    const body = await request.json()
    const { title, content, excerpt, categoryId, featuredImage, published } = body

    const newSlug = generateSlug(title)

    // Check if slug is actually an ID (UUID format)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    const whereClause = isUUID ? { id: slug } : { slug: slug }

    const article = await prisma.article.update({
      where: whereClause,
      data: {
        title,
        slug: newSlug,
        content,
        excerpt,
        featuredImage,
        published: published || false,
        publishedAt: published ? new Date() : null,
        categoryId
      },
      include: {
        author: {
          select: { name: true, email: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Unwrap the async params
    const { slug } = await params

    // Check if slug is actually an ID (UUID format)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    const whereClause = isUUID ? { id: slug } : { slug: slug }

    await prisma.article.delete({
      where: whereClause
    })

    return NextResponse.json({ message: 'Article deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
