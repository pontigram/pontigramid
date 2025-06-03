'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface AnalyticsProps {
  articleId?: string
  title?: string
}

export default function Analytics({ articleId, title }: AnalyticsProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Generate or get session ID
    let sessionId = sessionStorage.getItem('analytics_session')
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('analytics_session', sessionId)
    }

    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pathname,
            title: title || document.title,
            articleId,
            referrer: document.referrer || undefined,
            sessionId
          })
        })
      } catch (error) {
        console.error('Analytics tracking failed:', error)
      }
    }

    // Track after a short delay to ensure page is loaded
    const timer = setTimeout(trackPageView, 1000)

    return () => clearTimeout(timer)
  }, [pathname, articleId, title])

  // Track article reading time
  useEffect(() => {
    if (!articleId) return

    let startTime = Date.now()
    let isVisible = true

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible) {
        startTime = Date.now()
      }
    }

    const handleBeforeUnload = () => {
      if (isVisible) {
        const readingTime = Math.floor((Date.now() - startTime) / 1000)
        
        // Only track if user spent more than 10 seconds reading
        if (readingTime > 10) {
          navigator.sendBeacon('/api/analytics/track', JSON.stringify({
            page: pathname,
            title: title || document.title,
            articleId,
            readingTime,
            sessionId: sessionStorage.getItem('analytics_session')
          }))
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [articleId, pathname, title])

  return null // This component doesn't render anything
}

// Hook for manual tracking
export function useAnalytics() {
  const trackEvent = async (eventData: {
    page?: string
    title?: string
    articleId?: string
    event?: string
    data?: any
  }) => {
    try {
      const sessionId = sessionStorage.getItem('analytics_session')
      
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          sessionId
        })
      })
    } catch (error) {
      console.error('Analytics event tracking failed:', error)
    }
  }

  return { trackEvent }
}
