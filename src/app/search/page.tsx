import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'

async function searchArticles(query: string, page: number = 1) {
  const limit = 10
  const skip = (page - 1) * limit

  if (!query) {
    return { articles: [], total: 0, pagination: { page: 1, limit, total: 0, pages: 0 } }
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        author: {
          select: { name: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.article.count({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } }
        ]
      }
    })
  ])

  return {
    articles,
    total,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const params = await searchParams
  const query = params.q || ''
  const page = parseInt(params.page || '1')
  const { articles, total, pagination } = await searchArticles(query, page)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                Pontigram News
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-600 hover:text-blue-600">
                  Home
                </Link>
                <Link href="/categories" className="text-gray-600 hover:text-blue-600">
                  Categories
                </Link>
                <Link
                  href="/admin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Admin Dashboard
                </Link>
              </nav>
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      {/* Search Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              {total > 0 ? (
                <>
                  Found <span className="font-semibold">{total}</span> result{total !== 1 ? 's' : ''} for "
                  <span className="font-semibold">{query}</span>"
                </>
              ) : (
                <>
                  No results found for "<span className="font-semibold">{query}</span>"
                </>
              )}
            </p>
          )}
        </div>

        {!query ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Your Search</h2>
            <p className="text-gray-600">Enter keywords to find articles that interest you.</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.1-5.291-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h2>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or browse our categories.</p>
            <Link
              href="/categories"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <div className="aspect-video relative bg-gray-200">
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100">
                          <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:w-2/3 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center mb-2 md:mb-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full w-fit">
                        {article.category.name}
                      </span>
                      <span className="hidden md:inline mx-2 text-gray-300">•</span>
                      <span className="text-gray-500 text-xs md:text-sm mt-1 md:mt-0">
                        {formatDate(new Date(article.publishedAt!))}
                      </span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    {article.excerpt && (
                      <p className="text-gray-600 mb-3 md:mb-4 leading-relaxed text-sm md:text-base line-clamp-2 md:line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-gray-500">
                        By {article.author.name}
                      </span>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-xs md:text-sm transition-colors"
                      >
                        <span className="hidden md:inline">Read More</span>
                        <span className="md:hidden">Read</span>
                        <svg className="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex space-x-2">
                  {page > 1 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  )}
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/search?q=${encodeURIComponent(query)}&page=${pageNum}`}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        pageNum === page
                          ? 'text-white bg-blue-600 border border-blue-600'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ))}
                  
                  {page < pagination.pages && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Next
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-2">Pontigram News</h4>
            <p className="text-gray-400">
              Your trusted source for news and information.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
