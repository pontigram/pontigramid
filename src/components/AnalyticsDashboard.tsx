'use client'

import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  popularPages: Array<{
    page: string
    title: string
    views: number
  }>
  popularArticles: Array<{
    id: string
    title: string
    slug: string
    views: number
    category: {
      name: string
      slug: string
    }
  }>
  trafficSources: Array<{
    source: string
    views: number
  }>
  dailyViews: Array<{
    date: string
    views: number
  }>
  period: string
}

interface AnalyticsDashboardProps {
  className?: string
}

export default function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7d')
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (selectedPeriod: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/analytics/stats?period=${selectedPeriod}`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(period)
  }, [period])

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
  }

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Analytics</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => fetchAnalytics(period)}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-gray-500">
          No analytics data available
        </div>
      </div>
    )
  }

  // Chart data
  const dailyViewsChart = {
    labels: data.dailyViews.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Page Views',
        data: data.dailyViews.map(item => item.views),
        borderColor: 'var(--accent)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const popularPagesChart = {
    labels: data.popularPages.slice(0, 5).map(item => item.title || item.page),
    datasets: [
      {
        label: 'Views',
        data: data.popularPages.slice(0, 5).map(item => item.views),
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  }

  const trafficSourcesChart = {
    labels: data.trafficSources.slice(0, 5).map(item => {
      if (!item.source) return 'Direct'
      try {
        const url = new URL(item.source)
        return url.hostname
      } catch {
        return 'Other'
      }
    }),
    datasets: [
      {
        data: data.trafficSources.slice(0, 5).map(item => item.views),
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-heading font-bold mb-4 sm:mb-0" style={{ color: 'var(--primary)' }}>
          Analytics Dashboard
        </h2>
        
        {/* Period Selector */}
        <div className="flex space-x-2">
          {[
            { value: '1d', label: '1 Hari' },
            { value: '7d', label: '7 Hari' },
            { value: '30d', label: '30 Hari' },
            { value: '90d', label: '90 Hari' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => handlePeriodChange(option.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                period === option.value
                  ? 'text-white'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: period === option.value ? 'var(--accent)' : undefined
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-modern p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Page Views</h3>
          <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
            {data.totalViews.toLocaleString('id-ID')}
          </p>
        </div>
        
        <div className="card-modern p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Unique Visitors</h3>
          <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
            {data.uniqueVisitors.toLocaleString('id-ID')}
          </p>
        </div>
        
        <div className="card-modern p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avg. Views/Visitor</h3>
          <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
            {data.uniqueVisitors > 0 ? (data.totalViews / data.uniqueVisitors).toFixed(1) : '0'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Views Chart */}
        <div className="card-modern p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
            Daily Page Views
          </h3>
          <Line data={dailyViewsChart} options={chartOptions} />
        </div>

        {/* Popular Pages Chart */}
        <div className="card-modern p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
            Popular Pages
          </h3>
          <Bar data={popularPagesChart} options={chartOptions} />
        </div>
      </div>

      {/* Tables and Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Articles */}
        <div className="card-modern p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
            Popular Articles
          </h3>
          <div className="space-y-3">
            {data.popularArticles.slice(0, 5).map((article, index) => (
              <div key={article.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--primary)' }}>
                    {article.title}
                  </p>
                  <p className="text-xs text-gray-500">{article.category.name}</p>
                </div>
                <span className="text-sm font-semibold ml-4" style={{ color: 'var(--accent)' }}>
                  {article.views}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="card-modern p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
            Traffic Sources
          </h3>
          <div className="h-64">
            <Doughnut data={trafficSourcesChart} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  )
}
