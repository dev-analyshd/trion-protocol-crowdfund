'use client'

import { motion } from 'framer-motion'
import { useTrionStore } from '@/store/trion-store'
import { Progress } from '@/components/ui/progress'

export function ProgressBar() {
  const { totalContributions, fundingGoal } = useTrionStore()
  const percentage = Math.min((totalContributions / fundingGoal) * 100, 100)

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-[#888] tracking-widest mb-1">INFRASTRUCTURE GOAL</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#00FF9D] data-mono">
            ${totalContributions.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#888] tracking-widest mb-1">TARGET</p>
          <p className="text-lg text-[#888] data-mono">${fundingGoal.toLocaleString()}</p>
        </div>
      </div>
      <div className="relative">
        <Progress
          value={percentage}
          className="h-3 bg-[#111] rounded-full overflow-hidden"
        />
        <div
          className="absolute top-0 left-0 h-full rounded-full progress-glow transition-all duration-1000"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #00995e, #00FF9D, #33ffbb)',
          }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-[#00FF9D] data-mono">{percentage.toFixed(1)}% FUNDED</span>
        <span className="text-xs text-[#666] data-mono">{percentage >= 100 ? 'GOAL REACHED' : `${Math.ceil(fundingGoal - totalContributions).toLocaleString()} REMAINING`}</span>
      </div>
    </div>
  )
}

export function TierCards() {
  const { setView } = useTrionStore()

  const tiers = [
    {
      name: 'BRONZE',
      threshold: '$100',
      color: '#CD7F32',
      borderColor: 'rgba(205,127,50,0.3)',
      tokens: '5,000 TRIO',
      nft: 'Bronze Passport',
      benefits: ['Voting rights in governance', 'Community Discord access', 'Early protocol alpha access'],
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="#CD7F32" strokeWidth="1.5" />
          <path d="M10 20V12l6-4 6 4v8l-6 4-6-4z" stroke="#CD7F32" strokeWidth="1.5" fill="none" />
        </svg>
      ),
    },
    {
      name: 'SILVER',
      threshold: '$500',
      color: '#C0C0C0',
      borderColor: 'rgba(192,192,192,0.3)',
      tokens: '30,000 TRIO',
      nft: 'Silver Passport',
      benefits: ['All Bronze benefits', 'Priority node deployment', 'Quarterly treasury reports', 'Governance proposal rights'],
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="#C0C0C0" strokeWidth="1.5" />
          <path d="M10 20V12l6-4 6 4v8l-6 4-6-4z" stroke="#C0C0C0" strokeWidth="1.5" fill="rgba(192,192,192,0.1)" />
          <circle cx="16" cy="16" r="5" stroke="#C0C0C0" strokeWidth="1" />
        </svg>
      ),
    },
    {
      name: 'GOLD',
      threshold: '$2,000',
      color: '#FFD700',
      borderColor: 'rgba(255,215,0,0.3)',
      tokens: '150,000 TRIO',
      nft: 'Gold Passport',
      benefits: ['All Silver benefits', 'Genesis node operator rights', 'Direct protocol team access', 'Revenue share eligibility', 'Whitepaper co-author credit'],
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="#FFD700" strokeWidth="1.5" />
          <path d="M10 20V12l6-4 6 4v8l-6 4-6-4z" stroke="#FFD700" strokeWidth="1.5" fill="rgba(255,215,0,0.15)" />
          <circle cx="16" cy="16" r="5" stroke="#FFD700" strokeWidth="1" />
          <path d="M16 11v10M11 16h10" stroke="#FFD700" strokeWidth="1" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {tiers.map((tier, index) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          className="glass-card glass-card-hover transition-all duration-300 cursor-pointer p-6 flex flex-col"
          style={{ borderColor: tier.borderColor }}
          onClick={() => setView('mint')}
        >
          <div className="flex items-center gap-3 mb-4">
            {tier.icon}
            <div>
              <h3 className="text-lg font-bold tracking-wider" style={{ color: tier.color }}>{tier.name}</h3>
              <p className="text-xs text-[#888] data-mono">MIN. {tier.threshold}</p>
            </div>
          </div>

          <div className="w-full h-px mb-4" style={{ background: tier.borderColor }} />

          <div className="space-y-3 flex-grow">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#888]">TOKENS</span>
              <span className="text-sm font-bold text-[#00FF9D] data-mono">{tier.tokens}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#888]">NFT</span>
              <span className="text-sm text-[#f0f0f0]">{tier.nft}</span>
            </div>
          </div>

          <div className="w-full h-px my-4" style={{ background: tier.borderColor }} />

          <ul className="space-y-2 mb-6">
            {tier.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#aaa]">
                <span className="text-[#00FF9D] mt-0.5 shrink-0">&#x25B8;</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <button
            className="w-full py-3 rounded-lg text-xs font-bold tracking-widest transition-all duration-200 border"
            style={{
              borderColor: tier.borderColor,
              color: tier.color,
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tier.borderColor
              e.currentTarget.style.color = '#050505'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = tier.color
            }}
          >
            JOIN AS {tier.name}
          </button>
        </motion.div>
      ))}
    </div>
  )
}

export function HeroSection() {
  const { setView } = useTrionStore()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 scanline grid-bg">
      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,157,0.3) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-4xl"
      >
        {/* Terminal prefix */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xs text-[#00FF9D] data-mono tracking-widest mb-6"
        >
          {'>'} TRION_PROTOCOL::INIT_SEQUENCE
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          <span className="text-gradient-green">The Internet is Drowning</span>
          <br />
          <span className="text-[#f0f0f0]">in Synthetic Noise.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-lg sm:text-xl text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Fund the Immune System. Become a Founding Citizen of the TRION Protocol and help build the cryptographic infrastructure that separates truth from fabrication.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => setView('mint')}
            className="px-8 py-4 bg-[#00FF9D] text-[#050505] font-bold text-sm tracking-widest rounded-lg glow-green-sm hover:bg-[#00cc7d] transition-all duration-200"
          >
            BECOME A CITIZEN
          </button>
          <button
            onClick={() => setView('manifesto')}
            className="px-8 py-4 border border-[rgba(0,255,157,0.3)] text-[#00FF9D] font-bold text-sm tracking-widest rounded-lg hover:bg-[rgba(0,255,157,0.1)] transition-all duration-200"
          >
            READ THE MANIFESTO
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#666] tracking-widest">SCROLL</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#666]">
            <path d="M6 2v8M2 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}
