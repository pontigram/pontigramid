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
    // Fallback articles that match the structure
    [
      {
        id: 'fallback-1',
        title: 'Selamat Datang di Pontigram News',
        slug: 'selamat-datang-pontigram-news',
        content: 'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya. Kami menyajikan berita lokal, nasional, dan internasional dengan akurat dan terpercaya.',
        excerpt: 'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.',
        featuredImage: null,
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { name: 'Administrator' },
        category: { name: 'Berita Terkini', slug: 'berita-terkini' }
      },
      {
        id: 'fallback-2',
        title: 'Budaya Melayu Pontianak yang Kaya',
        slug: 'budaya-melayu-pontianak-kaya',
        content: 'Pontianak memiliki kekayaan budaya Melayu yang sangat beragam. Dari tradisi, kuliner, hingga seni pertunjukan yang masih lestari hingga saat ini.',
        excerpt: 'Pontianak memiliki kekayaan budaya Melayu yang sangat beragam.',
        featuredImage: null,
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(Date.now() - 3600000),
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
        author: { name: 'Administrator' },
        category: { name: 'Budaya Melayu', slug: 'budaya-melayu' }
      },
      {
        id: 'fallback-3',
        title: 'Pariwisata Pontianak Menarik Wisatawan',
        slug: 'pariwisata-pontianak-menarik-wisatawan',
        content: 'Destinasi wisata di Pontianak semakin berkembang dan menarik minat wisatawan lokal maupun mancanegara.',
        excerpt: 'Destinasi wisata di Pontianak semakin berkembang dan menarik minat wisatawan.',
        featuredImage: null,
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(Date.now() - 7200000),
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000),
        author: { name: 'Administrator' },
        category: { name: 'Pariwisata', slug: 'pariwisata' }
      }
    ]
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
    // Featured articles fallback
    [
      {
        id: 'fallback-1',
        title: 'Selamat Datang di Pontigram News',
        slug: 'selamat-datang-pontigram-news',
        content: 'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.',
        excerpt: 'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.',
        featuredImage: null,
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { name: 'Administrator' },
        category: { name: 'Berita Terkini', slug: 'berita-terkini' }
      },
      {
        id: 'fallback-2',
        title: 'Budaya Melayu Pontianak yang Kaya',
        slug: 'budaya-melayu-pontianak-kaya',
        content: 'Pontianak memiliki kekayaan budaya Melayu yang sangat beragam.',
        excerpt: 'Pontianak memiliki kekayaan budaya Melayu yang sangat beragam.',
        featuredImage: null,
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(Date.now() - 3600000),
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
        author: { name: 'Administrator' },
        category: { name: 'Budaya Melayu', slug: 'budaya-melayu' }
      },
      {
        id: 'fallback-3',
        title: 'Pariwisata Pontianak Menarik Wisatawan',
        slug: 'pariwisata-pontianak-menarik-wisatawan',
        content: 'Destinasi wisata di Pontianak semakin berkembang dan menarik minat wisatawan.',
        excerpt: 'Destinasi wisata di Pontianak semakin berkembang dan menarik minat wisatawan.',
        featuredImage: null,
        published: true,
        isBreakingNews: false,
        publishedAt: new Date(Date.now() - 7200000),
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 7200000),
        author: { name: 'Administrator' },
        category: { name: 'Pariwisata', slug: 'pariwisata' }
      }
    ]
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
