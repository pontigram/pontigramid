'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchBar from './SearchBar'
import BackButton from './BackButton'
import Logo from './Logo'

interface Category {
  id: string
  name: string
  slug: string
}

interface HeaderProps {
  categories?: Category[]
  showCategories?: boolean
  variant?: 'homepage' | 'page'
}

export default function Header({ 
  categories = [], 
  showCategories = false, 
  variant = 'page' 
}: HeaderProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const getLinkStyle = (path: string) => {
    return isActive(path) 
      ? { color: 'var(--primary)' }
      : { color: 'var(--secondary)' }
  }

  const getLinkClasses = (path: string) => {
    const baseClasses = "font-subheading py-2 transition-colors hover:opacity-80"
    return isActive(path) 
      ? `${baseClasses} font-semibold`
      : baseClasses
  }

  return (
    <header className="bg-white border-b shadow-sm" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button for non-homepage */}
        {variant === 'page' && (
          <div className="py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <BackButton variant="link" />
          </div>
        )}

        <div className="flex justify-between items-center py-4 md:py-6">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="transition-all duration-200 hover:opacity-80 hover:scale-105"
              aria-label="Pontigram News - Kembali ke Beranda"
            >
              <Logo
                size="sm"
                variant="icon-only"
                showText={false}
                className="md:hidden"
              />
              <Logo
                size="lg"
                variant="full"
                showText={true}
                className="hidden md:flex"
              />
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-3 md:hidden">
            <SearchBar />
            <Link
              href="/categories"
              className="p-2 transition-colors hover:opacity-80"
              style={{ color: 'var(--secondary)' }}
              title="Kategori"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <Link 
                href="/" 
                className={getLinkClasses('/')}
                style={getLinkStyle('/')}
              >
                Beranda
              </Link>
              <Link 
                href="/categories" 
                className={getLinkClasses('/categories')}
                style={getLinkStyle('/categories')}
              >
                Kategori
              </Link>
              
              {/* Show category links only on homepage */}
              {showCategories && categories.slice(0, 3).map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={getLinkClasses(`/category/${category.slug}`)}
                  style={getLinkStyle(`/category/${category.slug}`)}
                >
                  {category.name}
                </Link>
              ))}
              
              {/* Show additional navigation links on other pages */}
              {!showCategories && (
                <>
                  <Link 
                    href="/about" 
                    className={getLinkClasses('/about')}
                    style={getLinkStyle('/about')}
                  >
                    Tentang Kami
                  </Link>
                  <Link 
                    href="/contact" 
                    className={getLinkClasses('/contact')}
                    style={getLinkStyle('/contact')}
                  >
                    Kontak
                  </Link>
                </>
              )}
            </nav>
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  )
}
