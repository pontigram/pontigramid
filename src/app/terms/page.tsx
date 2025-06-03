import Link from 'next/link'
import Header from '@/components/Header'

export const metadata = {
  title: 'Syarat & Ketentuan - Pontigram News',
  description: 'Syarat dan ketentuan penggunaan situs web Pontigram News. Baca sebelum menggunakan layanan kami.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Unified Header */}
      <Header showCategories={false} variant="page" />

      {/* Hero Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Syarat & Ketentuan
          </h1>
          <p className="font-body text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto leading-relaxed">
            Ketentuan penggunaan situs web Pontigram News yang harus Anda pahami dan setujui.
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
                  Selamat datang di Pontigram News. Syarat dan Ketentuan ini mengatur penggunaan Anda 
                  terhadap situs web kami yang berlokasi di pontigram.com ("Layanan") yang dioperasikan 
                  oleh Pontigram News ("kami", "kita", atau "milik kami").
                </p>
                <p className="font-body text-lg leading-relaxed" style={{ color: 'var(--secondary)' }}>
                  Dengan mengakses atau menggunakan Layanan kami, Anda setuju untuk terikat oleh 
                  Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari 
                  ketentuan ini, maka Anda tidak boleh mengakses Layanan.
                </p>
              </div>
            </section>

            {/* Acceptance of Terms */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Penerimaan Ketentuan
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Dengan menggunakan situs web ini, Anda menyatakan bahwa:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Anda berusia minimal 18 tahun atau memiliki izin dari orang tua/wali</li>
                  <li>• Anda memiliki kapasitas hukum untuk menyetujui ketentuan ini</li>
                  <li>• Anda akan menggunakan situs web sesuai dengan hukum yang berlaku</li>
                  <li>• Informasi yang Anda berikan adalah akurat dan terkini</li>
                </ul>
              </div>
            </section>

            {/* Use of Service */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Penggunaan Layanan
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                    Penggunaan yang Diizinkan
                  </h3>
                  <ul className="font-body leading-relaxed space-y-2" style={{ color: 'var(--secondary)' }}>
                    <li>• Membaca dan mengakses konten berita</li>
                    <li>• Berbagi artikel melalui media sosial</li>
                    <li>• Menghubungi kami untuk pertanyaan atau masukan</li>
                    <li>• Menggunakan fitur pencarian dan navigasi</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-heading text-xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                    Penggunaan yang Dilarang
                  </h3>
                  <ul className="font-body leading-relaxed space-y-2" style={{ color: 'var(--secondary)' }}>
                    <li>• Menyalin atau mendistribusikan konten tanpa izin</li>
                    <li>• Menggunakan konten untuk tujuan komersial tanpa persetujuan</li>
                    <li>• Melakukan aktivitas yang dapat merusak atau mengganggu situs web</li>
                    <li>• Mengirim spam, virus, atau kode berbahaya lainnya</li>
                    <li>• Mengakses sistem secara tidak sah</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Content and Copyright */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Konten dan Hak Cipta
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Semua konten di situs web ini, termasuk teks, gambar, logo, dan desain, 
                  dilindungi oleh hak cipta dan merupakan milik Pontigram News atau pemberi lisensi kami.
                </p>
                <p>
                  Anda dapat:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Membaca dan melihat konten untuk penggunaan pribadi</li>
                  <li>• Berbagi tautan artikel di media sosial</li>
                  <li>• Mengutip bagian kecil artikel dengan menyebutkan sumber</li>
                </ul>
                <p>
                  Anda tidak dapat:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Menyalin seluruh artikel tanpa izin tertulis</li>
                  <li>• Menggunakan konten untuk tujuan komersial</li>
                  <li>• Memodifikasi atau mengubah konten kami</li>
                </ul>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Tanggung Jawab Pengguna
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>Sebagai pengguna situs web kami, Anda bertanggung jawab untuk:</p>
                <ul className="space-y-2 ml-6">
                  <li>• Menjaga kerahasiaan informasi akun Anda (jika ada)</li>
                  <li>• Menggunakan situs web sesuai dengan hukum yang berlaku</li>
                  <li>• Tidak melanggar hak kekayaan intelektual</li>
                  <li>• Memberikan informasi yang akurat saat menghubungi kami</li>
                  <li>• Melaporkan aktivitas mencurigakan atau pelanggaran</li>
                </ul>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Penafian
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Informasi di situs web ini disediakan "sebagaimana adanya" tanpa jaminan apa pun. 
                  Meskipun kami berusaha memberikan informasi yang akurat dan terkini, kami tidak 
                  menjamin keakuratan, kelengkapan, atau keandalan informasi.
                </p>
                <p>
                  Pontigram News tidak bertanggung jawab atas:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Kerugian yang timbul dari penggunaan informasi di situs web</li>
                  <li>• Gangguan atau kesalahan teknis</li>
                  <li>• Konten dari situs web pihak ketiga yang ditautkan</li>
                  <li>• Kehilangan data atau kerusakan sistem</li>
                </ul>
              </div>
            </section>

            {/* Privacy */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Privasi
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Privasi Anda penting bagi kami. Pengumpulan dan penggunaan informasi pribadi 
                  diatur oleh Kebijakan Privasi kami yang merupakan bagian integral dari 
                  Syarat dan Ketentuan ini.
                </p>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                  <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-800">
                    Baca Kebijakan Privasi lengkap →
                  </Link>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Pembatasan Tanggung Jawab
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Dalam batas maksimum yang diizinkan oleh hukum, Pontigram News tidak akan 
                  bertanggung jawab atas kerugian langsung, tidak langsung, insidental, 
                  khusus, atau konsekuensial yang timbul dari:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Penggunaan atau ketidakmampuan menggunakan situs web</li>
                  <li>• Kesalahan atau kelalaian dalam konten</li>
                  <li>• Gangguan atau virus komputer</li>
                  <li>• Pelanggaran keamanan atau akses tidak sah</li>
                </ul>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Perubahan Ketentuan
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Kami berhak mengubah Syarat dan Ketentuan ini kapan saja tanpa pemberitahuan 
                  sebelumnya. Perubahan akan berlaku segera setelah diposting di situs web. 
                  Penggunaan berkelanjutan situs web setelah perubahan dianggap sebagai 
                  penerimaan terhadap ketentuan yang direvisi.
                </p>
                <p>
                  Kami menyarankan Anda untuk meninjau halaman ini secara berkala untuk 
                  mengetahui perubahan terbaru.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-12">
              <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                Hukum yang Berlaku
              </h2>
              
              <div className="font-body leading-relaxed space-y-4" style={{ color: 'var(--secondary)' }}>
                <p>
                  Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum 
                  Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan melalui 
                  pengadilan yang berwenang di Indonesia.
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
                  Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:
                </p>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                  <p><strong>Email:</strong> legal@pontigram.com</p>
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
              <Link href="/privacy" className="font-body text-sm transition-colors hover:text-white" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Kebijakan Privasi
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
