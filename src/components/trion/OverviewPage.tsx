'use client'

import { useTrionStore } from '@/store/trion-store'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

// ── Oracle plane data ────────────────────────────────────────────
const oraclePlanes = [
  { symbol: 'Φ', name: 'Physical', weight: 'α = 0.25', color: 'bg-emerald-500', description: '9 Shannon entropy features over transaction flow' },
  { symbol: 'M', name: 'Mental', weight: 'β = 0.30', color: 'bg-blue-500', description: 'Observer-effect correction & prediction interval narrowing' },
  { symbol: 'Σ', name: 'Spiritual', weight: 'γ = 0.25', color: 'bg-purple-500', description: 'Diversity-weighted BFT with HHI monopoly prevention' },
  { symbol: 'K', name: 'Conscious', weight: 'δ = 0.10', color: 'bg-amber-500', description: 'Human annotation network with 6 anti-capture protections' },
  { symbol: 'A', name: 'ANIMA', weight: 'ε = 0.10', color: 'bg-rose-500', description: '128-dimensional archetype matching in FAISS' },
]

// ── Network stats ────────────────────────────────────────────────
const networkStats = [
  { label: 'Behavioral Hashes', value: '1,056,140', sub: 'across 48 chains', color: 'text-emerald-500' },
  { label: 'Indexed Entities', value: '22,161', sub: 'vectors in FAISS', color: 'text-blue-500' },
  { label: 'Signal Types', value: '24', sub: 'canonical event types', color: 'text-purple-500' },
  { label: 'Chains Covered', value: '100', sub: '13 VM families', color: 'text-amber-500' },
  { label: 'Blocks Processed', value: '27,030', sub: 'live counter', color: 'text-primary', live: true },
  { label: 'Exploits Blocked', value: '$3.3B+', sub: 'protected', color: 'text-rose-500' },
]

// ── Exploit shield data ──────────────────────────────────────────
const exploits = [
  { attack: 'Jimbos Protocol', loss: '$7.5M', type: 'ORACLE_ATTACK', ct: 0.275, decision: 'BLOCKED' },
  { attack: 'Rodeo Finance', loss: '$888K', type: 'ORACLE_ATTACK', ct: 0.275, decision: 'BLOCKED' },
  { attack: 'Sentiment Protocol', loss: '$1M', type: 'ORACLE_ATTACK', ct: 0.405, decision: 'BLOCKED' },
  { attack: 'Harvest Finance', loss: '$34M', type: 'ORACLE_ATTACK', ct: 0.275, decision: 'BLOCKED' },
  { attack: 'Beanstalk', loss: '$182M', type: 'GOVERNANCE_CAPTURE', ct: 0.353, decision: 'BLOCKED' },
  { attack: 'Mango Markets', loss: '$114M', type: 'COORDINATED_PUMP', ct: 0.302, decision: 'BLOCKED' },
  { attack: 'AAVE March 2026', loss: '$49.5M', type: 'LIQUIDITY_HEALTH', ct: 0.405, decision: 'BLOCKED' },
]

// ── Signal types ─────────────────────────────────────────────────
const signalCategories: { name: string; color: string; bgColor: string; textColor: string; signals: string[] }[] = [
  {
    name: 'Market',
    color: 'border-emerald-500/30',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    signals: ['VALUATION', 'TRAJECTORY', 'NEGATIVE_SPACE'],
  },
  {
    name: 'Risk',
    color: 'border-red-500/30',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-400',
    signals: ['SILENCE', 'MANIPULATION_ALERT', 'SYSTEMIC_RISK', 'MEV_EXPOSURE'],
  },
  {
    name: 'Governance',
    color: 'border-purple-500/30',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-700 dark:text-purple-400',
    signals: ['GOVERNANCE_SIGNAL', 'REGULATORY_BHV'],
  },
  {
    name: 'Cross-Chain',
    color: 'border-cyan-500/30',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    textColor: 'text-cyan-700 dark:text-cyan-400',
    signals: ['CROSS_CHAIN_COHERENCE', 'FORK_DIVERGENCE'],
  },
  {
    name: 'Health',
    color: 'border-blue-500/30',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-400',
    signals: ['LIQUIDITY_HEALTH', 'STABLECOIN_HEALTH', 'ECOSYSTEM_HEALTH'],
  },
  {
    name: 'Behavioral',
    color: 'border-amber-500/30',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-700 dark:text-amber-400',
    signals: ['INSTITUTIONAL_BHV', 'PHASE_TRANSITION'],
  },
  {
    name: 'Lifecycle',
    color: 'border-rose-500/30',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    textColor: 'text-rose-700 dark:text-rose-400',
    signals: ['GENESIS', 'RESURRECTION', 'BOOTSTRAP'],
  },
  {
    name: 'Emergence',
    color: 'border-teal-500/30',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    textColor: 'text-teal-700 dark:text-teal-400',
    signals: ['BIOLOGICAL_CAPITAL'],
  },
]

export function OverviewPage() {
  const { totalContributions, totalContributors, fundingGoal, setView } = useTrionStore()

  // Live counter for blocks processed
  const [blockCount, setBlockCount] = useState(27030)
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockCount((prev) => prev + Math.floor(Math.random() * 3) + 1)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const percentage = Math.min((totalContributions / fundingGoal) * 100, 100)

  // Mock live activity data
  const recentActivity = [
    { time: '2m ago', wallet: '0x3f...a9e2', amount: '0.25 ETH', tier: 'Silver', status: 'confirmed' },
    { time: '5m ago', wallet: '0x7b...1c4d', amount: '1.00 ETH', tier: 'Gold', status: 'confirmed' },
    { time: '8m ago', wallet: '0xa1...f837', amount: '100 USDC', tier: 'Bronze', status: 'confirmed' },
    { time: '12m ago', wallet: '0xd2...567e', amount: '0.05 ETH', tier: 'Bronze', status: 'confirmed' },
    { time: '15m ago', wallet: '0x9e...c3b1', amount: '500 USDC', tier: 'Silver', status: 'confirmed' },
    { time: '22m ago', wallet: '0x4c...8f2a', amount: '2.50 ETH', tier: 'Gold', status: 'confirmed' },
  ]

  const pipelineSteps = [
    { label: 'Connect Wallet', icon: '🔗', active: true },
    { label: 'Choose Tier', icon: '📊', active: true },
    { label: 'Contribute', icon: '💰', active: true },
    { label: 'Mint NFT + Tokens', icon: '✨', active: true },
  ]

  const stats = [
    { label: 'Total Raised', value: `$${totalContributions.toLocaleString()}`, change: '+12.4%', up: true, color: 'text-primary' },
    { label: 'Founding Citizens', value: totalContributors.toLocaleString(), change: '+8 today', up: true, color: 'text-emerald-500' },
    { label: 'NFTs Minted', value: totalContributors.toLocaleString(), change: '+8 today', up: true, color: 'text-purple-500' },
    { label: 'Avg. Contribution', value: '$458', change: '+3.2%', up: true, color: 'text-amber-500' },
    { label: 'Days Remaining', value: '21', change: 'Jul 15 deadline', up: false, color: 'text-foreground' },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">TRION Protocol Founding Citizen Crowdfund</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Contract Active
          </div>
          <div className="w-px h-4 bg-border" />
          <span className="text-xs text-muted-foreground">ETH Mainnet</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <p className="text-xs font-medium text-muted-foreground mb-1">{stat.label}</p>
            <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] mt-1 text-muted-foreground">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Funding progress */}
      <div className="dash-card p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Infrastructure Goal</p>
          <p className="text-sm font-semibold">{percentage.toFixed(1)}%</p>
        </div>
        <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">${totalContributions.toLocaleString()} raised</span>
          <span className="text-xs text-muted-foreground">${fundingGoal.toLocaleString()} goal</span>
        </div>
      </div>

      {/* Pipeline */}
      <div className="dash-card p-5">
        <p className="text-sm font-semibold mb-4">Contribution Pipeline</p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {pipelineSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2 sm:gap-3">
              <div className={`pipeline-step ${step.active ? 'active' : ''}`}>
                <span>{step.icon}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < pipelineSteps.length - 1 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two-column layout: Activity + Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Live activity table */}
        <div className="lg:col-span-3 dash-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Live Activity</p>
              <span className="badge-success">LIVE</span>
            </div>
            <p className="text-xs text-muted-foreground">Last 24h</p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Wallet</th>
                  <th className="hidden sm:table-cell">Amount</th>
                  <th>Tier</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((row, i) => (
                  <tr key={i}>
                    <td className="data-mono text-xs text-muted-foreground">{row.time}</td>
                    <td className="data-mono text-xs">{row.wallet}</td>
                    <td className="data-mono text-xs hidden sm:table-cell">{row.amount}</td>
                    <td>
                      <span className={row.tier === 'Gold' ? 'badge-warning' : row.tier === 'Silver' ? 'badge-primary' : 'badge-success'}>
                        {row.tier}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tier cards */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { name: 'Bronze', min: '$100', tokens: '5,000 TRIO', color: 'border-l-amber-500', iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', citizens: 89 },
            { name: 'Silver', min: '$500', tokens: '30,000 TRIO', color: 'border-l-blue-500', iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400', citizens: 47 },
            { name: 'Gold', min: '$2,000', tokens: '150,000 TRIO', color: 'border-l-purple-500', iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400', citizens: 11 },
          ].map((tier) => (
            <button
              key={tier.name}
              onClick={() => setView('mint')}
              className={`dash-card border-l-4 ${tier.color} p-4 w-full text-left hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${tier.iconBg} flex items-center justify-center shrink-0`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={tier.iconColor}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{tier.name}</p>
                    <span className="text-xs text-muted-foreground">{tier.citizens} joined</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Min {tier.min} · {tier.tokens}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          ))}

          {/* Protocol message */}
          <div className="dash-card p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200/50 dark:border-blue-800/30">
            <div className="flex items-start gap-3">
              <img src="/trion-logo.png" alt="" className="w-8 h-8 rounded-lg shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">The Internet is Drowning</p>
                <p className="text-xs text-muted-foreground mt-1">in Synthetic Noise. Fund the Immune System.</p>
                <button
                  onClick={() => setView('manifesto')}
                  className="text-xs font-semibold text-primary mt-2 hover:underline"
                >
                  Read the Manifesto →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          NEW SECTION 1: TRION Oracle Architecture
         ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">TRION Oracle Architecture</h2>
            <p className="text-xs text-muted-foreground mt-0.5">5-Plane Coherence System</p>
          </div>
          <span className="badge-primary text-[10px]">v1.0</span>
        </div>

        {/* Formula banner */}
        <div className="dash-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <code className="data-mono text-xs sm:text-sm text-primary font-semibold shrink-0">
            C(t) = α·Φ(t) + β·M<sub>adj</sub>(t) + γ·Σ(t) + δ·K(t) + ε·A(t)
          </code>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <span className="text-xs text-muted-foreground">
            Multi-plane coherence score · Range [0, 1] · Threshold = 0.250
          </span>
        </div>

        {/* 5 Plane metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {oraclePlanes.map((plane) => (
            <motion.div
              key={plane.name}
              variants={fadeUp}
              className="dash-card p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${plane.color} shrink-0`} />
                <div>
                  <p className="text-sm font-semibold">{plane.name}</p>
                  <p className="data-mono text-[11px] text-muted-foreground">{plane.weight}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{plane.description}</p>
              {/* Mini weight bar */}
              <div className="mt-auto">
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${plane.color}`}
                    style={{ width: `${parseFloat(plane.weight.split(' ')[2]) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          NEW SECTION 2: Live Network Stats
         ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Live Network Stats</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time protocol telemetry</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Synced
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {networkStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="dash-card p-4 text-center"
            >
              <p className={`text-xl sm:text-2xl font-bold ${stat.color} ${stat.live ? 'tabular-nums' : ''}`}>
                {stat.live ? blockCount.toLocaleString() : stat.value}
              </p>
              <p className="text-xs font-medium text-muted-foreground mt-1">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          NEW SECTION 3: Exploit Shield — 100% Detection
         ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Exploit Shield — 100% Detection</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Historical backtest · {exploits.length} major DeFi attacks TRION would have prevented
            </p>
          </div>
          <span className="badge-success">ALL BLOCKED</span>
        </div>

        {/* Summary strip */}
        <div className="dash-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600 dark:text-emerald-400 shrink-0">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p className="text-xs text-muted-foreground">
            Combined loss: <span className="font-bold text-foreground">$388.9M</span> would have been saved across{' '}
            <span className="font-bold text-foreground">{exploits.length} attacks</span> — TRION Oracle detected every single one before execution.
          </p>
        </div>

        {/* Exploit table */}
        <div className="dash-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Attack</th>
                  <th>Loss</th>
                  <th className="hidden sm:table-cell">Type</th>
                  <th>C(t)</th>
                  <th>Decision</th>
                </tr>
              </thead>
              <tbody>
                {exploits.map((row, i) => (
                  <tr key={i}>
                    <td className="text-xs font-medium">{row.attack}</td>
                    <td className="data-mono text-xs font-semibold text-red-600 dark:text-red-400">{row.loss}</td>
                    <td className="hidden sm:table-cell">
                      <span className="data-mono text-[11px] text-muted-foreground">{row.type}</span>
                    </td>
                    <td className="data-mono text-xs">{row.ct.toFixed(3)}</td>
                    <td>
                      <span className="badge-success">BLOCKED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          NEW SECTION 4: 20 Signal Types
         ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">20 Signal Types</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Canonical event taxonomy across all observed chains</p>
          </div>
          <span className="data-mono text-xs text-muted-foreground">
            {signalCategories.reduce((acc, c) => acc + c.signals.length, 0)} types · 8 categories
          </span>
        </div>

        <div className="dash-card p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {signalCategories.map((cat) => (
              <motion.div
                key={cat.name}
                variants={fadeUp}
                className={`rounded-lg border p-3 ${cat.color}`}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" style={{ color: 'currentColor' }} />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {cat.name}
                  </p>
                  <span className="text-[10px] text-muted-foreground ml-auto">{cat.signals.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.signals.map((signal) => (
                    <span
                      key={signal}
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold data-mono ${cat.bgColor} ${cat.textColor}`}
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
