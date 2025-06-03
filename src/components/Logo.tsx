interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon-only'
  showText?: boolean
}

export default function Logo({ 
  className = '', 
  size = 'md', 
  variant = 'full',
  showText = true 
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <div className={`flex items-center ${className}`}>
      {/* Pontigram Logo Icon - FIXED VERSION */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-label="Pontigram News Logo"
          style={{
            border: 'none !important',
            outline: 'none !important',
            stroke: 'none !important',
            strokeWidth: '0 !important'
          }}
        >
          {/* Outer Circle with Gradient - Navy Blue */}
          <defs>
            <linearGradient id={`outerGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id={`innerGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
            <filter id={`shadow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.2)" />
            </filter>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="47"
            fill={`url(#outerGradient-${size})`}
            filter={`url(#shadow-${size})`}
            stroke="none"
            style={{
              border: 'none !important',
              outline: 'none !important',
              stroke: 'none !important',
              strokeWidth: '0 !important'
            }}
          />

          {/* Inner Circle with Gradient - Red */}
          <circle
            cx="50"
            cy="50"
            r="37"
            fill={`url(#innerGradient-${size})`}
            stroke="none"
            style={{
              border: 'none !important',
              outline: 'none !important',
              stroke: 'none !important',
              strokeWidth: '0 !important'
            }}
          />

          {/* Stylized P with News Elements */}
          <g fill="white" filter={`url(#shadow-${size})`}>
            {/* Main P Letter */}
            <path d="M32 22 L32 78 L40 78 L40 54 L58 54 C66 54 72 48 72 40 C72 32 66 22 58 22 L32 22 Z M40 30 L58 30 C62 30 64 32 64 40 C64 48 62 46 58 46 L40 46 L40 30 Z" />

            {/* News Lines - representing text/articles */}
            <rect x="20" y="25" width="8" height="1.5" rx="0.75" opacity="0.8" />
            <rect x="20" y="29" width="6" height="1.5" rx="0.75" opacity="0.6" />
            <rect x="20" y="33" width="7" height="1.5" rx="0.75" opacity="0.4" />

            {/* Digital/Modern accent dots */}
            <circle cx="76" cy="28" r="1.5" opacity="0.9" stroke="none" />
            <circle cx="76" cy="34" r="1" opacity="0.7" stroke="none" />
            <circle cx="76" cy="39" r="0.8" opacity="0.5" stroke="none" />

            {/* Small bridge/connection element (representing Pontianak) */}
            <path d="M22 70 Q27 67 32 70" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="22" r="1" cy="70" stroke="none" />
            <circle cx="32" r="1" cy="70" stroke="none" />
          </g>
        </svg>
      </div>

      {/* Text Logo */}
      {variant === 'full' && showText && (
        <div className="ml-3 flex flex-col">
          <span
            className={`font-heading font-bold leading-tight ${textSizeClasses[size]}`}
            style={{ color: 'var(--primary)' }}
          >
            PONTIGRAM
          </span>
          <span
            className="text-xs font-medium tracking-wide hidden sm:block"
            style={{ color: 'var(--accent)' }}
          >
            NEWS PORTAL
          </span>
        </div>
      )}

      {/* Icon Only - Hidden Text for Accessibility */}
      {variant === 'icon-only' && (
        <span className="sr-only">Pontigram News</span>
      )}
    </div>
  )
}
