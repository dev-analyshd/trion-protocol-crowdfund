'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTrionStore } from '@/store/trion-store'
import { Sidebar } from '@/components/trion/Sidebar'
import GeoBlock from '@/components/trion/GeoBlock'
import { OverviewPage } from '@/components/trion/OverviewPage'
import { ContributePage } from '@/components/trion/ContributePage'
import { PortalPage } from '@/components/trion/PortalPage'
import { DocsPage } from '@/components/trion/DocsPage'
import { useEffect } from 'react'

const pageVariants = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
}

export default function Home() {
  const { currentView, setTotalContributions, setTotalContributors } = useTrionStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fetch live stats on mount
  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => {
        setTotalContributions(data.totalContributions)
        setTotalContributors(data.totalContributors)
      })
      .catch(() => { /* keep defaults */ })
  }, [setTotalContributions, setTotalContributors])

  return (
    <GeoBlock>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile top bar */}
          <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-md hover:bg-accent transition-colors" aria-label="Open sidebar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <img src="/trion-logo.png" alt="" className="w-6 h-6 rounded" />
              <span className="text-sm font-bold">TRION</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {currentView === 'landing' && (
                <motion.div key="overview" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <OverviewPage />
                </motion.div>
              )}
              {currentView === 'mint' && (
                <motion.div key="contribute" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <ContributePage />
                </motion.div>
              )}
              {currentView === 'dashboard' && (
                <motion.div key="portal" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <PortalPage />
                </motion.div>
              )}
              {currentView === 'manifesto' && (
                <motion.div key="docs" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
                  <DocsPage />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </GeoBlock>
  )
}
