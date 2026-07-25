'use client'

import { useState, useEffect } from 'react'

export default function GeoBlock({ children }: { children: React.ReactNode }) {
  const [isRestricted, setIsRestricted] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [countryCode, setCountryCode] = useState<string>('')

  useEffect(() => {
    const checkGeo = async () => {
      try {
        const res = await fetch('/api/geocheck')
        const data = await res.json()
        if (data.restricted) {
          setIsRestricted(true)
          setCountryCode(data.countryCode || 'RESTRICTED')
        }
      } catch {
        // Fail open - don't block users on API failure
      } finally {
        setIsChecking(false)
      }
    }
    checkGeo()
  }, [])

  if (isChecking) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Verifying jurisdiction...</p>
        </div>
      </div>
    )
  }

  if (isRestricted) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="fixed inset-0 geo-blur">{children}</div>
        <div className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-auto">
          <div className="dash-card p-8 sm:p-12 max-w-lg text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-destructive">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-destructive mb-3">Restricted Jurisdiction</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">
              Access to the TRION Protocol crowdfund is not available in your jurisdiction.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">
              Region detected: <span className="text-destructive font-bold">{countryCode}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-4 mb-6">
              This restriction applies to residents of the United States, Canada, and China in compliance with local securities regulations. If you believe this is an error, contact support.
            </p>
            <button
              onClick={() => setIsRestricted(false)}
              className="px-6 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-accent transition-colors"
            >
              I understand — continue anyway
            </button>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground font-mono">ERR_GEO::JURISDICTION_BLOCKED</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
