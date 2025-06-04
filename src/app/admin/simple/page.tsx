'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  published: boolean
  createdAt: string
  author: { name: string }
  category: { name: string; slug: string }
  isBreakingNews?: boolean
}

export default function SimpleAdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check localStorage authentication
    const isLoggedIn = localStorage.getItem('admin-logged-in')
    const adminUser = localStorage.getItem('admin-user')

    console.log('🔍 Checking authentication...')
    console.log('isLoggedIn:', isLoggedIn)
    console.log('adminUser:', adminUser)

    if (isLoggedIn === 'true' && adminUser) {
      console.log('✅ User authenticated')
      setAuthenticated(true)
      fetchArticles()
    } else {
      console.log('❌ User not authenticated, redirecting...')
      router.push('/admin/login')
    }
  }, [router])

  const fetchArticles = async () => {
    try {
      console.log('📰 Fetching articles...')
      const response = await fetch('/api/articles?includeAll=true')
      const data = await response.json()
      
      console.log('📊 Articles response:', data)
      
      if (data.articles) {
        setArticles(data.articles)
        console.log('✅ Articles loaded:', data.articles.length)
      }
    } catch (error) {
      console.error('❌ Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    console.log('🚪 Logging out...')
    localStorage.removeItem('admin-logged-in')
    localStorage.removeItem('admin-user')
    router.push('/admin/login')
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="w-32 h-32 border-b-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)' }}></div>
          <p className="mt-4 font-body" style={{ color: 'var(--secondary)' }}>Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="w-32 h-32 border-b-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)' }}></div>
          <p className="mt-4 font-body" style={{ color: 'var(--secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="bg-white border-b shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--primary)' }}>
                Simple Admin Dashboard
              </h1>
              <p className="text-sm font-body" style={{ color: 'var(--secondary)' }}>
                Selamat datang, Administrator
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="transition-colors font-body" style={{ color: 'var(--secondary)' }}>
                Lihat Situs
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white rounded-md transition-colors"
                style={{ backgroundColor: 'var(--news-danger)' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium font-subheading" style={{ color: 'var(--primary)' }}>
              Total Artikel
            </h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              {articles.length}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium font-subheading" style={{ color: 'var(--primary)' }}>
              Terpublikasi
            </h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--news-success)' }}>
              {articles.filter(a => a.published).length}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium font-subheading" style={{ color: 'var(--primary)' }}>
              Draft
            </h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--news-warning)' }}>
              {articles.filter(a => !a.published).length}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold font-subheading" style={{ color: 'var(--primary)' }}>
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/articles/new"
              className="px-4 py-2 text-white rounded-md transition-colors"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Buat Artikel Baru
            </Link>
            <Link
              href="/admin/categories"
              className="px-4 py-2 text-white rounded-md transition-colors"
              style={{ backgroundColor: 'var(--news-secondary)' }}
            >
              Kelola Kategori
            </Link>
            <Link
              href="/admin/ticker"
              className="px-4 py-2 text-white rounded-md transition-colors"
              style={{ backgroundColor: 'var(--news-warning)' }}
            >
              Kelola Ticker
            </Link>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-lg font-medium font-subheading" style={{ color: 'var(--primary)' }}>
              Artikel Terbaru ({articles.length})
            </h3>
          </div>
          <div className="p-6">
            {articles.length === 0 ? (
              <p className="text-center font-body" style={{ color: 'var(--secondary)' }}>
                Belum ada artikel. <Link href="/admin/articles/new" className="underline" style={{ color: 'var(--accent)' }}>Buat artikel pertama</Link>
              </p>
            ) : (
              <div className="space-y-4">
                {articles.slice(0, 10).map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <h4 className="font-medium font-body" style={{ color: 'var(--primary)' }}>
                        {article.title}
                      </h4>
                      <p className="text-sm font-body" style={{ color: 'var(--secondary)' }}>
                        {article.category.name} • {new Date(article.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full text-white`} style={{ backgroundColor: article.published ? 'var(--news-success)' : 'var(--news-warning)' }}>
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                      {article.isBreakingNews && (
                        <span className="px-2 py-1 text-xs text-white rounded-full" style={{ backgroundColor: 'var(--news-danger)' }}>
                          Breaking
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
