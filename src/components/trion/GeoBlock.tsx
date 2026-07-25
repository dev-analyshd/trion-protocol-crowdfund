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
      <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#00FF9D] border-t-transparent rounded-full animate-spin" />
          <p className="data-mono text-[#888] text-sm">VERIFYING JURISDICTION...</p>
        </div>
      </div>
    )
  }

  if (isRestricted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center geo-blur">
        <div className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-auto">
          <div className="glass-card glow-green p-12 max-w-lg text-center border-pulse">
            <div className="text-6xl mb-6 opacity-80">&#9888;</div>
            <h2 className="text-2xl font-bold text-[#ff3333] mb-4 tracking-widest">RESTRICTED JURISDICTION</h2>
            <div className="w-16 h-px bg-[#ff3333] mx-auto mb-6 opacity-50" />
            <p className="text-[#888] text-sm leading-relaxed mb-2">
              Access to the TRION Protocol crowdfund is not available in your jurisdiction.
            </p>
            <p className="text-[#888] text-sm leading-relaxed mb-2">
              Region detected: <span className="text-[#ff3333] font-bold">{countryCode}</span>
            </p>
            <p className="text-[#666] text-xs mt-6">
              This restriction applies to residents of the United States, Canada, and China in compliance with local securities regulations.
            </p>
            <div className="mt-8">
              <p className="text-[#444] text-xs data-mono">ERR_GEO::JURISDICTION_BLOCKED</p>
            </div>
          </div>
        </div>
        {/* Blurred content behind */}
        <div className="relative z-[150]">{children}</div>
      </div>
    )
  }

  return <>{children}</>
}
