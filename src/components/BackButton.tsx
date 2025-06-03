'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  className?: string
  showText?: boolean
  variant?: 'button' | 'link'
}

export default function BackButton({ 
  className = '', 
  showText = true, 
  variant = 'button' 
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleBack}
        className={`inline-flex items-center text-sm font-medium transition-colors hover:opacity-80 ${className}`}
        style={{ color: 'var(--secondary)' }}
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
        {showText && 'Kembali'}
      </button>
    )
  }

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${className}`}
      style={{ 
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--secondary)'
      }}
    >
      <svg 
        className="w-4 h-4 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
      {showText && (
        <span className="font-medium">Kembali</span>
      )}
    </button>
  )
}
