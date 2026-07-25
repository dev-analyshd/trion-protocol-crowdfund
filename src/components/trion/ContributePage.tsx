'use client'

import { useTrionStore } from '@/store/trion-store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function ContributePage() {
  const {
    isConnected, connectWallet, disconnectWallet, walletAddress,
    email, setEmail, contributionAmount, setContributionAmount,
    contributionCurrency, setContributionCurrency,
    isContributing, setContributing, contributionSuccess,
    setContributionSuccess, setMintedNFT, setCitizenData,
  } = useTrionStore()

  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = () => {
    const addr = '0x' + Array.from({ length: 40 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')
    connectWallet(addr)
  }

  const handleContribute = async () => {
    setError('')
    if (!isConnected) { setError('Connect your wallet first.') }
    else if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.') }
    else if (!agreed) { setError('You must agree to the jurisdiction disclaimer.') }
    else if (!contributionAmount || parseFloat(contributionAmount) <= 0) { setError('Enter a valid contribution amount.') }
    else {
      setContributing(true)
      try {
        const res = await fetch('/api/contribute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, walletAddress, amount: contributionAmount, currency: contributionCurrency }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed')
        setMintedNFT({ tokenId: data.nftTokenId, tier: data.tier })
        setCitizenData({ tier: data.tier, totalContributed: contributionAmount, tokenBalance: String(data.tokenAllocation), vestedAmount: '0', nftTokenId: data.nftTokenId })
        setContributionSuccess(true)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Transaction failed')
      } finally {
        setContributing(false)
      }
    }
  }

  const getTierPreview = () => {
    const val = parseFloat(contributionAmount || '0')
    const usd = contributionCurrency === 'ETH' ? val * 3500 : val
    if (usd >= 2000) return { tier: 'Gold', tokens: '150,000 TRIO', color: 'text-purple-600 dark:text-purple-400', badge: 'badge-warning' }
    if (usd >= 500) return { tier: 'Silver', tokens: '30,000 TRIO', color: 'text-blue-600 dark:text-blue-400', badge: 'badge-primary' }
    if (usd >= 100) return { tier: 'Bronze', tokens: '5,000 TRIO', color: 'text-amber-600 dark:text-amber-400', badge: 'badge-success' }
    return { tier: 'Below min', tokens: '—', color: 'text-muted-foreground', badge: '' }
  }

  const tierPreview = getTierPreview()

  // ── Success State ──
  if (contributionSuccess) {
    const nft = useTrionStore.getState().mintedNFT
    const citizen = useTrionStore.getState().citizenData
    return (
      <div className="space-y-6">
        <div className="dash-card p-6 sm:p-8 max-w-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600 dark:text-emerald-400">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Citizenship Confirmed</h2>
            <p className="text-sm text-muted-foreground mt-1">Your soulbound passport has been minted.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="stat-card"><p className="text-xs text-muted-foreground">Passport Tier</p><p className="text-lg font-bold capitalize">{nft?.tier}</p></div>
            <div className="stat-card"><p className="text-xs text-muted-foreground">Token ID</p><p className="text-lg font-bold data-mono">#{nft?.tokenId}</p></div>
            <div className="stat-card"><p className="text-xs text-muted-foreground">Vesting Tokens</p><p className="text-lg font-bold text-primary">{Number(citizen?.tokenBalance).toLocaleString()} TRIO</p></div>
            <div className="stat-card"><p className="text-xs text-muted-foreground">Vesting Period</p><p className="text-lg font-bold">12 Months</p></div>
          </div>
          <div className="dash-card p-4 mb-6">
            <p className="text-xs font-medium text-muted-foreground mb-3">VESTING SCHEDULE</p>
            <div className="flex items-end gap-[2px] h-24">
              {Array.from({ length: 13 }, (_, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{
                  height: `${Math.max((i / 12) * 100, 3)}%`,
                  background: `linear-gradient(to top, rgba(59,130,246,${0.3 + (i / 12) * 0.7}), rgba(139,92,246,${0.3 + (i / 12) * 0.7}))`,
                }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">Jan 2025</span>
              <span className="text-[10px] text-muted-foreground">Jul 2025</span>
              <span className="text-[10px] text-muted-foreground">Jan 2026</span>
            </div>
          </div>
          <button onClick={() => { setContributionSuccess(false); useTrionStore.getState().setView('dashboard') }} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            View Citizen Portal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contribute</h1>
        <p className="text-sm text-muted-foreground">Become a founding citizen of the TRION Protocol</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Wallet */}
          <div className="dash-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <span className="text-sm font-medium">Wallet</span>
              </div>
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm data-mono text-muted-foreground">{walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}</span>
                  <button onClick={disconnectWallet} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Disconnect</button>
                </div>
              ) : (
                <button onClick={handleConnect} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity">Connect Wallet</button>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="dash-card p-4 border-l-4 border-l-amber-500">
            <div className="flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500 shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p className="text-xs text-muted-foreground leading-relaxed">By connecting, you confirm you are <strong className="text-foreground">NOT a resident</strong> of the US, Canada, or China.</p>
            </div>
          </div>

          {/* Email */}
          <div className="dash-card p-4">
            <label className="block text-sm font-medium mb-2">Email Address <span className="text-destructive">*</span></label>
            <Input type="email" placeholder="satoshi@trion.network" value={email} onChange={(e) => setEmail(e.target.value)}
              className="h-11 data-mono text-sm" />
          </div>

          {/* Amount */}
          <div className="dash-card p-4">
            <label className="block text-sm font-medium mb-2">Contribution Amount</label>
            <div className="flex gap-2 mb-3">
              {(['ETH', 'USDC'] as const).map((cur) => (
                <button key={cur} onClick={() => setContributionCurrency(cur)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${contributionCurrency === cur ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                  {cur}
                </button>
              ))}
            </div>
            <div className="relative">
              <Input type="number" placeholder={contributionCurrency === 'ETH' ? '0.05' : '100'} value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)}
                className="h-11 data-mono text-lg pr-16" min="0" step="any" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">{contributionCurrency}</span>
            </div>
            <div className="flex gap-2 mt-3">
              {(contributionCurrency === 'ETH' ? ['0.05', '0.25', '1.0', '5.0'] : ['100', '500', '2000', '10000']).map((amt) => (
                <button key={amt} onClick={() => setContributionAmount(amt)} className="flex-1 py-1.5 text-xs data-mono rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">{amt}</button>
              ))}
            </div>
          </div>

          {/* Agreement */}
          <div className="flex items-start gap-3">
            <button onClick={() => setAgreed(!agreed)} className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${agreed ? 'bg-primary border-primary' : 'border-border'}`}>
              {agreed && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary-foreground"><polyline points="20 6 9 17 4 12" /></svg>}
            </button>
            <span className="text-xs text-muted-foreground leading-relaxed">I confirm I am not a resident of the US, Canada, or China. I understand that $TRIO tokens have 12-month vesting and the Genesis Passport is non-transferable.</span>
          </div>

          {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30"><p className="text-xs text-red-600 dark:text-red-400">{error}</p></div>}

          <motion.button whileTap={{ scale: 0.98 }} onClick={handleContribute}
            disabled={isContributing || !isConnected || !agreed}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
            {isContributing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Processing...
              </span>
            ) : 'Sign & Contribute'}
          </motion.button>
        </div>

        {/* Right sidebar: Tier preview */}
        <div className="space-y-4">
          <div className="dash-card p-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">ESTIMATED TIER</p>
            <div className="text-center">
              <p className={`text-2xl font-bold ${tierPreview.color}`}>{tierPreview.tier}</p>
              {tierPreview.badge && <span className={`badge-${tierPreview.tier === 'Gold' ? 'warning' : tierPreview.tier === 'Silver' ? 'primary' : 'success'} mt-2`}>{tierPreview.tier}</span>}
              <p className="text-sm font-medium mt-2">{tierPreview.tokens}</p>
            </div>
          </div>

          <div className="dash-card p-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">TIER REWARDS</p>
            <div className="space-y-3">
              {[
                { tier: 'Bronze', min: '$100', tokens: '5,000 TRIO', color: 'text-amber-600' },
                { tier: 'Silver', min: '$500', tokens: '30,000 TRIO', color: 'text-blue-600' },
                { tier: 'Gold', min: '$2,000', tokens: '150,000 TRIO', color: 'text-purple-600' },
              ].map(t => (
                <div key={t.tier} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${t.tier === 'Gold' ? 'bg-purple-500' : t.tier === 'Silver' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                    <span className="text-sm font-medium">{t.tier}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Min {t.min}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-card p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <p className="text-xs font-medium text-muted-foreground mb-1">WHAT YOU GET</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-foreground flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500"><polyline points="20 6 9 17 4 12" /></svg>Soulbound Genesis NFT</li>
              <li className="text-xs text-foreground flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500"><polyline points="20 6 9 17 4 12" /></svg>Governance voting rights</li>
              <li className="text-xs text-foreground flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500"><polyline points="20 6 9 17 4 12" /></svg>Vested utility tokens</li>
              <li className="text-xs text-foreground flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500"><polyline points="20 6 9 17 4 12" /></svg>Protocol revenue share</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
