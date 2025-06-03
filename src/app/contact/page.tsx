'use client'

import Link from 'next/link'
import { useState } from 'react'
import Header from '@/components/Header'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Unified Header */}
      <Header showCategories={false} variant="page" />

      {/* Hero Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Hubungi Kami
          </h1>
          <p className="font-body text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto leading-relaxed">
            Kami senang mendengar dari Anda. Kirimkan pertanyaan, saran, atau masukan untuk Pontigram News.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="card-modern p-8 md:p-12">
              <h2 className="font-heading text-2xl font-bold mb-8" style={{ color: 'var(--primary)' }}>
                Kirim Pesan
              </h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-green-800 font-medium">
                    Terima kasih! Pesan Anda telah berhasil dikirim. Kami akan merespons dalam 1-2 hari kerja.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-body font-medium mb-2" style={{ color: 'var(--primary)' }}>
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-body font-medium mb-2" style={{ color: 'var(--primary)' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="nama@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block font-body font-medium mb-2" style={{ color: 'var(--primary)' }}>
                    Subjek *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <option value="">Pilih subjek pesan</option>
                    <option value="general">Pertanyaan Umum</option>
                    <option value="news-tip">Tips Berita</option>
                    <option value="correction">Koreksi Berita</option>
                    <option value="partnership">Kerjasama</option>
                    <option value="technical">Masalah Teknis</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block font-body font-medium mb-2" style={{ color: 'var(--primary)' }}>
                    Pesan *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              
              {/* Contact Details */}
              <div className="card-modern p-8">
                <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                  Informasi Kontak
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold mb-2" style={{ color: 'var(--primary)' }}>Alamat</h3>
                      <p className="font-body" style={{ color: 'var(--secondary)' }}>
                        Jl. Gajah Mada No. 123<br />
                        Pontianak, Kalimantan Barat 78121<br />
                        Indonesia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold mb-2" style={{ color: 'var(--primary)' }}>Email</h3>
                      <p className="font-body" style={{ color: 'var(--secondary)' }}>
                        redaksi@pontigram.com<br />
                        info@pontigram.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold mb-2" style={{ color: 'var(--primary)' }}>Telepon</h3>
                      <p className="font-body" style={{ color: 'var(--secondary)' }}>
                        +62 561 123456<br />
                        +62 812 3456 7890
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="card-modern p-8">
                <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                  Jam Operasional
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-body" style={{ color: 'var(--secondary)' }}>Senin - Jumat</span>
                    <span className="font-body font-medium" style={{ color: 'var(--primary)' }}>08:00 - 17:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body" style={{ color: 'var(--secondary)' }}>Sabtu</span>
                    <span className="font-body font-medium" style={{ color: 'var(--primary)' }}>08:00 - 12:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-body" style={{ color: 'var(--secondary)' }}>Minggu</span>
                    <span className="font-body font-medium" style={{ color: 'var(--primary)' }}>Tutup</span>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                  <p className="font-body text-sm" style={{ color: 'var(--secondary)' }}>
                    <strong>Catatan:</strong> Tim redaksi kami bekerja 24/7 untuk memberikan berita terkini. 
                    Untuk urusan administratif, silakan hubungi kami pada jam operasional.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="font-heading text-2xl font-bold mb-4">Pontigram News</h4>
            <p className="font-body mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Portal berita terpercaya yang menyajikan informasi terkini, mendalam, dan berimbang.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/privacy" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Syarat & Ketentuan
              </Link>
              <Link href="/about" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Tentang Kami
              </Link>
            </div>
            <div className="border-t mt-8 pt-8" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
              <p className="font-body text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                © 2024 Pontigram News. Seluruh hak cipta dilindungi.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
