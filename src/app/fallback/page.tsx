export default function FallbackPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Portal Berita Pontigram
        </h1>
        
        <p className="text-gray-600 mb-6">
          Selamat datang di Portal Berita Pontigram. Sistem sedang dalam tahap setup dan konfigurasi.
        </p>
        
        <div className="space-y-4">
          <div className="text-left space-y-2">
            <h3 className="font-semibold text-gray-900">Status Setup:</h3>
            
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Aplikasi berhasil di-deploy</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Database sedang dikonfigurasi</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-700">Content management siap digunakan</span>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-xs text-gray-500 mb-4">
              Untuk mengakses admin dashboard dan mulai mengelola konten:
            </p>
            
            <a
              href="/admin"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Akses Admin Dashboard
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Credentials: admin@pontigram.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
