'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  publishedAt?: string
  isBreakingNews?: boolean
  author: {
    name: string
  }
  category: {
    name: string
    slug: string
  }
}

interface MobileHeadlinesSliderProps {
  articles: Article[]
}

export default function MobileHeadlinesSlider({ articles }: MobileHeadlinesSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  // Local formatDate function
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || articles.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articles.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, articles.length])

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentSlide < articles.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }

    // Reset touch positions
    touchStartX.current = 0
    touchEndX.current = 0
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false) // Stop auto-play when user manually navigates
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length)
    setIsAutoPlaying(false)
  }

  if (articles.length === 0) return null

  return (
    <div className="relative">
      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {articles.map((article, index) => {
            const categoryClass = `category-${article.category.slug}`
            
            return (
              <div key={article.id} className="w-full flex-shrink-0">
                <article className="card-modern overflow-hidden">
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
                        <svg className="w-12 h-12" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-white text-xs font-semibold px-2 py-1 rounded ${categoryClass}`}>
                        {article.category.name}
                      </span>
                    </div>

                    {/* Breaking News Badge */}
                    {article.isBreakingNews && (
                      <div className="absolute top-3 right-3">
                        <span className="text-white text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: 'var(--news-breaking)' }}>
                          BREAKING
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="p-4">
                    {/* Meta Info */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-bold">
                            {article.author.name?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <div>
                          <div className="font-subheading font-semibold text-sm" style={{ color: 'var(--primary)' }}>
                            {article.author.name}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--secondary)' }}>
                            {formatDate(new Date(article.publishedAt!))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-lg font-bold mb-3 leading-tight" style={{ color: 'var(--primary)' }}>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="hover:opacity-80 transition-opacity"
                      >
                        {article.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    {article.excerpt && (
                      <p className="font-body text-sm mb-4 leading-relaxed line-clamp-3" style={{ color: 'var(--secondary)' }}>
                        {article.excerpt}
                      </p>
                    )}

                    {/* Read More Link */}
                    <div className="pt-3" style={{ borderTop: `1px solid var(--border)` }}>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="inline-flex items-center text-sm font-medium transition-colors"
                        style={{ color: 'var(--accent)' }}
                      >
                        Baca Selengkapnya
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
        style={{ color: 'var(--primary)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
        style={{ color: 'var(--primary)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center space-x-2 mt-4">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-6'
                : 'opacity-50 hover:opacity-75'
            }`}
            style={{
              backgroundColor: index === currentSlide ? 'var(--accent)' : 'var(--secondary)'
            }}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      {isAutoPlaying && (
        <div className="absolute top-2 right-2">
          <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            Auto
          </div>
        </div>
      )}
    </div>
  )
}
