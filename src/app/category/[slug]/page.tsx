import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { published: true },
        include: {
          author: {
            select: { name: true }
          },
          category: {
            select: { name: true, slug: true }
          }
        },
        orderBy: { publishedAt: 'desc' }
      }
    }
  })

  if (!category) {
    notFound()
  }

  return category
}

async function getCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { articles: { where: { published: true } } }
      }
    },
    orderBy: { name: 'asc' }
  })
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  // Unwrap the async params
  const { slug } = await params

  const [category, categories] = await Promise.all([
    getCategory(slug),
    getCategories()
  ])

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
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`hover:text-blue-600 ${
                    cat.slug === slug ? 'text-blue-600 font-medium' : 'text-gray-600'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/admin" className="text-gray-600 hover:text-blue-600">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Category Header */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-4">
              {category.articles.length} articles
            </p>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {category.articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {article.featuredImage && (
                    <div className="aspect-video relative">
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <span className="text-gray-500 text-sm">
                        {formatDate(new Date(article.publishedAt!))}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="hover:text-blue-600"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    {article.excerpt && (
                      <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        By {article.author.name}
                      </span>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600">
                There are no published articles in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Other Categories */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Other Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories
              .filter(cat => cat.slug !== slug)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="bg-gray-100 hover:bg-gray-200 rounded-lg p-4 text-center transition-colors"
                >
                  <h4 className="font-semibold text-gray-900">{cat.name}</h4>
                  <p className="text-sm text-gray-600">
                    {cat._count.articles} articles
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
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
