'use client'

import { motion } from 'framer-motion'

const sections = [
  { title: 'The Problem', text: 'We are living through the collapse of informational trust. Deepfakes, synthetic media, AI-generated propaganda, and algorithmically amplified misinformation have fundamentally eroded the distinction between authentic and fabricated content. Every platform, every feed, every notification stream is now a potential vector for deception at industrial scale.' },
  { title: 'Why Existing Systems Fail', text: 'Current approaches rely on centralized fact-checkers, opaque moderation algorithms, and after-the-fact takedowns. These are bandages on a hemorrhage. By the time content is flagged, it has already shaped beliefs, influenced elections, and moved markets. The latency between creation and verification is the vulnerability that TRION exists to eliminate.' },
  { title: 'The TRION Architecture', text: 'TRION is a decentralized cryptographic provenance protocol. It does not attempt to judge truth — that remains the domain of human cognition and consensus. Instead, TRION provides an immutable, tamper-proof chain of custody for every piece of content that enters the network. Think of it as a digital immune system: it doesn\'t tell you what is healthy, but it can identify what is foreign, synthetic, or mutated.' },
  { title: 'The Founding Citizen Program', text: 'This crowdfund is not an ICO. It is an invitation to become a founding citizen of a network designed to protect the integrity of human communication. Contributions fund the development of the core protocol, the deployment of verification nodes, and the creation of the developer tooling that will allow any application to integrate TRION\'s provenance layer.' },
  { title: 'Token Utility & Vesting', text: '$TRIO is a governance utility token, not a security. It confers voting rights on protocol upgrades, node operator eligibility, and priority access to TRION infrastructure. All tokens allocated through this crowdfund are subject to a 12-month linear vesting schedule — this is by design. We are building long-term infrastructure, not facilitating speculation.' },
  { title: 'The Soulbound Passport', text: 'Every founding citizen receives a TRION Genesis Passport — a soulbound NFT that cannot be transferred. It is proof of early participation, a permanent record of contribution, and a dynamic credential that evolves with the network\'s health score. Your passport is yours forever, tied to your contribution and your commitment.' },
  { title: 'Transparency & Accountability', text: 'The TRION Crowdfund Vault is a transparent, on-chain smart contract. Every contribution, every token allocation, and every NFT mint is publicly verifiable. The vault includes emergency withdrawal functions only callable by the protocol multi-sig, and all funds flow is visible in real-time on the blockchain explorer.' },
]

export function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manifesto</h1>
        <p className="text-sm text-muted-foreground">Letter to Founding Citizens — TRION Protocol v1.0</p>
      </div>

      <div className="max-w-3xl space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="dash-card p-5 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold text-primary data-mono">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="text-base font-bold">{section.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
