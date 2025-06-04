'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AutoLoginPage() {
  const [status, setStatus] = useState('Initializing...')
  const router = useRouter()

  useEffect(() => {
    const performAutoLogin = async () => {
      console.log('🚀 Starting automatic admin login...')
      setStatus('Authenticating automatically...')

      try {
        // Wait a moment for visual feedback
        await new Promise(resolve => setTimeout(resolve, 1000))

        console.log('✅ Setting admin session in localStorage...')
        setStatus('Setting up admin session...')

        // Set localStorage session automatically
        localStorage.setItem('admin-logged-in', 'true')
        localStorage.setItem('admin-user', JSON.stringify({
          email: 'admin@pontigram.com',
          name: 'Administrator',
          role: 'ADMIN'
        }))

        console.log('✅ Admin session created successfully')
        setStatus('Redirecting to dashboard...')

        // Wait a moment then redirect
        await new Promise(resolve => setTimeout(resolve, 500))

        console.log('🚀 Redirecting to admin dashboard...')
        window.location.href = '/admin'

      } catch (error) {
        console.error('❌ Auto-login error:', error)
        setStatus('Auto-login failed. Retrying...')

        // Retry after 2 seconds
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    }

    performAutoLogin()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold" style={{ color: 'var(--primary)' }}>
            Pontigram News
          </h1>
          <div className="w-16 h-1 mx-auto mt-2 rounded" style={{ backgroundColor: 'var(--accent)' }}></div>
        </div>
        <h2 className="mt-6 text-center font-heading text-2xl font-bold" style={{ color: 'var(--primary)' }}>
          Admin Access
        </h2>
        <p className="mt-2 text-center font-body text-sm" style={{ color: 'var(--secondary)' }}>
          Automatic authentication in progress...
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-modern py-8 px-4 sm:px-10">
          <div className="text-center space-y-6">
            {/* Loading Animation */}
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: 'var(--accent)' }}></div>
            </div>

            {/* Status Message */}
            <div>
              <h3 className="text-lg font-medium font-subheading" style={{ color: 'var(--primary)' }}>
                {status}
              </h3>
              <p className="mt-2 text-sm font-body" style={{ color: 'var(--secondary)' }}>
                Please wait while we set up your admin session...
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-1000 ease-out"
                style={{
                  backgroundColor: 'var(--accent)',
                  width: status.includes('Redirecting') ? '100%' :
                         status.includes('Setting up') ? '75%' :
                         status.includes('Authenticating') ? '50%' : '25%'
                }}
              ></div>
            </div>

            {/* Info Text */}
            <div className="text-xs font-body" style={{ color: 'var(--secondary)' }}>
              <p>✅ No login form required</p>
              <p>✅ Automatic admin authentication</p>
              <p>✅ Instant dashboard access</p>
            </div>

            {/* Back to Home Link */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <a
                href="/"
                className="font-body text-sm transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                ← Kembali ke Beranda
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
