import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import NewsTicker from '@/components/NewsTicker'
import MobileHeadlinesSlider from '@/components/MobileHeadlinesSlider'

async function getLatestArticles() {
  try {
    return await prisma.article.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20 // Increased to show more articles
    })
  } catch (error) {
    console.error('Database error in getLatestArticles:', error)
    return []
  }
}

async function getFeaturedArticles() {
  try {
    return await prisma.article.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 3 // Get top 3 articles for main headlines
    })
  } catch (error) {
    console.error('Database error in getFeaturedArticles:', error)
    return []
  }
}

async function getCompactArticles() {
  try {
    return await prisma.article.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: 3, // Skip the first 3 (featured articles)
      take: 8 // Get 8 articles for compact section
    })
  } catch (error) {
    console.error('Database error in getCompactArticles:', error)
    return []
  }
}

async function getAllPublishedArticles() {
  try {
    return await prisma.article.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    })
  } catch (error) {
    console.error('Database error in getAllPublishedArticles:', error)
    return []
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { published: true } } }
        }
      },
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    console.error('Database error in getCategories:', error)
    return []
  }
}

export default async function Home() {
  try {
    const [articles, allArticles, featuredArticles, compactArticles, categories] = await Promise.all([
      getLatestArticles(),
      getAllPublishedArticles(),
      getFeaturedArticles(),
      getCompactArticles(),
      getCategories()
    ])

    // If no data available, show empty state
    if (!articles.length && !allArticles.length && !featuredArticles.length && !compactArticles.length) {
      return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
          <Header categories={categories} showCategories={true} variant="homepage" />

          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="card-modern p-8 md:p-12">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>

              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                Selamat Datang di Portal Berita Pontigram
              </h1>

              <p className="font-body text-lg mb-6" style={{ color: 'var(--secondary)' }}>
                Portal berita ini sedang dalam tahap setup. Belum ada artikel yang dipublikasikan.
              </p>

              <div className="space-y-4">
                <p className="font-body text-sm" style={{ color: 'var(--secondary)' }}>
                  Untuk mulai menggunakan portal berita:
                </p>

                <div className="text-left max-w-md mx-auto space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <span className="text-sm">Login ke admin dashboard</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <span className="text-sm">Buat categories berita</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <span className="text-sm">Publikasikan artikel pertama</span>
                  </div>
                </div>

                <div className="pt-6">
                  <a
                    href="/admin"
                    className="btn-primary inline-flex items-center"
                  >
                    Akses Admin Dashboard
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Unified Header */}
      <Header
        categories={categories}
        showCategories={true}
        variant="homepage"
      />

      {/* Enhanced News Ticker */}
      <NewsTicker
        newsItems={allArticles.slice(0, 10).map(article => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || undefined,
          featuredImage: article.featuredImage || undefined,
          publishedAt: article.publishedAt?.toISOString() || undefined,
          createdAt: article.createdAt.toISOString(),
          isBreakingNews: article.isBreakingNews || false,
          priority: article.isBreakingNews ? 'breaking' as const : 'normal' as const,
          category: {
            name: article.category.name,
            slug: article.category.slug
          }
        }))}
        isSticky={false}
        showSideTicker={true}
      />

      {/* Main Headlines Section - Berita Utama */}
      {featuredArticles.length > 0 && (
        <section className="py-8 md:py-12" style={{ backgroundColor: 'var(--background-secondary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 md:mb-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                Berita Utama
              </h2>
              <p className="font-body text-sm md:text-base" style={{ color: 'var(--secondary)' }}>
                Berita terpenting dan terbaru hari ini
              </p>
            </div>

            {/* Desktop: Horizontal Row Layout */}
            <div className="hidden md:flex flex-col lg:flex-row gap-6 lg:gap-8">
              {featuredArticles.map((article, index) => {
                const categoryClass = `category-${article.category.slug}`;

                return (
                  <article
                    key={article.id}
                    className="flex-1 card-modern overflow-hidden hover-lift-sm"
                  >
                    {/* Featured Image */}
                    <div className="aspect-video relative">
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                          <svg className="w-12 h-12 md:w-16 md:h-16" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-white text-xs md:text-sm font-semibold px-3 py-1 rounded ${categoryClass}`}>
                          {article.category.name}
                        </span>
                      </div>

                      {/* Breaking News Badge */}
                      {article.isBreakingNews && (
                        <div className="absolute top-3 right-3">
                          <span className="text-white text-xs md:text-sm font-bold px-3 py-1 rounded" style={{ backgroundColor: 'var(--news-breaking)' }}>
                            BREAKING
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Article Content */}
                    <div className="p-4 md:p-6">
                      {/* Meta Info */}
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 text-sm md:text-base font-bold">
                              {article.author.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div>
                            <div className="font-subheading font-semibold text-sm md:text-base" style={{ color: 'var(--primary)' }}>
                              {article.author.name}
                            </div>
                            <div className="text-xs md:text-sm" style={{ color: 'var(--secondary)' }}>
                              {formatDate(new Date(article.publishedAt!))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4 leading-tight" style={{ color: 'var(--primary)' }}>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="hover:opacity-80 transition-opacity"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="font-body text-sm md:text-base mb-4 md:mb-6 leading-relaxed line-clamp-3" style={{ color: 'var(--secondary)' }}>
                          {article.excerpt}
                        </p>
                      )}

                      {/* Read More Link */}
                      <div className="pt-3 md:pt-4" style={{ borderTop: `1px solid var(--border)` }}>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="inline-flex items-center text-sm md:text-base font-medium transition-colors"
                          style={{ color: 'var(--accent)' }}
                        >
                          Baca Selengkapnya
                          <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Mobile: Dynamic Slider Layout */}
            <div className="md:hidden">
              <MobileHeadlinesSlider
                articles={featuredArticles.map(article => ({
                  ...article,
                  excerpt: article.excerpt || undefined,
                  featuredImage: article.featuredImage || undefined,
                  publishedAt: article.publishedAt?.toISOString() || undefined,
                  author: {
                    name: article.author.name || 'Unknown'
                  }
                }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* Compact News Section */}
      {compactArticles.length > 0 && (
        <section className="py-8 md:py-12" style={{ backgroundColor: 'var(--background)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 md:mb-8">
              <h2 className="font-heading text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                Berita Lainnya
              </h2>
              <p className="font-body text-sm md:text-base" style={{ color: 'var(--secondary)' }}>
                Berita terbaru dalam format ringkas
              </p>
            </div>

            {/* Desktop: Grid Layout (unchanged) */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {compactArticles.map((article, index) => {
                const categoryClass = `category-${article.category.slug}`;

                return (
                  <article
                    key={article.id}
                    className="card-modern overflow-hidden hover-lift-sm"
                  >
                    {/* Compact Image */}
                    <div className="aspect-square relative">
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                          <svg className="w-8 h-8 md:w-10 md:h-10" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`text-white text-xs font-semibold px-2 py-1 rounded ${categoryClass}`}>
                          {article.category.name}
                        </span>
                      </div>

                      {/* Breaking News Badge */}
                      {article.isBreakingNews && (
                        <div className="absolute top-2 right-2">
                          <span className="text-white text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: 'var(--news-breaking)' }}>
                            BREAKING
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Compact Content */}
                    <div className="p-3 md:p-4">
                      {/* Compact Title */}
                      <h3 className="font-heading text-sm md:text-base font-bold mb-2 leading-tight line-clamp-2" style={{ color: 'var(--primary)' }}>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="hover:opacity-80 transition-opacity"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      {/* Minimal Meta Info */}
                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--secondary)' }}>
                        <span>{article.author.name}</span>
                        <span>{formatDate(new Date(article.publishedAt!))}</span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Mobile: Compact List Layout with Horizontal Scroll Option */}
            <div className="md:hidden">
              {/* Toggle between list and horizontal scroll */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></div>
                    <span className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>
                      {compactArticles.length} berita tersedia
                    </span>
                  </div>
                </div>
              </div>

              {/* Horizontal Scroll Layout */}
              <div className="overflow-x-auto pb-4 -mx-4 scrollbar-hide scroll-snap-x" style={{ scrollBehavior: 'smooth' }}>
                <div className="flex space-x-3 px-4" style={{ width: 'max-content' }}>
                  {compactArticles.map((article, index) => {
                    const categoryClass = `category-${article.category.slug}`;

                    return (
                      <article
                        key={`mobile-compact-${article.id}`}
                        className="card-modern p-3 hover-lift-sm flex-shrink-0 scroll-snap-start"
                        style={{ width: '280px' }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Small Thumbnail */}
                          <div className="w-20 h-20 flex-shrink-0 relative rounded-lg overflow-hidden">
                            {article.featuredImage ? (
                              <Image
                                src={article.featuredImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                                <svg className="w-8 h-8" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                              </div>
                            )}

                            {/* Breaking News Indicator */}
                            {article.isBreakingNews && (
                              <div className="absolute top-1 right-1">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--news-breaking)' }}></div>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Category Tag */}
                            <div className="mb-2">
                              <span className={`text-white text-xs font-medium px-2 py-1 rounded-full ${categoryClass}`}>
                                {article.category.name}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-heading text-sm font-bold mb-3 leading-tight line-clamp-3" style={{ color: 'var(--primary)' }}>
                              {article.title}
                            </h3>

                            {/* Read More Link */}
                            <Link
                              href={`/articles/${article.slug}`}
                              className="inline-flex items-center text-xs font-semibold transition-all duration-200 hover:translate-x-1"
                              style={{ color: 'var(--accent)' }}
                            >
                              Baca Selengkapnya
                              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="flex justify-center mt-3">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></div>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }}></div>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }}></div>
                  <span className="text-xs ml-2" style={{ color: 'var(--secondary)' }}>
                    Geser untuk melihat lebih banyak
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Chronological News Headlines Section */}
      {allArticles.length > 0 && (
        <section className="py-8 md:py-12" style={{ backgroundColor: 'var(--background)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 md:mb-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                Berita Terkini
              </h2>
              <p className="font-body text-sm md:text-base" style={{ color: 'var(--secondary)' }}>
                Daftar berita terbaru berdasarkan waktu publikasi
              </p>
            </div>

            {/* Chronological Headlines List - Desktop Layout */}
            <div className="hidden md:block space-y-4 md:space-y-6">
              {allArticles.map((article, index) => (
                <article
                  key={article.id}
                  className="card-modern p-4 md:p-6 hover-lift-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Article Image */}
                    <div className="w-full md:w-48 lg:w-56 flex-shrink-0">
                      <div className="aspect-video relative rounded-lg overflow-hidden">
                        {article.featuredImage ? (
                          <Image
                            src={article.featuredImage}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                            <svg className="w-8 h-8 md:w-12 md:h-12" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}

                        {/* Breaking News Badge */}
                        {article.isBreakingNews && (
                          <div className="absolute top-2 left-2">
                            <span className="text-white text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: 'var(--news-breaking)' }}>
                              BREAKING
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="flex-1">
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3">
                        <span className={`text-white text-xs font-semibold px-2 py-1 rounded category-${article.category.slug}`}>
                          {article.category.name}
                        </span>
                        <div className="flex items-center space-x-2 text-xs md:text-sm" style={{ color: 'var(--secondary)' }}>
                          <span>{article.author.name}</span>
                          <span>•</span>
                          <span>{formatDate(new Date(article.publishedAt!))}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 leading-tight" style={{ color: 'var(--primary)' }}>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="hover:opacity-80 transition-opacity"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="font-body text-sm md:text-base mb-3 md:mb-4 leading-relaxed line-clamp-2 md:line-clamp-3" style={{ color: 'var(--secondary)' }}>
                          {article.excerpt}
                        </p>
                      )}

                      {/* Read More Link */}
                      <Link
                        href={`/articles/${article.slug}`}
                        className="inline-flex items-center text-sm md:text-base font-medium transition-colors"
                        style={{ color: 'var(--accent)' }}
                      >
                        <span className="md:hidden">Baca</span>
                        <span className="hidden md:inline">Baca Selengkapnya</span>
                        <svg className="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Mobile Optimized Layout - 2 Column Grid */}
            <div className="md:hidden grid grid-cols-2 gap-3">
              {allArticles.map((article, index) => (
                <article
                  key={`mobile-${article.id}`}
                  className="card-modern p-3 hover-lift-sm"
                >
                  {/* Compact Article Image */}
                  <div className="aspect-square relative rounded-md overflow-hidden mb-3">
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                        <svg className="w-6 h-6" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-1 left-1">
                      <span className={`text-white text-xs font-semibold px-1.5 py-0.5 rounded category-${article.category.slug}`}>
                        {article.category.name}
                      </span>
                    </div>

                    {/* Breaking News Badge */}
                    {article.isBreakingNews && (
                      <div className="absolute top-1 right-1">
                        <span className="text-white text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--news-breaking)' }}>
                          BREAKING
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Compact Article Content */}
                  <div>
                    {/* Title - Prominent on Mobile */}
                    <h3 className="font-heading text-sm font-bold mb-2 leading-tight line-clamp-3" style={{ color: 'var(--primary)' }}>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="hover:opacity-80 transition-opacity"
                      >
                        {article.title}
                      </Link>
                    </h3>

                    {/* Compact Meta Info */}
                    <div className="flex items-center space-x-1 mb-2 text-xs" style={{ color: 'var(--secondary)' }}>
                      <span>{article.author.name}</span>
                      <span>•</span>
                      <span>{formatDate(new Date(article.publishedAt!))}</span>
                    </div>

                    {/* Read More Link */}
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center text-xs font-medium transition-colors"
                      style={{ color: 'var(--accent)' }}
                    >
                      Lihat Selengkapnya
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Show More Button */}
            {allArticles.length > 10 && (
              <div className="text-center mt-8 md:mt-12">
                <Link
                  href="/categories"
                  className="btn-accent px-6 py-3 font-semibold"
                >
                  Lihat Semua Berita
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}



      {/* Simplified Categories */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-12">
            <h3 className="font-heading text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
              Kategori Berita
            </h3>
            <p className="font-body text-sm md:text-base" style={{ color: 'var(--secondary)' }}>
              Temukan berita sesuai minat Anda
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 8).map((category) => {
              const categoryClass = `category-${category.slug}`;
              return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="card-modern p-4 md:p-6 text-center hover-lift-sm"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 rounded-lg flex items-center justify-center ${categoryClass}`}>
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h4 className="font-heading text-sm md:text-base font-bold mb-1" style={{ color: 'var(--primary)' }}>
                  {category.name}
                </h4>
                <p className="text-xs md:text-sm" style={{ color: 'var(--secondary)' }}>
                  {category._count.articles} artikel
                </p>
              </Link>
              )
            })}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link
              href="/categories"
              className="btn-accent px-6 py-3 font-semibold"
            >
              Lihat Semua Kategori
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-12" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <h4 className="font-heading text-2xl font-bold mb-4">Pontigram News</h4>
              <p className="font-body mb-6 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Portal berita terpercaya yang menyajikan informasi terkini, mendalam, dan berimbang
                tentang berbagai peristiwa di Indonesia dan dunia.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 rounded-full transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h5 className="font-subheading text-lg font-semibold mb-4">Navigasi</h5>
              <ul className="space-y-2">
                <li><Link href="/" className="font-body text-sm transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Beranda</Link></li>
                <li><Link href="/categories" className="font-body text-sm transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Kategori</Link></li>
                <li><Link href="/search" className="font-body text-sm transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Pencarian</Link></li>
                <li><Link href="/contact" className="font-body text-sm transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Kontak</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h5 className="font-subheading text-lg font-semibold mb-4">Kontak</h5>
              <div className="space-y-2">
                <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Email: redaksi@pontigram.news
                </p>
                <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Telepon: +62 21 1234 5678
                </p>
                <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Alamat: Jakarta, Indonesia
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t mt-8 pt-8" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                © 2024 Pontigram News. Seluruh hak cipta dilindungi.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Kebijakan Privasi
                </Link>
                <Link href="/terms" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Syarat & Ketentuan
                </Link>
                <Link href="/about" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Tentang Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
  } catch (error) {
    console.error('Homepage error:', error)

    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="card-modern p-8 md:p-12">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
              Server Configuration Error
            </h1>

            <p className="font-body text-lg mb-6" style={{ color: 'var(--secondary)' }}>
              Terjadi masalah dengan konfigurasi server. Silakan cek environment variables dan koneksi database.
            </p>

            <div className="pt-6">
              <a
                href="/api/health"
                className="btn-accent inline-flex items-center"
              >
                Test Health Check
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
