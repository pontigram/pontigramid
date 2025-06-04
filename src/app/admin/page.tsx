'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

interface Article {
  id: string
  title: string
  published: boolean
  createdAt: string
  author: { name: string }
  category: { name: string; slug: string }
  isBreakingNews?: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  _count: { articles: number }
}

interface DashboardStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  breakingNewsCount: number
  categoriesStats: Category[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    breakingNewsCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    // Check simple localStorage authentication
    const isLoggedIn = localStorage.getItem('admin-logged-in')
    const adminUser = localStorage.getItem('admin-user')

    if (isLoggedIn === 'true' && adminUser) {
      console.log('✅ Admin sudah login')
      fetchDashboardData()
    } else {
      console.log('❌ Belum login, redirect ke login page')
      router.push('/admin/direct-login')
    }
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        fetch('/api/articles?includeAll=true'),
        fetch('/api/categories')
      ])

      const articlesData = await articlesRes.json()
      const categoriesData = await categoriesRes.json()

      const allArticles = articlesData.articles || []
      setArticles(allArticles)
      setCategories(categoriesData.categories || [])

      // Calculate stats
      setStats({
        totalArticles: allArticles.length,
        publishedArticles: allArticles.filter((a: Article) => a.published).length,
        draftArticles: allArticles.filter((a: Article) => !a.published).length,
        breakingNewsCount: allArticles.filter((a: Article) => a.isBreakingNews).length
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setArticles(articles.filter(article => article.id !== id))
        // Refresh stats after deletion
        fetchDashboardData()
      } else {
        alert('Gagal menghapus artikel')
      }
    } catch (error) {
      console.error('Failed to delete article:', error)
      alert('Gagal menghapus artikel')
    }
  }

  const toggleBreakingNews = async (id: string, isBreaking: boolean) => {
    try {
      const response = await fetch(`/api/articles/${id}/breaking`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBreakingNews: isBreaking })
      })

      if (response.ok) {
        fetchDashboardData()
      } else {
        alert('Gagal mengupdate status breaking news')
      }
    } catch (error) {
      console.error('Failed to update breaking news:', error)
      alert('Gagal mengupdate status breaking news')
    }
  }

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => article.category.slug === selectedCategory)

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="w-32 h-32 border-b-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)' }}></div>
          <p className="mt-4 font-body" style={{ color: 'var(--secondary)' }}>Memuat...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="bg-white border-b shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="py-4">
            <Breadcrumb items={[
              { label: 'Beranda', href: '/' },
              { label: 'Dashboard Admin' }
            ]} />
          </div>
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold font-heading" style={{ color: 'var(--primary)' }}>
                Dashboard Admin
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/" className="transition-colors font-body" style={{ color: 'var(--secondary)' }}>
                Lihat Situs
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('admin-logged-in')
                  localStorage.removeItem('admin-user')
                  window.location.href = '/admin/direct-login'
                }}
                className="transition-colors font-body"
                style={{ color: 'var(--news-danger)' }}
              >
                Keluar
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Quick Actions Bar */}
      <div className="border-b" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/articles/new"
              className="flex items-center px-4 py-2 text-white rounded-md btn-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Buat Artikel
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center px-4 py-2 text-white rounded-md btn-accent"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Kelola Kategori
            </Link>
            <Link
              href="/admin/ticker"
              className="flex items-center px-4 py-2 text-white transition-colors rounded-md"
              style={{ backgroundColor: 'var(--news-warning)' }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Kelola Ticker
            </Link>

            <Link
              href="/admin/media"
              className="flex items-center px-4 py-2 text-white transition-colors rounded-md"
              style={{ backgroundColor: 'var(--news-secondary)' }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Perpustakaan Media
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold font-subheading" style={{ color: 'var(--primary)' }}>
            Selamat datang kembali, Administrator
          </h2>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 card-elegant">
              <div className="flex items-center">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--accent)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium font-subheading" style={{ color: 'var(--primary)' }}>Total Artikel</h3>
                  <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{stats.totalArticles}</p>
                </div>
              </div>
            </div>

            <div className="p-6 card-elegant">
              <div className="flex items-center">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--news-success)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium font-subheading" style={{ color: 'var(--primary)' }}>Terpublikasi</h3>
                  <p className="text-3xl font-bold" style={{ color: 'var(--news-success)' }}>{stats.publishedArticles}</p>
                </div>
              </div>
            </div>

            <div className="p-6 card-elegant">
              <div className="flex items-center">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--news-warning)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium font-subheading" style={{ color: 'var(--primary)' }}>Draft</h3>
                  <p className="text-3xl font-bold" style={{ color: 'var(--news-warning)' }}>{stats.draftArticles}</p>
                </div>
              </div>
            </div>

            <div className="p-6 card-elegant">
              <div className="flex items-center">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--news-danger)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium font-subheading" style={{ color: 'var(--primary)' }}>Breaking News</h3>
                  <p className="text-3xl font-bold" style={{ color: 'var(--news-danger)' }}>{stats.breakingNewsCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium font-subheading" style={{ color: 'var(--primary)' }}>
              Filter berdasarkan kategori:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border-0 rounded-md card-elegant focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              style={{ color: 'var(--primary)' }}
            >
              <option value="all">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name} ({category._count.articles})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles Table */}
        <div className="card-elegant">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-lg font-medium font-subheading" style={{ color: 'var(--primary)' }}>
              Artikel Terbaru ({filteredArticles.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--border)' }}>
              <thead style={{ backgroundColor: 'var(--muted)' }}>
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase" style={{ color: 'var(--secondary)' }}>
                    Judul
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase" style={{ color: 'var(--secondary)' }}>
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase" style={{ color: 'var(--secondary)' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase" style={{ color: 'var(--secondary)' }}>
                    Breaking
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase" style={{ color: 'var(--secondary)' }}>
                    Dibuat
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase" style={{ color: 'var(--secondary)' }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y" style={{ borderColor: 'var(--border)' }}>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium font-body" style={{ color: 'var(--primary)' }}>
                        {article.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white category-${article.category.slug}`}>
                        {article.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white`} style={{ backgroundColor: article.published ? 'var(--news-success)' : 'var(--news-warning)' }}>
                        {article.published ? 'Terpublikasi' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleBreakingNews(article.id, !article.isBreakingNews)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          article.isBreakingNews
                            ? 'text-white'
                            : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                        }`}
                        style={{ backgroundColor: article.isBreakingNews ? 'var(--news-danger)' : undefined }}
                      >
                        {article.isBreakingNews ? 'Breaking' : 'Normal'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap font-body" style={{ color: 'var(--secondary)' }}>
                      {new Date(article.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="mr-4 transition-colors font-body"
                        style={{ color: 'var(--accent)' }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="transition-colors font-body"
                        style={{ color: 'var(--news-danger)' }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
