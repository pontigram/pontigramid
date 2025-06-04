'use client'

import { useEffect } from 'react'

export default function AutoLoginPage() {
  useEffect(() => {
    console.log('🚀 AUTO-LOGIN: Starting immediate admin authentication...')
    
    try {
      // Set localStorage immediately
      localStorage.setItem('admin-logged-in', 'true')
      localStorage.setItem('admin-user', JSON.stringify({
        email: 'admin@pontigram.com',
        name: 'Administrator',
        role: 'ADMIN'
      }))
      
      console.log('✅ AUTO-LOGIN: Admin session created successfully')
      console.log('🚀 AUTO-LOGIN: Redirecting to admin dashboard...')
      
      // Immediate redirect
      window.location.href = '/admin'
      
    } catch (error) {
      console.error('❌ AUTO-LOGIN: Error:', error)
      // Fallback redirect
      setTimeout(() => {
        window.location.href = '/admin'
      }, 1000)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin mx-auto" style={{ borderTopColor: 'var(--accent)' }}></div>
        <h2 className="mt-4 text-xl font-bold font-heading" style={{ color: 'var(--primary)' }}>
          Auto-Login Active
        </h2>
        <p className="mt-2 font-body" style={{ color: 'var(--secondary)' }}>
          Redirecting to admin dashboard...
        </p>
      </div>
    </div>
  )
}
