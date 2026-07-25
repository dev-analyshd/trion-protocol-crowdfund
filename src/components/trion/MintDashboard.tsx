'use client'

import { motion } from 'framer-motion'
import { useTrionStore } from '@/store/trion-store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function MintDashboard() {
  const {
    isConnected,
    connectWallet,
    disconnectWallet,
    walletAddress,
    email,
    setEmail,
    contributionAmount,
    setContributionAmount,
    contributionCurrency,
    setContributionCurrency,
    isContributing,
    setContributing,
    contributionSuccess,
    setContributionSuccess,
    setMintedNFT,
    setCitizenData,
  } = useTrionStore()

  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = () => {
    // Simulate wallet connection
    const addr = '0x' + Array.from({ length: 40 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')
    connectWallet(addr)
  }

  const handleContribute = async () => {
    setError('')

    // Validation
    if (!isConnected) { setError('Connect your wallet first.'); return }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return }
    if (!agreed) { setError('You must agree to the jurisdiction disclaimer.'); return }
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) { setError('Enter a valid contribution amount.'); return }

    setContributing(true)

    try {
      const res = await fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          walletAddress,
          amount: contributionAmount,
          currency: contributionCurrency,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Contribution failed')

      setMintedNFT({ tokenId: data.nftTokenId, tier: data.tier })
      setCitizenData({
        tier: data.tier,
        totalContributed: contributionAmount,
        tokenBalance: data.tokenAllocation.toString(),
        vestedAmount: '0',
        nftTokenId: data.nftTokenId,
      })
      setContributionSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Transaction failed')
    } finally {
      setContributing(false)
    }
  }

  // Success state
  if (contributionSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto glass-card glow-green p-8 sm:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-[rgba(0,255,157,0.1)] border border-[#00FF9D] flex items-center justify-center"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00FF9D" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#00FF9D] tracking-wider mb-2">CITIZENSHIP CONFIRMED</h2>
          <p className="text-[#888] text-sm mb-8">Welcome to the TRION Protocol. Your soulbound passport has been minted.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-card p-4">
              <p className="text-xs text-[#888] mb-1">PASSPORT TIER</p>
              <p className="text-xl font-bold text-[#00FF9D]">{useTrionStore.getState().mintedNFT?.tier?.toUpperCase()}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-[#888] mb-1">TOKEN ID</p>
              <p className="text-xl font-bold data-mono">#{useTrionStore.getState().mintedNFT?.tokenId}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-[#888] mb-1">VESTING TOKENS</p>
              <p className="text-lg font-bold text-[#00FF9D] data-mono">{useTrionStore.getState().citizenData?.tokenBalance} TRIO</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-[#888] mb-1">VESTING PERIOD</p>
              <p className="text-lg font-bold data-mono">12 MONTHS</p>
            </div>
          </div>

          {/* Vesting schedule chart */}
          <div className="glass-card p-6 mb-8">
            <p className="text-xs text-[#888] tracking-widest mb-4">VESTING SCHEDULE</p>
            <VestingChart />
          </div>

          <button
            onClick={() => { setContributionSuccess(false); useTrionStore.getState().setView('dashboard') }}
            className="px-8 py-3 bg-[#00FF9D] text-[#050505] font-bold text-sm tracking-widest rounded-lg glow-green-sm hover:bg-[#00cc7d] transition-all"
          >
            VIEW CITIZEN PORTAL
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 tracking-wider">BECOME A CITIZEN</h1>
          <p className="text-[#888] text-center text-sm mb-8">Contribute to the TRION Protocol infrastructure</p>
        </motion.div>

        {/* Wallet Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[#00FF9D]' : 'bg-[#ff3333]'}`} />
              <span className="text-sm text-[#888]">WALLET STATUS</span>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#00FF9D] data-mono">
                  {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
                </span>
                <button onClick={disconnectWallet} className="text-xs text-[#888] hover:text-[#ff3333] transition-colors">
                  DISCONNECT
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-[#00FF9D] text-[#050505] text-xs font-bold tracking-widest rounded-lg hover:bg-[#00cc7d] transition-colors"
              >
                CONNECT WALLET
              </button>
            )}
          </div>
        </motion.div>

        {/* Geo Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-card p-4 mb-6 border-[rgba(255,215,0,0.2)]"
          style={{ borderColor: 'rgba(255,215,0,0.2)' }}
        >
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-lg shrink-0">&#9888;</span>
            <p className="text-xs text-[#888] leading-relaxed">
              By connecting your wallet and proceeding, you confirm that you are <strong className="text-[#f0f0f0]">NOT a resident</strong> of the United States, Canada, or China. Contributions from restricted jurisdictions are prohibited under local securities regulations.
            </p>
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-card p-6 mb-6"
        >
          <label className="block text-xs text-[#888] tracking-widest mb-3">EMAIL ADDRESS (REQUIRED)</label>
          <p className="text-xs text-[#666] mb-3">Used for compliance notifications and citizen updates. Never shared.</p>
          <Input
            type="email"
            placeholder="satoshi@trion.network"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#0a0a0a] border-[rgba(0,255,157,0.15)] text-[#f0f0f0] placeholder:text-[#444] data-mono text-sm h-12"
            style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
          />
        </motion.div>

        {/* Contribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="glass-card p-6 mb-6"
        >
          <label className="block text-xs text-[#888] tracking-widest mb-3">CONTRIBUTION AMOUNT</label>

          {/* Currency Toggle */}
          <div className="flex gap-2 mb-4">
            {(['ETH', 'USDC'] as const).map((cur) => (
              <button
                key={cur}
                onClick={() => setContributionCurrency(cur)}
                className={`flex-1 py-2 text-xs font-bold tracking-widest rounded-lg transition-all ${
                  contributionCurrency === cur
                    ? 'bg-[rgba(0,255,157,0.15)] text-[#00FF9D] border border-[#00FF9D]'
                    : 'bg-transparent text-[#888] border border-[rgba(0,255,157,0.1)] hover:text-[#f0f0f0]'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>

          <div className="relative">
            <Input
              type="number"
              placeholder={contributionCurrency === 'ETH' ? '0.05' : '100'}
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              className="bg-[#0a0a0a] border-[rgba(0,255,157,0.15)] text-[#f0f0f0] placeholder:text-[#444] data-mono text-lg h-14 pr-16"
              style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
              min="0"
              step="any"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#888] tracking-widest">
              {contributionCurrency}
            </span>
          </div>

          {/* Quick select amounts */}
          <div className="flex gap-2 mt-3">
            {(contributionCurrency === 'ETH'
              ? ['0.05', '0.25', '1.0', '5.0']
              : ['100', '500', '2000', '10000']
            ).map((amt) => (
              <button
                key={amt}
                onClick={() => setContributionAmount(amt)}
                className="flex-1 py-2 text-xs data-mono text-[#888] border border-[rgba(0,255,157,0.1)] rounded-lg hover:text-[#00FF9D] hover:border-[rgba(0,255,157,0.3)] transition-all"
              >
                {amt}
              </button>
            ))}
          </div>

          {/* Tier Preview */}
          <div className="mt-4 p-3 rounded-lg bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.1)]">
            <p className="text-xs text-[#888]">ESTIMATED TIER</p>
            <p className="text-lg font-bold text-[#00FF9D]">
              {(() => {
                const val = parseFloat(contributionAmount || '0')
                const usdVal = contributionCurrency === 'ETH' ? val * 3500 : val
                if (usdVal >= 2000) return 'GOLD (150,000 TRIO)'
                if (usdVal >= 500) return 'SILVER (30,000 TRIO)'
                if (usdVal >= 100) return 'BRONZE (5,000 TRIO)'
                return 'BELOW MINIMUM ($100)'
              })()}
            </p>
          </div>
        </motion.div>

        {/* Agreement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setAgreed(!agreed)}
              className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                agreed
                  ? 'bg-[#00FF9D] border-[#00FF9D]'
                  : 'border-[rgba(0,255,157,0.3)] group-hover:border-[#00FF9D]'
              }`}
            >
              {agreed && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-xs text-[#888] leading-relaxed">
              I confirm I am not a resident of the US, Canada, or China. I understand that $TRIO tokens are utility tokens with vesting (12 months), and the TRION Genesis Passport NFT is soulbound (non-transferable).
            </span>
          </label>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[rgba(255,51,51,0.1)] border border-[rgba(255,51,51,0.2)]">
            <p className="text-xs text-[#ff3333] data-mono">ERR: {error}</p>
          </div>
        )}

        {/* Submit */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleContribute}
          disabled={isContributing || !isConnected || !agreed}
          className="w-full py-4 bg-[#00FF9D] text-[#050505] font-bold text-sm tracking-widest rounded-lg glow-green-sm hover:bg-[#00cc7d] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#00FF9D]"
        >
          {isContributing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
              PROCESSING TRANSACTION...
            </span>
          ) : (
            'SIGN & CONTRIBUTE'
          )}
        </motion.button>

        <p className="text-center text-xs text-[#444] mt-4 data-mono">
          TX_FLOW::CONTRIBUTE_VAULT → MINT_NFT → VEST_TOKENS
        </p>
      </div>
    </div>
  )
}

// Simple vesting chart component
function VestingChart() {
  const months = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12']
  const values = months.map((_, i) => Math.round((i / 12) * 100))

  return (
    <div className="flex items-end gap-1 h-32">
      {months.map((m, i) => (
        <div key={m} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t transition-all duration-300"
            style={{
              height: `${Math.max(values[i], 2)}%`,
              background: i === 12 ? '#00FF9D' : `rgba(0,255,157,${0.3 + (i / 12) * 0.7})`,
              minHeight: '4px',
            }}
          />
          <span className="text-[8px] text-[#666]">{m}</span>
        </div>
      ))}
    </div>
  )
}
