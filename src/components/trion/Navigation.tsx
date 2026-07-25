'use client'

import { motion } from 'framer-motion'
import { useTrionStore } from '@/store/trion-store'

export default function Navigation() {
  const { currentView, setView, isConnected, walletAddress, disconnectWallet } = useTrionStore()

  const navItems = [
    { id: 'landing' as const, label: 'HOME', shortLabel: 'HOME' },
    { id: 'manifesto' as const, label: 'MANIFESTO', shortLabel: 'DOCS' },
    { id: 'mint' as const, label: 'CONTRIBUTE', shortLabel: 'MINT' },
    { id: 'dashboard' as const, label: 'PORTAL', shortLabel: 'DASH' },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-[rgba(0,255,157,0.1)]"
      style={{ background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00FF9D] flex items-center justify-center">
              <span className="text-[#050505] font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-bold tracking-[0.2em] hidden sm:block">TRION</span>
          </button>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-3 py-2 text-xs tracking-widest transition-all duration-200 rounded ${
                  currentView === item.id
                    ? 'text-[#00FF9D] bg-[rgba(0,255,157,0.1)]'
                    : 'text-[#888] hover:text-[#f0f0f0] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </button>
            ))}
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                <span className="text-xs text-[#00FF9D] data-mono hidden md:block">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-[#888] hover:text-[#ff3333] transition-colors ml-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
