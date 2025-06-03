'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

interface Article {
  id: string
  title: string
  slug: string
  published: boolean
  isBreakingNews: boolean
  publishedAt: string
  category: { name: string; slug: string }
  author: { name: string }
}

interface TickerSettings {
  enabled: boolean
  speed: number
  duration: number
  maxItems: number
  autoRefresh: boolean
  soundEnabled: boolean
  multiLine: boolean
  stickyMode: boolean
  showSideTicker: boolean
}

export default function TickerManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [breakingNews, setBreakingNews] = useState<Article[]>([])
  const [settings, setSettings] = useState<TickerSettings>({
    enabled: true,
    speed: 60,
    duration: 30,
    maxItems: 10,
    autoRefresh: true,
    soundEnabled: false,
    multiLine: false,
    stickyMode: false,
    showSideTicker: true
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/admin/login')
      return
    }

    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/articles?includeAll=true')
      const data = await response.json()
      const allArticles = data.articles || []
      
      setArticles(allArticles.filter((a: Article) => a.published))
      setBreakingNews(allArticles.filter((a: Article) => a.isBreakingNews && a.published))
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
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
        fetchData()
      } else {
        alert('Gagal mengupdate status breaking news')
      }
    } catch (error) {
      console.error('Failed to update breaking news:', error)
      alert('Gagal mengupdate status breaking news')
    }
  }

  const saveSettings = async () => {
    // In a real app, you would save these settings to a database or config file
    localStorage.setItem('tickerSettings', JSON.stringify(settings))
    alert('Pengaturan ticker berhasil disimpan')
  }

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('tickerSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: 'var(--accent)' }}></div>
          <p className="mt-4 font-body" style={{ color: 'var(--secondary)' }}>Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Breadcrumb items={[
              { label: 'Beranda', href: '/' },
              { label: 'Dashboard Admin', href: '/admin' },
              { label: 'Kelola Ticker' }
            ]} />
          </div>
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                Kelola News Ticker
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/admin" className="font-body transition-colors" style={{ color: 'var(--secondary)' }}>
                Kembali ke Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticker Settings */}
          <div className="card-elegant p-6">
            <h2 className="font-subheading text-xl font-semibold mb-6" style={{ color: 'var(--primary)' }}>
              Pengaturan Ticker
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 font-body" style={{ color: 'var(--primary)' }}>
                    Aktifkan News Ticker
                  </span>
                </label>
              </div>

              <div>
                <label className="block font-body text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                  Kecepatan Scroll (detik)
                </label>
                <input
                  type="number"
                  min="30"
                  max="120"
                  value={settings.speed}
                  onChange={(e) => setSettings({...settings, speed: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                  Durasi Tampil (detik)
                </label>
                <input
                  type="number"
                  min="10"
                  max="60"
                  value={settings.duration}
                  onChange={(e) => setSettings({...settings, duration: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
                  Maksimal Item di Ticker
                </label>
                <input
                  type="number"
                  min="5"
                  max="15"
                  value={settings.maxItems}
                  onChange={(e) => setSettings({...settings, maxItems: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.autoRefresh}
                      onChange={(e) => setSettings({...settings, autoRefresh: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 font-body text-sm" style={{ color: 'var(--primary)' }}>
                      Auto Refresh (30s)
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 font-body text-sm" style={{ color: 'var(--primary)' }}>
                      Sound Notification
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.multiLine}
                      onChange={(e) => setSettings({...settings, multiLine: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 font-body text-sm" style={{ color: 'var(--primary)' }}>
                      Multi-line Ticker
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.stickyMode}
                      onChange={(e) => setSettings({...settings, stickyMode: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 font-body text-sm" style={{ color: 'var(--primary)' }}>
                      Sticky Mode
                    </span>
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.showSideTicker}
                      onChange={(e) => setSettings({...settings, showSideTicker: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 font-body text-sm" style={{ color: 'var(--primary)' }}>
                      Tampilkan Side Ticker (Desktop)
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={saveSettings}
                className="btn-primary w-full text-white py-2 px-4 rounded-md"
              >
                Simpan Pengaturan
              </button>
            </div>
          </div>

          {/* Breaking News Management */}
          <div className="card-elegant p-6">
            <h2 className="font-subheading text-xl font-semibold mb-6" style={{ color: 'var(--primary)' }}>
              Breaking News Aktif ({breakingNews.length})
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {breakingNews.map((article) => (
                <div key={article.id} className="p-4 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-body font-medium mb-2" style={{ color: 'var(--primary)' }}>
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--secondary)' }}>
                      {article.category.name}
                    </span>
                    <button
                      onClick={() => toggleBreakingNews(article.id, false)}
                      className="text-xs px-2 py-1 rounded text-white"
                      style={{ backgroundColor: 'var(--news-danger)' }}
                    >
                      Hapus dari Breaking
                    </button>
                  </div>
                </div>
              ))}
              
              {breakingNews.length === 0 && (
                <p className="text-center py-8" style={{ color: 'var(--secondary)' }}>
                  Tidak ada breaking news aktif
                </p>
              )}
            </div>
          </div>
        </div>

        {/* All Articles for Breaking News Selection */}
        <div className="mt-8 card-elegant">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-subheading text-lg font-medium" style={{ color: 'var(--primary)' }}>
              Pilih Artikel untuk Breaking News
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--border)' }}>
              <thead style={{ backgroundColor: 'var(--muted)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y" style={{ borderColor: 'var(--border)' }}>
                {articles.filter(a => !a.isBreakingNews).slice(0, 10).map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-body text-sm font-medium" style={{ color: 'var(--primary)' }}>
                        {article.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white category-${article.category.slug}`}>
                        {article.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-body text-sm" style={{ color: 'var(--secondary)' }}>
                      {new Date(article.publishedAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleBreakingNews(article.id, true)}
                        className="text-xs px-3 py-1 rounded text-white transition-colors"
                        style={{ backgroundColor: 'var(--news-danger)' }}
                      >
                        Jadikan Breaking News
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
