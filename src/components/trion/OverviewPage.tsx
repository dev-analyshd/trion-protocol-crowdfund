'use client'

import { useTrionStore } from '@/store/trion-store'
import { motion } from 'framer-motion'

export function OverviewPage() {
  const { totalContributions, totalContributors, fundingGoal, setView } = useTrionStore()

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
    </div>
  )
}
