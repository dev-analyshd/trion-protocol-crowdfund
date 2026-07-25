'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTrionStore } from '@/store/trion-store'
import Navigation from '@/components/trion/Navigation'
import GeoBlock from '@/components/trion/GeoBlock'
import { HeroSection, ProgressBar, TierCards } from '@/components/trion/Landing'
import MintDashboard from '@/components/trion/MintDashboard'
import CitizenPortal from '@/components/trion/CitizenPortal'
import Manifesto from '@/components/trion/Manifesto'
import { useEffect } from 'react'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export default function Home() {
  const { currentView, setTotalContributions, setTotalContributors } = useTrionStore()

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
      <Navigation />

      <main className="min-h-screen bg-[#050505]">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <HeroSection />

              {/* Stats Section */}
              <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="text-center mb-12">
                      <p className="text-xs text-[#00FF9D] data-mono tracking-widest mb-3">LIVE CROWDFUND DATA</p>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
                        <span className="text-xs text-[#888]">CONTRACT ACTIVE</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                      <StatCard label="TOTAL RAISED" value={`$${useTrionStore.getState().totalContributions.toLocaleString()}`} accent />
                      <StatCard label="FOUNDING CITIZENS" value={String(useTrionStore.getState().totalContributors)} />
                      <StatCard label="PROTOCOL STATUS" value="MAINNET READY" color="#00FF9D" />
                    </div>

                    <ProgressBar />
                  </motion.div>
                </div>
              </section>

              {/* Tiers Section */}
              <section className="py-16 px-4">
                <div className="text-center mb-12">
                  <p className="text-xs text-[#00FF9D] data-mono tracking-widest mb-3">CITIZENSHIP TIERS</p>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-wider">Choose Your Level of Commitment</h2>
                </div>
                <TierCards />
              </section>

              {/* Footer */}
              <footer className="py-12 px-4 border-t border-[rgba(0,255,157,0.1)]">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-[#00FF9D] flex items-center justify-center">
                      <span className="text-[#050505] font-bold text-[10px]">T</span>
                    </div>
                    <span className="text-xs text-[#666] tracking-wider">TRION PROTOCOL v1.0</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-[#666]">SMART CONTRACTS AUDITED</span>
                    <span className="text-xs text-[#666]">SOULBOUND NFTs</span>
                    <span className="text-xs text-[#666]">NON-TRANSFERABLE</span>
                  </div>
                </div>
              </footer>
            </motion.div>
          )}

          {currentView === 'mint' && (
            <motion.div
              key="mint"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <MintDashboard />
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <CitizenPortal />
            </motion.div>
          )}

          {currentView === 'manifesto' && (
            <motion.div
              key="manifesto"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Manifesto />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </GeoBlock>
  )
}

// Reusable stat card component
function StatCard({ label, value, accent, color }: { label: string; value: string; accent?: boolean; color?: string }) {
  return (
    <div className="glass-card p-6 text-center">
      <p className="text-xs text-[#888] tracking-widest mb-2">{label}</p>
      <p
        className="text-2xl sm:text-3xl font-bold data-mono"
        style={{ color: color || (accent ? '#00FF9D' : '#f0f0f0') }}
      >
        {value}
      </p>
    </div>
  )
}
