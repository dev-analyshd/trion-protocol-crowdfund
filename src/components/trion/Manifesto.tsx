'use client'

import { motion } from 'framer-motion'

export default function Manifesto() {
  const paragraphs = [
    {
      title: 'The Problem',
      text: `We are living through the collapse of informational trust. Deepfakes, synthetic media, AI-generated propaganda, and algorithmically amplified misinformation have fundamentally eroded the distinction between authentic and fabricated content. Every platform, every feed, every notification stream is now a potential vector for deception at industrial scale.`,
    },
    {
      title: 'Why Existing Systems Fail',
      text: `Current approaches rely on centralized fact-checkers, opaque moderation algorithms, and after-the-fact takedowns. These are bandages on a hemorrhage. By the time content is flagged, it has already shaped beliefs, influenced elections, and moved markets. The latency between creation and verification is the vulnerability that TRION exists to eliminate.`,
    },
    {
      title: 'The TRION Architecture',
      text: `TRION is a decentralized cryptographic provenance protocol. It does not attempt to judge truth — that remains the domain of human cognition and consensus. Instead, TRION provides an immutable, tamper-proof chain of custody for every piece of content that enters the network. Think of it as a digital immune system: it doesn't tell you what is healthy, but it can identify what is foreign, synthetic, or mutated.`,
    },
    {
      title: 'The Founding Citizen Program',
      text: `This crowdfund is not an ICO. It is an invitation to become a founding citizen of a network designed to protect the integrity of human communication. Contributions fund the development of the core protocol, the deployment of verification nodes, and the creation of the developer tooling that will allow any application to integrate TRION's provenance layer.`,
    },
    {
      title: 'Token Utility & Vesting',
      text: `$TRIO is a governance utility token, not a security. It confers voting rights on protocol upgrades, node operator eligibility, and priority access to TRION infrastructure. All tokens allocated through this crowdfund are subject to a 12-month linear vesting schedule — this is by design. We are building long-term infrastructure, not facilitating speculation.`,
    },
    {
      title: 'The Soulbound Passport',
      text: `Every founding citizen receives a TRION Genesis Passport — a soulbound NFT that cannot be transferred. It is proof of early participation, a permanent record of contribution, and a dynamic credential that evolves with the network's health score. Your passport is yours forever, tied to your contribution and your commitment.`,
    },
    {
      title: 'Transparency & Accountability',
      text: `The TRION Crowdfund Vault is a transparent, on-chain smart contract. Every contribution, every token allocation, and every NFT mint is publicly verifiable. The vault includes emergency withdrawal functions only callable by the protocol multi-sig, and all funds flow is visible in real-time on the blockchain explorer.`,
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs text-[#00FF9D] data-mono tracking-widest mb-4">{'>'} TRION::MANIFESTO_v1.0</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wider mb-4">LETTER TO FOUNDING CITIZENS</h1>
          <p className="text-[#888] text-sm max-w-xl mx-auto leading-relaxed">
            A declaration of purpose for the TRION Protocol — why it exists, what it does, and why your contribution matters.
          </p>
        </motion.div>

        <div className="space-y-8">
          {paragraphs.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-[#00FF9D] data-mono">{String(index + 1).padStart(2, '0')}</span>
                <h2 className="text-lg font-bold tracking-wider">{section.title}</h2>
                <div className="flex-grow h-px bg-[rgba(0,255,157,0.1)]" />
              </div>
              <p className="text-sm text-[#aaa] leading-relaxed">{section.text}</p>
            </motion.section>
          ))}
        </div>

        {/* Terminal footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="glass-card p-6 inline-block">
            <p className="text-xs text-[#00FF9D] data-mono">
              {'>'} END_OF_MANIFESTO::THANK_YOU_FOR_READING
            </p>
            <p className="text-xs text-[#666] data-mono mt-2">
              {'>'} STATUS: AWAITING_YOUR_CONTRIBUTION
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
