'use client'

import { motion } from 'framer-motion'
import { useTrionStore } from '@/store/trion-store'
import { useCallback, useEffect, useState } from 'react'

export default function CitizenPortal() {
  const { isConnected, connectWallet, walletAddress, citizenData, setCitizenData } = useTrionStore()
  const [loading, setLoading] = useState(false)

  const fetchCitizen = useCallback(async (addr: string) => {
    setLoading(true)
    try {
      const r = await fetch(`/api/citizens?wallet=${addr}`)
      const data = await r.json()
      if (data.tier) {
        setCitizenData({
          tier: data.tier,
          totalContributed: data.totalContributed,
          tokenBalance: data.tokenBalance || '0',
          vestedAmount: '0',
          nftTokenId: data.nftTokenId,
        })
      }
    } catch { /* not found or error */ }
    finally { setLoading(false) }
  }, [setCitizenData])

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchCitizen(walletAddress)
    }
  }, [isConnected, walletAddress, fetchCitizen])

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[rgba(0,255,157,0.1)] border border-[rgba(0,255,157,0.2)] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF9D" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 tracking-wider">WALLET REQUIRED</h2>
          <p className="text-sm text-[#888] mb-6">Connect your wallet to access the Citizen Portal.</p>
          <button
            onClick={connectWallet}
            className="px-8 py-3 bg-[#00FF9D] text-[#050505] font-bold text-sm tracking-widest rounded-lg glow-green-sm hover:bg-[#00cc7d] transition-all"
          >
            CONNECT WALLET
          </button>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00FF9D] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!citizenData) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.2)] flex items-center justify-center">
            <span className="text-2xl">&#x1F512;</span>
          </div>
          <h2 className="text-xl font-bold mb-2 tracking-wider">NO CITIZENSHIP FOUND</h2>
          <p className="text-sm text-[#888] mb-6">
            Your wallet is connected but no TRION citizenship is associated with it. Contribute to the protocol to receive your Genesis Passport.
          </p>
          <button
            onClick={() => useTrionStore.getState().setView('mint')}
            className="px-8 py-3 bg-[#00FF9D] text-[#050505] font-bold text-sm tracking-widest rounded-lg glow-green-sm hover:bg-[#00cc7d] transition-all"
          >
            CONTRIBUTE NOW
          </button>
        </motion.div>
      </div>
    )
  }

  const tierColors: Record<string, string> = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider mb-2">CITIZEN PORTAL</h1>
          <p className="text-sm text-[#888]">Your TRION Protocol citizenship dashboard</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NFT Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <p className="text-xs text-[#888] tracking-widest mb-4">SOULBOUND PASSPORT</p>
            <div className="relative aspect-square rounded-xl overflow-hidden mb-4 border border-pulse" style={{ borderColor: tierColors[citizenData.tier] + '40' }}>
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-6"
                style={{
                  background: `radial-gradient(circle at 50% 30%, ${tierColors[citizenData.tier]}15 0%, transparent 60%), linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #050505 100%)`,
                }}
              >
                <div className="w-20 h-20 rounded-full border-2 mb-4 flex items-center justify-center" style={{ borderColor: tierColors[citizenData.tier] }}>
                  <span className="text-3xl font-bold" style={{ color: tierColors[citizenData.tier] }}>
                    {citizenData.tier === 'gold' ? 'G' : citizenData.tier === 'silver' ? 'S' : 'B'}
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-[0.3em]" style={{ color: tierColors[citizenData.tier] }}>
                  {citizenData.tier.toUpperCase()}
                </h3>
                <p className="text-xs text-[#888] mt-1">TRION GENESIS PASSPORT</p>
                <p className="text-xs text-[#666] mt-2 data-mono">#{citizenData.nftTokenId || '0001'}</p>

                {/* Network health indicator */}
                <div className="mt-6 px-4 py-2 rounded-lg bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.1)]">
                  <p className="text-[10px] text-[#888]">NETWORK HEALTH</p>
                  <p className="text-sm font-bold text-[#00FF9D]">87/100</p>
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: tierColors[citizenData.tier] + '60' }} />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: tierColors[citizenData.tier] + '60' }} />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: tierColors[citizenData.tier] + '60' }} />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: tierColors[citizenData.tier] + '60' }} />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
              <p className="text-xs text-[#888]">Soulbound — Non-transferable</p>
            </div>
          </motion.div>

          {/* Token & Vesting Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Token Balance */}
            <div className="glass-card p-6">
              <p className="text-xs text-[#888] tracking-widest mb-4">TOKEN HOLDINGS</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888]">Total Allocated</span>
                  <span className="text-lg font-bold text-[#00FF9D] data-mono">
                    {Number(citizenData.tokenBalance).toLocaleString()} TRIO
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888]">Currently Vested</span>
                  <span className="text-lg font-bold text-[#f0f0f0] data-mono">
                    {Number(citizenData.vestedAmount).toLocaleString()} TRIO
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888]">Available to Claim</span>
                  <span className="text-lg font-bold text-[#666] data-mono">0 TRIO</span>
                </div>
                <div className="w-full h-px bg-[rgba(0,255,157,0.1)]" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#888]">Total Contributed</span>
                  <span className="text-sm font-bold text-[#f0f0f0] data-mono">
                    {citizenData.totalContributed} ETH
                  </span>
                </div>
              </div>
            </div>

            {/* Vesting Schedule */}
            <div className="glass-card p-6">
              <p className="text-xs text-[#888] tracking-widest mb-4">VESTING SCHEDULE</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#888]">Start</span>
                  <span className="data-mono text-[#f0f0f0]">2025-01-15</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#888]">End</span>
                  <span className="data-mono text-[#f0f0f0]">2026-01-15</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#888]">Type</span>
                  <span className="data-mono text-[#00FF9D]">LINEAR (12M)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#888]">Cliff</span>
                  <span className="data-mono text-[#f0f0f0]">NONE</span>
                </div>
              </div>

              {/* Mini vesting chart */}
              <div className="mt-4 flex items-end gap-[2px] h-16">
                {Array.from({ length: 13 }, (_, i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{
                    height: `${Math.max((i / 12) * 100, 3)}%`,
                    background: `rgba(0,255,157,${0.2 + (i / 12) * 0.8})`,
                  }} />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px] text-[#666]">JAN 2025</span>
                <span className="text-[8px] text-[#666]">JUL 2025</span>
                <span className="text-[8px] text-[#666]">JAN 2026</span>
              </div>
            </div>

            {/* Links */}
            <div className="glass-card p-6">
              <p className="text-xs text-[#888] tracking-widest mb-4">PROTOCOL RESOURCES</p>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.1)] hover:border-[rgba(0,255,157,0.3)] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF9D" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  <div>
                    <p className="text-sm text-[#f0f0f0]">TRION GitHub</p>
                    <p className="text-xs text-[#666]">Protocol source code & audits</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.1)] hover:border-[rgba(0,255,157,0.3)] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF9D" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <div>
                    <p className="text-sm text-[#f0f0f0]">Technical Whitepaper</p>
                    <p className="text-xs text-[#666]">Architecture & tokenomics</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
