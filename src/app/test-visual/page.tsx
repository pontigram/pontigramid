'use client'

import Logo from '@/components/Logo'
import NewsTicker from '@/components/NewsTicker'

const mockNewsItems = [
  {
    id: '1',
    title: 'Breaking News: This should have RED badge',
    slug: 'breaking-news-test',
    isBreakingNews: true,
    priority: 'breaking' as const,
    category: { name: 'Breaking', slug: 'breaking' },
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: '2', 
    title: 'Regular News: This is in the BLUE ticker',
    slug: 'regular-news-test',
    isBreakingNews: false,
    priority: 'normal' as const,
    category: { name: 'Berita Terkini', slug: 'berita-terkini' },
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
]

export default function TestVisualPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo Test */}
      <div className="bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">VISUAL FIXES TEST PAGE</h1>
        
        {/* Logo Test Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">1. LOGO TEST - Should have NO black borders:</h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <p className="text-sm mb-2">Small Logo</p>
              <Logo size="sm" variant="icon-only" />
            </div>
            <div className="text-center">
              <p className="text-sm mb-2">Medium Logo</p>
              <Logo size="md" variant="icon-only" />
            </div>
            <div className="text-center">
              <p className="text-sm mb-2">Large Logo</p>
              <Logo size="lg" variant="full" showText={true} />
            </div>
          </div>
          <p className="text-center mt-4 text-sm text-gray-600">
            ✓ If you see black borders around the circles, the fix is NOT working
          </p>
        </div>

        {/* News Ticker Test Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">2. COLOR DIFFERENTIATION TEST:</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">News Ticker (Should be BLUE background):</h3>
              <NewsTicker 
                newsItems={mockNewsItems}
                showSideTicker={false}
                isSticky={false}
              />
              <p className="text-sm text-gray-600 mt-2">
                ✓ The ticker background should be BLUE (#0891b2)
                <br />
                ✓ The breaking news badge (number) should be RED (#dc2626)
                <br />
                ✓ Text should say "BERITA TERKINI ✓ BLUE"
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">VERIFICATION INSTRUCTIONS:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Logo Test:</strong> All logo circles should appear clean without any black borders or outlines</li>
            <li><strong>News Ticker:</strong> Should have a BLUE background color (#0891b2)</li>
            <li><strong>Breaking Badge:</strong> The red number badge should be RED (#dc2626)</li>
            <li><strong>Text Indicator:</strong> Should show "BERITA TERKINI ✓ BLUE" to confirm changes loaded</li>
          </ol>
          
          <div className="mt-4 p-4 bg-white rounded border">
            <h3 className="font-medium mb-2">If changes are NOT visible:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac) for hard refresh</li>
              <li>Open Developer Tools → Network tab → Check "Disable cache"</li>
              <li>Try incognito/private browsing mode</li>
              <li>Clear browser cache completely</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
