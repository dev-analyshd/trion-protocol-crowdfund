'use client'

import { useTrionStore } from '@/store/trion-store'
import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function PortalPage() {
  const { isConnected, connectWallet, walletAddress, citizenData, setCitizenData, setView } = useTrionStore()
  const [loading, setLoading] = useState(false)

  const fetchCitizen = useCallback(async (addr: string) => {
    setLoading(true)
    try {
      const r = await fetch(`/api/citizens?wallet=${addr}`)
      const data = await r.json()
      if (data.tier) {
        setCitizenData({ tier: data.tier, totalContributed: data.totalContributed, tokenBalance: data.tokenBalance || '0', vestedAmount: '0', nftTokenId: data.nftTokenId })
      }
    } catch { /* not found */ }
    finally { setLoading(false) }
  }, [setCitizenData])

  useEffect(() => {
    if (isConnected && walletAddress) fetchCitizen(walletAddress)
  }, [isConnected, walletAddress, fetchCitizen])

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold tracking-tight">Citizen Portal</h1><p className="text-sm text-muted-foreground">Your TRION Protocol dashboard</p></div>
        <div className="dash-card p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold mb-1">Wallet Required</h2>
          <p className="text-sm text-muted-foreground mb-4">Connect your wallet to access the Citizen Portal.</p>
          <button onClick={connectWallet} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Connect Wallet</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!citizenData) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold tracking-tight">Citizen Portal</h1><p className="text-sm text-muted-foreground">Your TRION Protocol dashboard</p></div>
        <div className="dash-card p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-lg font-bold mb-1">No Citizenship Found</h2>
          <p className="text-sm text-muted-foreground mb-4">Contribute to the protocol to receive your Genesis Passport.</p>
          <button onClick={() => setView('mint')} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Contribute Now</button>
        </div>
      </div>
    )
  }

  const tierColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    bronze: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-l-amber-500', badge: 'badge-success' },
    silver: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-l-blue-500', badge: 'badge-primary' },
    gold: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-l-purple-500', badge: 'badge-warning' },
  }
  const tc = tierColors[citizenData.tier] || tierColors.bronze

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Citizen Portal</h1>
        <p className="text-sm text-muted-foreground">Your TRION Protocol citizenship dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* NFT Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`dash-card border-l-4 ${tc.border} overflow-hidden`}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-sm font-semibold">Soulbound Passport</p>
              <span className={tc.badge}>{citizenData.tier}</span>
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-secondary to-card">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <img src="/trion-logo.png" alt="TRION" className="w-20 h-20 rounded-2xl mb-4" />
                <h3 className={`text-2xl font-bold ${tc.text}`}>{citizenData.tier.toUpperCase()}</h3>
                <p className="text-xs text-muted-foreground mt-1">TRION Genesis Passport</p>
                <p className="text-xs text-muted-foreground data-mono mt-2">#{citizenData.nftTokenId || '0001'}</p>
                <div className="mt-4 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <p className="text-[10px] text-muted-foreground">Network Health</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">87/100</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-muted-foreground">Soulbound — Non-transferable</p>
            </div>
          </div>
        </motion.div>

        {/* Token Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="dash-card p-5">
            <p className="text-sm font-semibold mb-4">Token Holdings</p>
            <div className="space-y-3">
              {[
                { label: 'Total Allocated', value: `${Number(citizenData.tokenBalance).toLocaleString()} TRIO`, color: 'text-primary font-bold' },
                { label: 'Currently Vested', value: `${Number(citizenData.vestedAmount).toLocaleString()} TRIO`, color: 'font-bold' },
                { label: 'Available to Claim', value: '0 TRIO', color: 'font-bold text-muted-foreground' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-sm ${item.color}`}>{item.value}</span>
                </div>
              ))}
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Contributed</span>
                <span className="text-sm font-bold data-mono">{citizenData.totalContributed} ETH</span>
              </div>
            </div>
          </div>

          <div className="dash-card p-5">
            <p className="text-sm font-semibold mb-4">Vesting Schedule</p>
            <div className="space-y-2 mb-4">
              {[
                { label: 'Start', value: 'Jan 15, 2025' },
                { label: 'End', value: 'Jan 15, 2026' },
                { label: 'Type', value: 'Linear (12M)' },
                { label: 'Cliff', value: 'None' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium data-mono">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-[2px] h-16">
              {Array.from({ length: 13 }, (_, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{
                  height: `${Math.max((i / 12) * 100, 3)}%`,
                  background: `linear-gradient(to top, rgba(59,130,246,${0.2 + (i / 12) * 0.8}), rgba(139,92,246,${0.2 + (i / 12) * 0.8}))`,
                }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">JAN 2025</span>
              <span className="text-[10px] text-muted-foreground">JUL 2025</span>
              <span className="text-[10px] text-muted-foreground">JAN 2026</span>
            </div>
          </div>

          <div className="dash-card p-5">
            <p className="text-sm font-semibold mb-4">Protocol Resources</p>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                <div><p className="text-sm font-medium">TRION GitHub</p><p className="text-xs text-muted-foreground">Source code & audits</p></div>
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                <div><p className="text-sm font-medium">Technical Whitepaper</p><p className="text-xs text-muted-foreground">Architecture & tokenomics</p></div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
