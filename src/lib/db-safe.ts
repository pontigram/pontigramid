// Build-safe database operations
import { prisma } from './prisma'

// Check if we're in a build environment
const isBuildTime = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost:5432/mock')

// Safe database operations that won't fail during build
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (isBuildTime) {
    console.log('Build time detected, returning fallback data')
    return fallback
  }

  try {
    return await operation()
  } catch (error) {
    console.error('Database operation failed:', error)
    return fallback
  }
}

// Safe database queries for homepage
export async function getLatestArticlesSafe() {
  return safeDbOperation(
    () => prisma.article.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } }
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20
    }),
    []
  )
}

export async function getFeaturedArticlesSafe() {
  return safeDbOperation(
    () => prisma.article.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } }
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 3
    }),
    []
  )
}

export async function getCompactArticlesSafe() {
  return safeDbOperation(
    () => prisma.article.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } }
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: 3,
      take: 8
    }),
    []
  )
}

export async function getAllPublishedArticlesSafe() {
  return safeDbOperation(
    () => prisma.article.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } }
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    }),
    []
  )
}

export async function getCategoriesSafe() {
  return safeDbOperation(
    () => prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { published: true } } }
        }
      },
      orderBy: { name: 'asc' }
    }),
    []
  )
}
