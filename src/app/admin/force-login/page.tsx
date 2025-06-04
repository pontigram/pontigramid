'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ForceLoginPage() {
  const [email, setEmail] = useState('admin@pontigram.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setDebugInfo(null)

    try {
      console.log('🔐 Testing force authentication...')
      
      const response = await fetch('/api/force-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('📊 Response:', data)

      setDebugInfo(data)

      if (data.success) {
        alert('🎉 Authentication berhasil! Database connection berfungsi dengan baik.')
        // Redirect to admin dashboard
        window.location.href = '/admin'
      } else {
        setError(data.message || 'Authentication gagal')
      }
    } catch (error) {
      console.error('💥 Error:', error)
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const testEnvironment = async () => {
    try {
      const response = await fetch('/api/force-auth')
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error('Environment test failed:', error)
    }
  }

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
          Force Authentication Test
        </h2>
        <p className="mt-2 text-center font-body text-sm" style={{ color: 'var(--secondary)' }}>
          Test database connection dan authentication langsung
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-modern py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg font-body">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block font-body font-medium mb-2" style={{ color: 'var(--primary)' }}>
                Email Admin
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-body font-medium mb-2" style={{ color: 'var(--primary)' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Testing...' : 'Test Authentication'}
              </button>
              
              <button
                type="button"
                onClick={testEnvironment}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Test Environment
              </button>
            </div>
          </form>

          {debugInfo && (
            <div className="mt-6 p-4 rounded-lg text-sm font-mono" style={{ backgroundColor: 'var(--background-secondary)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--primary)' }}>Debug Information:</h3>
              <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-64" style={{ color: 'var(--secondary)' }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 text-center">
            <a
              href="/admin/login"
              className="font-body text-sm transition-colors mr-4"
              style={{ color: 'var(--accent)' }}
            >
              ← Kembali ke Login Normal
            </a>
            <a
              href="/"
              className="font-body text-sm transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              Kembali ke Beranda
            </a>
          </div>

          <div className="mt-6 p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--background-secondary)' }}>
            <p className="font-body text-sm mb-1" style={{ color: 'var(--secondary)' }}>
              <strong>Default Credentials:</strong>
            </p>
            <p className="font-body text-sm mb-1" style={{ color: 'var(--secondary)' }}>
              Email: admin@pontigram.com
            </p>
            <p className="font-body text-sm" style={{ color: 'var(--secondary)' }}>
              Password: admin123
            </p>
            <p className="font-body text-xs mt-2" style={{ color: 'var(--secondary)' }}>
              <em>Endpoint ini bypass Prisma dan NextAuth untuk test langsung ke database</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
