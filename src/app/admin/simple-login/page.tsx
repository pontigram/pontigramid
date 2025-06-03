'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to admin dashboard
        window.location.href = '/admin'
      } else {
        setError(data.message || 'Login gagal')
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
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
          Admin Dashboard - Simple Login
        </h2>
        <p className="mt-2 text-center font-body text-sm" style={{ color: 'var(--secondary)' }}>
          Masuk untuk mengakses panel administrasi
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
                Alamat Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="admin@pontigram.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block font-body font-medium mb-2" style={{ color: 'var(--primary)' }}>
                Kata Sandi
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="Masukkan kata sandi"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Masuk...' : 'Masuk ke Dashboard'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--border)' }} />
              </div>
              <div className="relative flex justify-center font-body text-sm">
                <span className="px-3 bg-white" style={{ color: 'var(--secondary)' }}>
                  Kredensial Admin Default
                </span>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--background-secondary)' }}>
              <p className="font-body text-sm mb-1" style={{ color: 'var(--secondary)' }}>
                <strong>Email:</strong> admin@pontigram.com
              </p>
              <p className="font-body text-sm" style={{ color: 'var(--secondary)' }}>
                <strong>Password:</strong> admin123
              </p>
              <p className="font-body text-xs mt-2" style={{ color: 'var(--secondary)' }}>
                <em>Ini adalah login alternatif yang menggunakan koneksi database langsung</em>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
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
  )
}
