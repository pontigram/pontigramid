'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  publishedAt?: string
  createdAt: string
  isBreakingNews?: boolean
  priority?: 'breaking' | 'urgent' | 'normal'
  category: {
    name: string
    slug: string
  }
}

interface NewsTickerProps {
  newsItems?: NewsItem[]
  isSticky?: boolean
  showSideTicker?: boolean
}

interface TickerSettings {
  enabled: boolean
  speed: number
  duration: number
  maxItems: number
  autoRefresh: boolean
  soundEnabled: boolean
  multiLine: boolean
}

export default function NewsTicker({
  newsItems = [],
  isSticky = false,
  showSideTicker = false
}: NewsTickerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [breakingNews, setBreakingNews] = useState<NewsItem[]>([])
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [settings, setSettings] = useState<TickerSettings>({
    enabled: true,
    speed: 60,
    duration: 30,
    maxItems: 10,
    autoRefresh: true,
    soundEnabled: false,
    multiLine: false
  })

  // Utility functions
  const getTimeAgo = useCallback((dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Baru saja'
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`
    return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`
  }, [])

  const getCategoryIcon = useCallback((categorySlug: string) => {
    const iconMap: { [key: string]: string } = {
      'berita-terkini': '📰',
      'budaya-melayu': '🎭',
      'pariwisata': '🏝️',
      'ekonomi-bisnis': '💼',
      'lingkungan': '🌱',
      'kuliner-khas': '🍜',
      'sejarah-nostalgia': '🏛️',
      'komunitas-gaya-hidup': '👥',
      'pendidikan-pemuda': '🎓',
      'olahraga': '⚽',
      'kesehatan': '🏥',
      'hiburan-seni': '🎨',
      'teknologi-inovasi': '💻',
      'agenda-acara': '📅',
      'opini-warga': '💭'
    }
    return iconMap[categorySlug] || '📄'
  }, [])

  const getUrgencyColor = useCallback((item: NewsItem) => {
    if (item.isBreakingNews || item.priority === 'breaking') {
      return 'linear-gradient(135deg, var(--news-breaking) 0%, #ef4444 100%)'
    }
    if (item.priority === 'urgent') {
      return 'linear-gradient(135deg, var(--news-urgent) 0%, #f59e0b 100%)'
    }
    return 'linear-gradient(135deg, var(--news-normal) 0%, #10b981 100%)'
  }, [])

  const getCategoryColor = useCallback((categorySlug: string) => {
    if (categorySlug === 'berita-terkini') return 'var(--news-ticker)'
    if (categorySlug === 'budaya-melayu') return 'var(--news-urgent)'
    if (categorySlug === 'pariwisata') return '#0891b2'
    if (categorySlug === 'ekonomi-bisnis') return 'var(--news-normal)'
    if (categorySlug === 'lingkungan') return '#14b8a6'
    if (categorySlug === 'kuliner-khas') return '#f97316'
    if (categorySlug === 'sejarah-nostalgia') return '#64748b'
    if (categorySlug === 'komunitas-gaya-hidup') return '#8b5cf6'
    if (categorySlug === 'pendidikan-pemuda') return 'var(--news-featured)'
    if (categorySlug === 'olahraga') return 'var(--news-breaking)'
    if (categorySlug === 'kesehatan') return '#22c55e'
    if (categorySlug === 'hiburan-seni') return '#ec4899'
    if (categorySlug === 'teknologi-inovasi') return '#0891b2'
    if (categorySlug === 'agenda-acara') return 'var(--news-urgent)'
    if (categorySlug === 'opini-warga') return '#64748b'
    return 'var(--news-normal)'
  }, [])

  const playNotificationSound = useCallback(() => {
    if (settings.soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error)
    }
  }, [settings.soundEnabled])

  // Removed fetchBreakingNews to prevent infinite loops

  useEffect(() => {
    // Only fetch once on mount
    const fetchData = async () => {
      try {
        const response = await fetch('/api/articles?includeAll=true&limit=' + settings.maxItems)
        if (response.ok) {
          const data = await response.json()
          const articles = data.articles || []

          // Sort by priority: breaking > urgent > normal
          const sortedArticles = articles.sort((a: NewsItem, b: NewsItem) => {
            const priorityOrder = { breaking: 3, urgent: 2, normal: 1 }
            const aPriority = a.isBreakingNews ? 'breaking' : (a.priority || 'normal')
            const bPriority = b.isBreakingNews ? 'breaking' : (b.priority || 'normal')
            return priorityOrder[bPriority as keyof typeof priorityOrder] - priorityOrder[aPriority as keyof typeof priorityOrder]
          })

          const newBreakingCount = sortedArticles.filter((a: NewsItem) => a.isBreakingNews).length

          if (newBreakingCount > 0) {
            // Play notification sound for breaking news
            if (settings.soundEnabled && audioRef.current) {
              audioRef.current.play().catch(console.error)
            }
          }

          setBreakingNews(sortedArticles.slice(0, settings.maxItems))
        } else {
          // Fallback to provided newsItems
          const fallbackItems = newsItems.slice(0, settings.maxItems).map(item => ({
            ...item,
            priority: item.isBreakingNews ? 'breaking' as const : 'normal' as const
          }))
          setBreakingNews(fallbackItems)
        }
      } catch (error) {
        console.error('Failed to fetch breaking news:', error)
        // Fallback to provided newsItems
        const fallbackItems = newsItems.slice(0, settings.maxItems).map(item => ({
          ...item,
          priority: item.isBreakingNews ? 'breaking' as const : 'normal' as const
        }))
        setBreakingNews(fallbackItems)
      }
    }

    fetchData()
  }, [])

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('tickerSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Auto-refresh functionality (temporarily disabled to prevent server overload)
  // useEffect(() => {
  //   if (!settings.autoRefresh) return

  //   const interval = setInterval(() => {
  //     fetchBreakingNews()
  //   }, 300000) // Refresh every 5 minutes

  //   return () => clearInterval(interval)
  // }, [settings.autoRefresh])

  // Ticker is always visible when enabled (removed auto-hide functionality)

  // Navigation controls (simplified for now)
  const handlePrevious = useCallback(() => {
    // For now, just scroll to previous item manually
    console.log('Previous clicked')
  }, [])

  const handleNext = useCallback(() => {
    // For now, just scroll to next item manually
    console.log('Next clicked')
  }, [])

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  const displayItems = breakingNews.length > 0 ? breakingNews : newsItems.slice(0, settings.maxItems)
  const breakingCount = displayItems.filter(item => item.isBreakingNews).length

  if (!settings.enabled || displayItems.length === 0) {
    return null
  }

  return (
    <>
      {/* Audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>

      {/* FIXED: News Ticker with BLUE Background */}
      <div
        className={`border-b transition-all duration-300 ${
          isSticky ? 'sticky top-0 z-50' : ''
        } ${isCollapsed ? 'h-0 overflow-hidden' : 'h-auto'}`}
        style={{
          background: '#0891b2 !important',
          backgroundColor: '#0891b2 !important',
          borderColor: '#0891b2 !important',
          borderBottomColor: '#0891b2 !important',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1) !important'
        }}
        ref={tickerRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-2 md:py-3">
            {/* Enhanced Breaking News Label */}
            <div className="flex-shrink-0 mr-3 md:mr-4">
              <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs font-semibold bg-white text-gray-900 shadow-md">
                <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">BERITA TERKINI ✓ BLUE</span>
                <span className="sm:hidden">BERITA ✓</span>
                {breakingCount > 0 && (
                  <span
                    className="ml-1 md:ml-2 text-white px-1 md:px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: '#dc2626 !important',
                      background: '#dc2626 !important',
                      color: 'white !important'
                    }}
                  >
                    {breakingCount}
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Navigation Controls - Hidden on Mobile */}
            <div className="hidden md:flex items-center space-x-1 mr-3">
              <button
                onClick={togglePause}
                className="p-1 rounded transition-colors hover:bg-white hover:bg-opacity-20 text-white"
                title={isPaused ? 'Lanjutkan' : 'Jeda'}
              >
                {isPaused ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                )}
              </button>
            </div>

            {/* Enhanced Scrolling News Container */}
            <div className="flex-1 overflow-hidden">
              <div className="news-ticker-container">
                <div
                  className={`news-ticker-content ${isPaused ? 'paused' : ''}`}
                  onClick={togglePause}
                  style={{ cursor: 'pointer' }}
                >
                  {displayItems.map((item, index) => (
                    <span key={item.id} className="news-ticker-item">
                      <div className="inline-flex items-center mr-4 md:mr-6">
                        {/* Enhanced Priority Indicator */}
                        <span className="mr-1 md:mr-2 text-sm md:text-base text-white">
                          {item.isBreakingNews || item.priority === 'breaking' ? '★' : '●'}
                        </span>

                        {/* Enhanced News Content */}
                        <a
                          href={`/articles/${item.slug}`}
                          className="font-body text-xs md:text-sm font-medium hover:opacity-80 transition-opacity text-white"
                        >
                          {item.title}
                        </a>

                        {/* Category Badge - Hidden on Mobile */}
                        <span
                          className="hidden md:inline-flex ml-2 px-2 py-0.5 rounded text-xs bg-white bg-opacity-20 text-white"
                        >
                          {item.category?.name || 'Berita'}
                        </span>
                      </div>

                      {index < displayItems.length - 1 && (
                        <span className="mx-2 md:mx-4 text-sm md:text-base text-white opacity-60">•</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Control Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={toggleCollapse}
                className="p-1 rounded-full transition-colors hover:bg-white hover:bg-opacity-20 text-white"
                title={isCollapsed ? 'Tampilkan ticker' : 'Sembunyikan ticker'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Simplified CSS for mobile-optimized scrolling */}
        <style jsx>{`
          .news-ticker-container {
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            height: 40px;
            display: flex;
            align-items: center;
          }

          .news-ticker-content {
            display: inline-block;
            animation: scroll-left ${settings.speed}s linear infinite;
            white-space: nowrap;
            transition: all 0.2s ease;
          }

          .news-ticker-content.paused {
            animation-play-state: paused;
          }

          .news-ticker-item {
            display: inline-block;
            white-space: nowrap;
          }

          @keyframes scroll-left {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          .news-ticker-content:hover {
            animation-play-state: paused;
          }

          /* Mobile Optimizations */
          @media (max-width: 768px) {
            .news-ticker-container {
              height: 36px;
            }

            .news-ticker-content {
              animation-duration: ${Math.max(settings.speed - 10, 35)}s;
            }
          }

          @media (max-width: 480px) {
            .news-ticker-container {
              height: 32px;
            }

            .news-ticker-content {
              animation-duration: ${Math.max(settings.speed - 5, 40)}s;
            }
          }

          /* Ensure proper centering on all devices */
          @media (max-width: 320px) {
            .news-ticker-container {
              height: 30px;
            }
          }
        `}</style>
      </div>

      {/* Side Ticker for Desktop */}
      {showSideTicker && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
          <div
            className="bg-white rounded-lg shadow-xl border p-4 max-w-xs"
            style={{ borderColor: 'var(--border)' }}
          >
            <h3 className="font-subheading text-sm font-semibold mb-3" style={{ color: 'var(--primary)' }}>
              Berita Terkini
            </h3>
            <div className="space-y-3">
              {displayItems.slice(0, 3).map((item) => (
                <div key={item.id} className="group">
                  <a
                    href={`/articles/${item.slug}`}
                    className="block font-body text-xs hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--primary)' }}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-sm">
                        {item.isBreakingNews ? '★' : '●'}
                      </span>
                      <div>
                        <p className="line-clamp-2">{item.title}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--secondary)' }}>
                          {getTimeAgo(item.publishedAt || item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
