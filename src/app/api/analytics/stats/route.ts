import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d' // 1d, 7d, 30d, 90d
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Calculate date range
    let dateFilter: any = {}
    if (startDate && endDate) {
      dateFilter = {
        timestamp: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }
    } else {
      const now = new Date()
      let daysBack = 7
      
      switch (period) {
        case '1d': daysBack = 1; break
        case '7d': daysBack = 7; break
        case '30d': daysBack = 30; break
        case '90d': daysBack = 90; break
      }
      
      const startOfPeriod = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))
      dateFilter = {
        timestamp: {
          gte: startOfPeriod,
          lte: now
        }
      }
    }

    // Get total page views
    const totalViews = await prisma.analytics.count({
      where: dateFilter
    })

    // Get unique visitors (based on hashed IP)
    const uniqueVisitors = await prisma.analytics.groupBy({
      by: ['ipAddress'],
      where: dateFilter,
      _count: {
        ipAddress: true
      }
    })

    // Get popular pages
    const popularPages = await prisma.analytics.groupBy({
      by: ['page', 'title'],
      where: dateFilter,
      _count: {
        page: true
      },
      orderBy: {
        _count: {
          page: 'desc'
        }
      },
      take: 10
    })

    // Get popular articles
    const popularArticles = await prisma.analytics.groupBy({
      by: ['articleId'],
      where: {
        ...dateFilter,
        articleId: {
          not: null
        }
      },
      _count: {
        articleId: true
      },
      orderBy: {
        _count: {
          articleId: 'desc'
        }
      },
      take: 10
    })

    // Get article details for popular articles
    const articleIds = popularArticles.map(item => item.articleId).filter(Boolean)
    const articles = await prisma.article.findMany({
      where: {
        id: {
          in: articleIds as string[]
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    })

    // Combine article data with view counts
    const popularArticlesWithDetails = popularArticles.map(item => {
      const article = articles.find(a => a.id === item.articleId)
      return {
        ...article,
        views: item._count.articleId
      }
    }).filter(item => item.id) // Remove items without article details

    // Get traffic sources (referrers)
    const trafficSources = await prisma.analytics.groupBy({
      by: ['referrer'],
      where: {
        ...dateFilter,
        referrer: {
          not: null
        }
      },
      _count: {
        referrer: true
      },
      orderBy: {
        _count: {
          referrer: 'desc'
        }
      },
      take: 10
    })

    // Get daily views for chart
    const dailyViews = await prisma.analytics.groupBy({
      by: ['timestamp'],
      where: dateFilter,
      _count: {
        timestamp: true
      },
      orderBy: {
        timestamp: 'asc'
      }
    })

    // Process daily views to group by date
    const dailyViewsProcessed = dailyViews.reduce((acc: any[], item) => {
      const date = item.timestamp.toISOString().split('T')[0]
      const existing = acc.find(d => d.date === date)
      
      if (existing) {
        existing.views += item._count.timestamp
      } else {
        acc.push({
          date,
          views: item._count.timestamp
        })
      }
      
      return acc
    }, [])

    return NextResponse.json({
      totalViews,
      uniqueVisitors: uniqueVisitors.length,
      popularPages: popularPages.map(item => ({
        page: item.page,
        title: item.title,
        views: item._count.page
      })),
      popularArticles: popularArticlesWithDetails,
      trafficSources: trafficSources.map(item => ({
        source: item.referrer,
        views: item._count.referrer
      })),
      dailyViews: dailyViewsProcessed,
      period
    })
  } catch (error) {
    console.error('Analytics stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics stats' },
      { status: 500 }
    )
  }
}
