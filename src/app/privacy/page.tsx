import Link from 'next/link'
import Header from '@/components/Header'

export const metadata = {
  title: 'Kebijakan Privasi - Pontigram News',
  description: 'Kebijakan privasi Pontigram News menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Unified Header */}
      <Header showCategories={false} variant="page" />

      {/* Hero Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Kebijakan Privasi
          </h1>
          <p className="font-body text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto leading-relaxed">
            Kami berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="card-modern p-8 md:p-12">
            
            {/* Last Updated */}
            <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
              <p className="font-body text-sm" style={{ color: 'var(--secondary)' }}>
                <strong>Terakhir diperbarui:</strong> 1 Januari 2024
              </p>
            </div>

            {/* Introduction */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Pendahuluan
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="font-body text-lg leading-relaxed mb-4" style={{ color: 'var(--secondary)' }}>
                  Pontigram News ("kami", "kita", atau "situs web kami") berkomitmen untuk melindungi privasi 
                  pengunjung dan pengguna situs web kami. Kebijakan Privasi ini menjelaskan bagaimana kami 
                  mengumpulkan, menggunakan, dan melindungi informasi yang Anda berikan kepada kami.
                </p>
                <p className="font-body text-lg leading-relaxed" style={{ color: 'var(--secondary)' }}>
                  Dengan menggunakan situs web kami, Anda menyetujui pengumpulan dan penggunaan informasi 
                  sesuai dengan kebijakan ini.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Informasi yang Kami Kumpulkan
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                    1. Informasi yang Anda Berikan
                  </h3>
                  <ul className="font-body leading-relaxed space-y-2" style={{ color: 'var(--secondary)' }}>
                    <li>• Nama dan alamat email saat Anda menghubungi kami</li>
                    <li>• Komentar atau masukan yang Anda kirimkan</li>
                    <li>• Informasi yang Anda berikan dalam formulir kontak</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-heading text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                    2. Informasi yang Dikumpulkan Secara Otomatis
                  </h3>
                  <ul className="font-body leading-relaxed space-y-2" style={{ color: 'var(--secondary)' }}>
                    <li>• Alamat IP dan informasi perangkat</li>
                    <li>• Jenis browser dan sistem operasi</li>
                    <li>• Halaman yang dikunjungi dan waktu kunjungan</li>
                    <li>• Sumber rujukan (dari mana Anda datang ke situs kami)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Bagaimana Kami Menggunakan Informasi
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
                <ul className="space-y-2 ml-6">
                  <li>• Menyediakan dan memelihara layanan situs web kami</li>
                  <li>• Merespons pertanyaan dan permintaan Anda</li>
                  <li>• Menganalisis penggunaan situs untuk meningkatkan layanan</li>
                  <li>• Mengirim newsletter atau update (dengan persetujuan Anda)</li>
                  <li>• Mencegah aktivitas penipuan atau penyalahgunaan</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Cookies dan Teknologi Pelacakan
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Situs web kami menggunakan cookies untuk meningkatkan pengalaman pengguna. Cookies adalah 
                  file kecil yang disimpan di perangkat Anda yang membantu kami:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Mengingat preferensi Anda</li>
                  <li>• Menganalisis lalu lintas situs web</li>
                  <li>• Menyediakan konten yang relevan</li>
                </ul>
                <p>
                  Anda dapat mengatur browser Anda untuk menolak cookies, namun hal ini mungkin 
                  mempengaruhi fungsionalitas situs web.
                </p>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Berbagi Informasi
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Kami tidak menjual, memperdagangkan, atau mentransfer informasi pribadi Anda kepada 
                  pihak ketiga tanpa persetujuan Anda, kecuali dalam situasi berikut:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Penyedia layanan tepercaya yang membantu operasional situs web</li>
                  <li>• Ketika diwajibkan oleh hukum atau proses hukum</li>
                  <li>• Untuk melindungi hak, properti, atau keamanan kami dan pengguna lain</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Keamanan Data
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Kami menerapkan berbagai langkah keamanan untuk melindungi informasi pribadi Anda:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Enkripsi data selama transmisi</li>
                  <li>• Akses terbatas ke informasi pribadi</li>
                  <li>• Pemantauan keamanan secara berkala</li>
                  <li>• Penyimpanan data yang aman</li>
                </ul>
                <p>
                  Namun, tidak ada metode transmisi melalui internet yang 100% aman, dan kami tidak 
                  dapat menjamin keamanan absolut.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Hak Anda
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>Anda memiliki hak untuk:</p>
                <ul className="space-y-2 ml-6">
                  <li>• Mengakses informasi pribadi yang kami miliki tentang Anda</li>
                  <li>• Meminta koreksi informasi yang tidak akurat</li>
                  <li>• Meminta penghapusan informasi pribadi Anda</li>
                  <li>• Menolak pemrosesan informasi pribadi Anda</li>
                  <li>• Menarik persetujuan kapan saja</li>
                </ul>
                <p>
                  Untuk menggunakan hak-hak ini, silakan hubungi kami melalui informasi kontak 
                  yang tersedia di halaman kontak.
                </p>
              </div>
            </section>

            {/* Third Party Links */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Tautan Pihak Ketiga
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Situs web kami mungkin berisi tautan ke situs web pihak ketiga. Kami tidak 
                  bertanggung jawab atas praktik privasi atau konten situs web tersebut. Kami 
                  menyarankan Anda untuk membaca kebijakan privasi setiap situs web yang Anda kunjungi.
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Perubahan Kebijakan
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan 
                  diposting di halaman ini dengan tanggal "terakhir diperbarui" yang baru. Kami 
                  menyarankan Anda untuk meninjau kebijakan ini secara berkala.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Hubungi Kami
              </h2>

              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami:
                </p>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                  <p><strong>Email:</strong> privacy@pontigram.com</p>
                  <p><strong>Alamat:</strong> Jl. Gajah Mada No. 123, Pontianak, Kalimantan Barat 78121</p>
                  <p><strong>Telepon:</strong> +62 561 123456</p>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/contact"
                    className="btn-primary text-white px-6 py-3 font-semibold"
                  >
                    Hubungi Kami
                  </Link>
                </div>
              </div>
            </section>

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
              <Link href="/terms" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Syarat & Ketentuan
              </Link>
              <Link href="/about" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Tentang Kami
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
