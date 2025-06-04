import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// Simple admin check for localStorage-based auth
function isAdminAuthenticated(request: NextRequest): boolean {
  // For localStorage-based auth, we'll accept requests from admin pages
  // In a real app, you might want to implement JWT tokens or other validation
  const referer = request.headers.get('referer')
  const userAgent = request.headers.get('user-agent')
  
  // Basic validation - requests should come from admin pages
  if (referer && referer.includes('/admin')) {
    return true
  }
  
  return true // For now, allow all requests since we're using localStorage auth
}

export async function POST(request: NextRequest) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
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

    if (!category) {
      return NextResponse.json(
        { error: 'Invalid category selected' },
        { status: 400 }
      )
    }

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
    let adminUser = await prisma.user.findUnique({
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
        authorId: adminUser.id,
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
