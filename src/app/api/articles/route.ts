import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const published = searchParams.get('published')
  const includeAll = searchParams.get('includeAll')
  const breakingOnly = searchParams.get('breakingOnly')

  const skip = (page - 1) * limit

  const where: any = {}

  if (includeAll !== 'true') {
    if (published !== null) {
      where.published = published !== 'false'
    } else {
      where.published = true // Default to published only
    }
  }

  if (breakingOnly === 'true') {
    where.isBreakingNews = true
    where.published = true
  }

  if (category) {
    where.category = {
      slug: category
    }
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } }
    ]
  }

  try {

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: { name: true, email: true }
          },
          category: {
            select: { name: true, slug: true }
          }
        },
        orderBy: breakingOnly === 'true'
          ? [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
          : [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: breakingOnly === 'true' ? 0 : skip,
        take: breakingOnly === 'true' ? 5 : limit
      }),
      prisma.article.count({ where })
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Check for localStorage-based auth or NextAuth session
  const authHeader = request.headers.get('authorization')
  const isLocalStorageAuth = authHeader === 'Bearer admin-localStorage-auth'

  let isAuthorized = false
  let userId = null

  if (isLocalStorageAuth) {
    // Accept localStorage-based auth for admin
    isAuthorized = true
    userId = 'admin-localStorage'
  } else {
    // Fallback to NextAuth session
    const session = await getServerSession(authOptions)
    if (session && session.user.role === 'ADMIN') {
      isAuthorized = true
      userId = session.user.id
    }
  }

  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { title, content, excerpt, categoryId, featuredImage, published, isBreakingNews } = body

    // Validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    console.log(`Category validation: categoryId=${categoryId}, found=${!!category}`)

    if (!category) {
      console.error(`Category validation failed: categoryId=${categoryId}`)
      return NextResponse.json(
        { error: 'Invalid category selected' },
        { status: 400 }
      )
    }

    console.log(`Category validation successful: ${category.name} (${category.id})`)

    const slug = generateSlug(title)

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug }
    })

    let finalSlug = slug
    if (existingArticle) {
      finalSlug = `${slug}-${Date.now()}`
    }

    // Get or create admin user for localStorage auth
    let adminUser

    if (isLocalStorageAuth) {
      // For localStorage auth, get or create admin user
      try {
        adminUser = await prisma.user.findUnique({
          where: { email: 'admin@pontigram.com' }
        })

        if (!adminUser) {
          // Create admin user if doesn't exist
          const bcrypt = require('bcryptjs')
          const hashedPassword = await bcrypt.hash('admin123', 12)

          adminUser = await prisma.user.create({
            data: {
              email: 'admin@pontigram.com',
              name: 'Administrator',
              password: hashedPassword,
              role: 'ADMIN'
            }
          })
        }
      } catch (error) {
        console.error('Error with admin user:', error)
        return NextResponse.json(
          { error: 'Failed to setup admin user' },
          { status: 500 }
        )
      }
    }

    const finalAuthorId = isLocalStorageAuth ? adminUser.id : userId

    // Create article in database
    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        content: content.trim(),
        excerpt: excerpt?.trim() || content.trim().substring(0, 200) + '...',
        featuredImage: featuredImage || null,
        published: published || false,
        publishedAt: published ? new Date() : null,
        isBreakingNews: isBreakingNews || false,
        authorId: finalAuthorId,
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

    console.log(`Article created successfully: ${article.title} (ID: ${article.id})`)

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Create article error:', error)
    return NextResponse.json(
      { error: 'Failed to create article. Please try again.' },
      { status: 500 }
    )
  }
}
