import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'

export const metadata = {
  title: 'Tentang Kami - Pontigram News',
  description: 'Pelajari lebih lanjut tentang Pontigram News, visi, misi, dan tim kami yang berkomitmen menyajikan berita terpercaya.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Unified Header */}
      <Header showCategories={false} variant="page" />

      {/* Hero Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Tentang Pontigram News
          </h1>
          <p className="font-body text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto leading-relaxed">
            Portal berita terpercaya yang berkomitmen menyajikan informasi terkini, mendalam, dan berimbang
            tentang berbagai peristiwa di Indonesia dan dunia.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Vision & Mission */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="card-modern p-8">
                <div className="w-16 h-16 rounded-full mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                  Visi Kami
                </h2>
                <p className="font-body text-lg leading-relaxed" style={{ color: 'var(--secondary)' }}>
                  Menjadi portal berita digital terdepan di Indonesia yang menyajikan informasi berkualitas tinggi, 
                  terpercaya, dan mudah diakses oleh seluruh lapisan masyarakat.
                </p>
              </div>

              <div className="card-modern p-8">
                <div className="w-16 h-16 rounded-full mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                  Misi Kami
                </h2>
                <p className="font-body text-lg leading-relaxed" style={{ color: 'var(--secondary)' }}>
                  Menyajikan berita yang akurat, berimbang, dan mendalam dengan mengutamakan kecepatan, 
                  kredibilitas, dan kepentingan publik dalam setiap pemberitaan.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="mb-16">
            <div className="card-modern p-8 md:p-12">
              <h2 className="font-heading text-3xl font-bold mb-8 text-center" style={{ color: 'var(--primary)' }}>
                Cerita Kami
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="font-body text-lg leading-relaxed mb-6" style={{ color: 'var(--secondary)' }}>
                  Pontigram News didirikan dengan semangat untuk memberikan akses informasi yang berkualitas 
                  kepada masyarakat Indonesia. Berawal dari keprihatinan terhadap maraknya berita hoax dan 
                  informasi yang tidak terverifikasi, kami berkomitmen untuk menjadi sumber berita yang dapat dipercaya.
                </p>
                <p className="font-body text-lg leading-relaxed mb-6" style={{ color: 'var(--secondary)' }}>
                  Tim redaksi kami terdiri dari jurnalis berpengalaman yang memiliki dedikasi tinggi dalam 
                  menyajikan berita yang faktual dan berimbang. Kami mengutamakan prinsip-prinsip jurnalistik 
                  yang baik dalam setiap proses peliputan dan penulisan berita.
                </p>
                <p className="font-body text-lg leading-relaxed" style={{ color: 'var(--secondary)' }}>
                  Dengan dukungan teknologi terkini, kami terus berinovasi untuk memberikan pengalaman membaca 
                  yang optimal bagi pembaca di berbagai platform, mulai dari desktop hingga perangkat mobile.
                </p>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="mb-16">
            <h2 className="font-heading text-3xl font-bold mb-12 text-center" style={{ color: 'var(--primary)' }}>
              Nilai-Nilai Kami
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                  Akurasi
                </h3>
                <p className="font-body leading-relaxed" style={{ color: 'var(--secondary)' }}>
                  Kami berkomitmen untuk menyajikan informasi yang akurat dan terverifikasi dari sumber terpercaya.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                  Independensi
                </h3>
                <p className="font-body leading-relaxed" style={{ color: 'var(--secondary)' }}>
                  Kami menjaga independensi editorial dan tidak terpengaruh oleh kepentingan politik atau komersial.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                  Kecepatan
                </h3>
                <p className="font-body leading-relaxed" style={{ color: 'var(--secondary)' }}>
                  Kami mengutamakan kecepatan dalam menyampaikan berita terkini tanpa mengorbankan akurasi.
                </p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center">
            <div className="card-modern p-8 md:p-12" style={{ backgroundColor: 'var(--background-secondary)' }}>
              <h2 className="font-heading text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                Hubungi Kami
              </h2>
              <p className="font-body text-lg mb-8" style={{ color: 'var(--secondary)' }}>
                Punya pertanyaan, saran, atau ingin berkolaborasi dengan kami? Jangan ragu untuk menghubungi tim Pontigram News.
              </p>
              <Link
                href="/contact"
                className="btn-primary text-white px-8 py-3 font-semibold"
              >
                Hubungi Kami
              </Link>
            </div>
          </section>

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
              <Link href="/contact" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Kontak
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
