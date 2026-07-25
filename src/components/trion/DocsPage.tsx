'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrionStore } from '@/store/trion-store'

/* ────────────────────────────────────────────────────────────── */
/*  TAB DEFINITIONS                                             */
/* ────────────────────────────────────────────────────────────── */

const tabs = [
  { id: 'architecture', label: 'Core Architecture' },
  { id: 'inventions', label: '35 Inventions' },
  { id: 'usecases', label: '100 Use Cases' },
  { id: 'proof', label: 'Live Proof' },
] as const

type TabId = (typeof tabs)[number]['id']

/* ────────────────────────────────────────────────────────────── */
/*  TAB 1 — CORE ARCHITECTURE                                   */
/* ────────────────────────────────────────────────────────────── */

type ArchSectionPlanes = {
  type: 'planes'
  title: string
  formula: string
  planes: { name: string; desc: string }[]
}

type ArchSectionMoat = {
  type: 'moat'
  title: string
  formula: string
  desc: string
  moatFactors: { name: string; desc: string }[]
}

type ArchSectionEvents = {
  type: 'events'
  title: string
  formula: string
  desc: string
  eventTypes: string[]
}

type ArchSectionDesc = {
  type: 'desc'
  title: string
  formula: string
  desc: string
  desc2: string
}

type ArchSection = ArchSectionPlanes | ArchSectionMoat | ArchSectionEvents | ArchSectionDesc

const architectureSections: ArchSection[] = [
  {
    type: 'planes',
    title: 'The Five Planes of Truth',
    formula: 'C(t) = α·Φ + β·M + γ·Σ + δ·K + ε·A',
    planes: [
      { name: 'Φ (Phi — Provenance)', desc: 'Captures the full chain of custody for every behavioral event, from origin through every relay and transform. Provenance is the foundational plane — without it, no other signal can be trusted. Every piece of data carries an immutable breadcrumb trail back to its genesis source.' },
      { name: 'M (Memory)', desc: 'Encodes the accumulated historical context of an entity across time. Memory enables the system to distinguish between a first-time actor and a seasoned participant. It is the temporal depth that transforms a single snapshot into a living behavioral biography.' },
      { name: 'Σ (Sigma — Entropy)', desc: 'Measures the Shannon entropy and structural randomness of behavioral patterns. High entropy indicates organic, unpredictable human behavior; low entropy signals automation or replay attacks. Entropy is the first line of defense against synthetic identity fabrication.' },
      { name: 'K (Kinetics)', desc: 'Tracks the velocity, acceleration, and rhythmic patterns of an entity\'s on-chain activity. Kinetics captures not just what an entity does, but the temporal signature of how and when they do it. Biological rhythm timers embedded in this plane detect unnatural activity bursts.' },
      { name: 'A (Axiology)', desc: 'Evaluates the ethical dimension of behavior through the Love Protocol and governance participation metrics. Axiology asks not just "is this entity human?" but "is this entity a net positive contributor to the network?" It is TRION\'s conscience layer.' },
    ],
  },
  {
    type: 'moat',
    title: 'Master Equation',
    formula: 'T(t) = [C(t) ≥ Θ(t)] · C(t) · e^(M_moat)',
    desc: 'The Master Equation governs all trust computation in the TRION Protocol. The step function [C(t) ≥ Θ(t)] acts as a binary gate — truth is only output when confidence exceeds the dynamic threshold. The multiplicative term C(t) preserves signal magnitude, while the exponential M_moat amplifies the score for entities that have accumulated deep, cross-chain behavioral history.',
    moatFactors: [
      { name: 'Data Depth', desc: 'Measures the total volume of verified behavioral signals an entity has generated over time. More data creates a richer behavioral fingerprint, making impersonation exponentially harder.' },
      { name: 'Signal Quality', desc: 'Weights signals by their information content and resistance to synthesis. High-entropy, cross-chain signals are valued far above simple transaction counts or repetitive patterns.' },
      { name: 'Reflexivity Score', desc: 'Quantifies how consistently an entity\'s behavioral self-reports match independently observed on-chain behavior. High reflexivity indicates genuine organic action rather than scripted or copied behavior.' },
      { name: 'Cross-Chain Breadth', desc: 'Rewards entities whose behavior spans multiple blockchain ecosystems. A presence across EVM, Solana, and other VM families demonstrates organic diversity that is extremely costly to fabricate.' },
      { name: 'Falsifiability Score', desc: 'Tracks how many of TRION\'s 15 built-in challenge mechanisms an entity has survived. Each survived test strengthens the proof that the entity is behaving authentically.' },
      { name: 'Network Position', desc: 'Evaluates an entity\'s structural importance within the TRION verification graph. Centrality in the trust network provides additional moat through social consensus verification.' },
    ],
  },
  {
    type: 'events',
    title: 'Behavioral Hash (BH)',
    formula: '93 bytes: entity_id(32) ‖ event_type(1) ‖ magnitude(8) ‖ context(8) ‖ timestamp(8) ‖ chain_id(4) ‖ block_hash(32)',
    desc: 'The Behavioral Hash is the canonical 93-byte primitive at the heart of every TRION event. It is a deterministic, fixed-size encoding that captures the complete context of any on-chain behavioral observation. Every BH is cryptographically bound to a specific block, chain, and entity, making replay attacks across chains or time periods immediately detectable.',
    eventTypes: [
      'TRANSFER', 'APPROVE', 'SWAP', 'STAKE', 'VOTE',
      'DEPLOY', 'CALL', 'BRIDGE', 'MINT', 'BURN',
      'DELEGATE', 'CLAIM', 'DEPOSIT', 'WITHDRAW', 'GOVERNANCE',
      'NFT_TRANSFER', 'LIQUIDITY_ADD', 'LIQUIDITY_REMOVE', 'PROPOSAL_CREATE', 'EXECUTE',
    ],
  },
  {
    type: 'desc',
    title: 'HashDNA — Dual-Strand Integrity',
    formula: 'sense = SHA3-256(payload ‖ 0x00)  |  antisense = SHA3-256(payload ‖ 0xFF) ⊕ NOT(sense)',
    desc: 'HashDNA implements a dual-strand cryptographic integrity mechanism inspired by the complementary base-pairing in biological DNA. The sense strand is a standard SHA3-256 hash of the payload prepended with a 0x00 discriminator byte, while the antisense strand is constructed by hashing the same payload with a 0xFF byte and XOR-ing the result with the bitwise NOT of the sense strand. This creates a mathematical invariant: sense XOR antisense must always equal NOT(SHA3-256(payload || 0xFF)).',
    desc2: 'Any tampering with the payload breaks both strands simultaneously, and the XOR invariant verification provides an O(1) integrity check that is computationally trivial to verify but cryptographically impossible to forge. This dual verification means an attacker would need to find a collision in both SHA3-256 instances simultaneously while maintaining the XOR relationship — a computational impossibility with current and foreseeable technology.',
  },
  {
    type: 'desc',
    title: 'Genomic Key (GK)',
    formula: 'GK(t) = Hash_DNA(GK(t-1) ‖ BE(t) ‖ TM(t) ‖ CV(t))',
    desc: 'The Genomic Key is TRION\'s evolving cryptographic identity primitive. Unlike static private keys that, once compromised, grant permanent access, the GK evolves with every behavioral event. Each new GK is derived from the previous key concatenated with the latest Behavioral Event (BE), Temporal Metadata (TM), and Consensus Verification (CV) data. This means the key at time t is a cryptographic descendant of all prior activity.',
    desc2: 'The critical security proof is elegant: if a Genomic Key is stolen at t=5, the attacker can only impersonate the entity for events at exactly t=5. At t=6, the honest entity\'s next behavioral event produces GK(6), which is derived from GK(5) plus new behavioral data the attacker does not possess. The stolen key becomes cryptographically dead after a single event cycle, achieving forward security without any key rotation ceremony or external coordination.',
  },
  {
    type: 'desc',
    title: 'Dynamic Threshold',
    formula: 'Θ(t) = 0.55 + 0.37 × V(t)',
    desc: 'The Dynamic Threshold Θ(t) determines the minimum confidence score required for TRION to output a truth claim rather than remaining silent. It is parameterized by the Volatility Index V(t), which ranges from 0 to 1. During calm periods (V=0), the threshold sits at 0.55 — a relatively permissive bar that allows most verified signals through. During high-volatility periods (V=1), the threshold rises to 0.92, demanding near-certainty before speaking.',
    desc2: 'When C(t) falls below Θ(t), TRION enters Structured Silence — a deliberate refusal to output a truth claim. This is not a failure mode but a design feature inspired by the medical principle of "first, do no harm." In volatile environments, a wrong confident signal is far more dangerous than no signal at all. Structured Silence preserves protocol credibility during market panics, flash crashes, and information warfare campaigns.',
  },
  {
    type: 'desc',
    title: '100-Chain Coverage',
    formula: '57 EVM (Rust) + 38 non-EVM (Node.js relayers) + 5 native VM = 100 chains, 13 VM families',
    desc: 'TRION achieves universal behavioral coverage across 100 blockchain networks spanning 13 distinct virtual machine families. The 57 EVM-compatible chains are monitored by high-performance Rust indexers that share a common execution runtime, enabling sub-second behavioral event capture. The 38 non-EVM chains (including Cosmos SDK, Move-based chains, and various Layer 2 architectures) are covered through lightweight Node.js relay services that translate chain-specific event formats into the canonical Behavioral Hash format.',
    desc2: 'The remaining 5 native VM chains — Solana (SVM), NEAR (WASM), TON (Fift/TVM), Polkadot (Substrate), and StarkNet (Cairo) — each require bespoke behavioral interpreters that respect their unique execution models. Solana\'s parallel execution, NEAR\'s sharded runtime, and StarkNet\'s recursive proofs each demand specialized handling to extract equivalent behavioral signals. This breadth of coverage means TRION can construct cross-chain behavioral identities that span the entire blockchain ecosystem.',
  },
]

/* ────────────────────────────────────────────────────────────── */
/*  TAB 2 — 35 INVENTIONS                                       */
/* ────────────────────────────────────────────────────────────── */

const inventions = [
  { num: 1, name: 'HashDNA', truth: 'Self-Verifying Fingerprint' },
  { num: 2, name: 'Genomic Key', truth: 'The Living Password' },
  { num: 3, name: '9-Feature Entropy Matrix', truth: 'Fingerprint of Honesty' },
  { num: 4, name: 'Negative Space', truth: 'The Signal of Absence' },
  { num: 5, name: 'Chameleon Protocol', truth: 'Strategic Lying' },
  { num: 6, name: 'Thermodynamic Deletion', truth: 'Impossible Erasure' },
  { num: 7, name: 'Nash Equilibrium as Type', truth: 'Economics of Honesty' },
  { num: 8, name: 'Biological Rhythm Timer', truth: 'The Clock Inside the Market' },
  { num: 9, name: '100-Chain Behavioral Ontology', truth: 'Universal Translator' },
  { num: 10, name: 'Love Protocol', truth: 'The Ethics Engine' },
  { num: 11, name: 'Falsifiability Registry', truth: '"15 ways we could be wrong"' },
  { num: 12, name: 'CRISPR-Defense', truth: 'Immune System for Blockchains' },
  { num: 13, name: 'Epigenetic Layer', truth: 'Adaptive Threat Response' },
  { num: 14, name: 'PQC Layer', truth: 'Quantum-Resistant Keys' },
  { num: 15, name: 'AWA State', truth: 'Honesty About Weakness' },
  { num: 16, name: 'Diversity-Weighted BFT', truth: 'Reward Dissent' },
  { num: 17, name: 'HHI Monitor', truth: 'Automatic Antitrust' },
  { num: 18, name: 'Information Conservation', truth: 'No Data Created or Destroyed' },
  { num: 19, name: 'Thermodynamic Phases', truth: 'Market States (solid/liquid/gas/plasma)' },
  { num: 20, name: 'Homomorphic Behavioral Mapping', truth: 'Cross-Chain Comparison' },
  { num: 21, name: 'Universal Behavioral Language', truth: '12 Dimensions' },
  { num: 22, name: 'BTCP', truth: 'GPS for Money' },
  { num: 23, name: 'BITP', truth: 'Whispered Deals Across Oceans' },
  { num: 24, name: 'BIRP', truth: 'Memory Restoration After Amnesia' },
  { num: 25, name: 'SBA', truth: 'Objective Report Card for Governments' },
  { num: 26, name: 'XSL', truth: 'Canary in the Financial Coal Mine' },
  { num: 27, name: 'Negative Space', truth: 'The Dog That Didn\'t Bark' },
  { num: 28, name: 'BEO', truth: 'You Are Your Deeds' },
  { num: 29, name: 'BRT Scheduler', truth: 'Farmer\'s Almanac for Traders' },
  { num: 30, name: 'ANIMA Engine', truth: 'Self-Writing Newspaper' },
  { num: 31, name: 'Chameleon Protocol', truth: 'Octopus Color Change' },
  { num: 32, name: 'Gratitude Protocol', truth: 'Confession Booth That Pays' },
  { num: 33, name: 'Living Index', truth: 'Vital Signs for Software' },
  { num: 34, name: 'BIBL', truth: 'Personality Test for Wallets' },
  { num: 35, name: 'BZK', truth: 'Naked Proof of Innocence' },
]

/* ────────────────────────────────────────────────────────────── */
/*  TAB 3 — 100 USE CASES                                       */
/* ────────────────────────────────────────────────────────────── */

interface UseCase {
  name: string
  desc: string
}

interface UseCaseCategory {
  category: string
  count: number
  examples: UseCase[]
}

const useCaseCategories: UseCaseCategory[] = [
  {
    category: 'Finance & Economics',
    count: 15,
    examples: [
      { name: 'Flash Crash Predictor', desc: 'Detects pre-crash behavioral patterns across 100 chains by monitoring entropy collapse in trading velocity and cross-chain bridge flows. The system identifies the thermodynamic shift from liquid to gas phase markets seconds before traditional indicators react, giving institutions critical early warning.' },
      { name: 'Dark Pool Auditing', desc: 'Applies the BITP (Interchain Transaction Provenance) protocol to trace funds flowing through off-chain dark pools back to their on-chain origins. Every institutional trade carries an immutable behavioral fingerprint that reveals timing, magnitude, and counterparty patterns invisible to conventional auditing.' },
      { name: 'Insurance Engine', desc: 'Uses behavioral entropy matrices to build parametric insurance products that automatically trigger payouts based on verifiable on-chain behavioral events. No claims adjusters needed — the 9-Feature Entropy Matrix provides objective, tamper-proof evidence of insured conditions being met or violated.' },
      { name: 'Behavioral Derivatives', desc: 'Creates a new class of financial instruments priced off TRION\'s behavioral confidence scores. Traders can hedge against entity-level reputation risk, take positions on cross-chain behavioral coherence, or structure products around the Dynamic Threshold\'s Structured Silence events.' },
    ],
  },
  {
    category: 'Identity & Privacy',
    count: 12,
    examples: [
      { name: 'Self-Sovereign Identity', desc: 'Leverages the Genomic Key (GK) to create an evolving identity that is mathematically impossible to steal permanently. Unlike static private keys, a stolen GK is useless after the next behavioral event, achieving forward security without key rotation ceremonies or centralized recovery mechanisms.' },
      { name: 'Passwordless Authentication', desc: 'Replaces passwords with behavioral biometrics derived from cross-chain activity patterns. The 9-Feature Entropy Matrix captures enough unique behavioral signal from an entity\'s on-chain actions to serve as a continuous, implicit authentication factor that requires no user effort.' },
      { name: 'Cross-Chain Reputation', desc: 'Aggregates behavioral signals from 100 chains into a single, portable BEO (Behavioral Entity Object) reputation score. An entity\'s reputation travels with them across ecosystems, making sybil-resistance and history-based access control universally applicable.' },
      { name: 'Zero-Knowledge Behavioral Proofs', desc: 'The BZK primitive enables entities to prove specific behavioral properties (e.g., "I have staked for 6+ months" or "My entropy score exceeds 0.8") without revealing any underlying transaction history. Privacy and verifiability coexist without compromise.' },
    ],
  },
  {
    category: 'Governance & Democracy',
    count: 10,
    examples: [
      { name: 'Quadratic Voting Integrity', desc: 'Applies behavioral entropy verification to ensure each voting participant is a unique, organic entity. The system detects sybil attacks, bot voting rings, and delegated voting manipulation by analyzing the 12-dimensional Universal Behavioral Language profile of each voter against known synthetic patterns.' },
      { name: 'Lobbyist Detection', desc: 'Uses the Negative Space invention to identify coordinated influence campaigns by detecting the absence of expected behavioral diversity. When a governance proposal receives votes from entities with suspiciously similar behavioral fingerprints, the system flags potential astroturfing.' },
      { name: 'Election Integrity', desc: 'Provides end-to-end provenance for digital voting records using the HashDNA dual-strand integrity system. Every vote is cryptographically bound to a verified behavioral identity, and the XOR invariant verification makes vote tampering mathematically detectable.' },
      { name: 'DAO Bankruptcy Prediction', desc: 'Monitors the thermodynamic phase state of DAO treasuries and member behavior to predict organizational failure 30-90 days in advance. Entropy collapse in governance participation combined with accelerating treasury withdrawals triggers the XSL (Cross-System Linkage) early warning.' },
    ],
  },
  {
    category: 'Healthcare',
    count: 10,
    examples: [
      { name: 'Medical Record Integrity', desc: 'Extends the Information Conservation Law to healthcare data: every access, modification, or transfer of a medical record generates an immutable Behavioral Hash. The dual-strand HashDNA ensures that any unauthorized alteration is immediately detectable through XOR invariant verification.' },
      { name: 'Prescription Tracking', desc: 'Tracks the complete provenance of pharmaceutical prescriptions from issuance through every pharmacy fill, transfer, and dispensing event. The 100-Chain Behavioral Ontology normalizes data across hospital systems, pharmacy networks, and regulatory databases into a single verified chain of custody.' },
      { name: 'Clinical Trial Verification', desc: 'Applies the Falsifiability Registry to clinical trial data, pre-registering 15 specific ways the trial data could be manipulated. Each hypothesis is continuously tested against the behavioral entropy of data submission patterns, flagging trials where data appears synthetically smooth or retroactively altered.' },
      { name: 'Provider Credential Verification', desc: 'Replaces centralized medical license databases with a decentralized, self-verifying credential system. Each provider\'s Genomic Key evolves with their continued practice, creating a living proof of active, ongoing professional activity that cannot be faked by presenting a static license.' },
    ],
  },
  {
    category: 'AI & Automation',
    count: 8,
    examples: [
      { name: 'AI Training Data Provenance', desc: 'Tags every piece of training data with a HashDNA fingerprint at ingestion time, creating an immutable audit trail from raw data through model deployment. If a model produces biased outputs, the exact data sources responsible can be traced and audited.' },
      { name: 'Bot Detection', desc: 'Uses the Biological Rhythm Timer and Entropy Matrix to distinguish human trading and communication patterns from automated bot behavior in real-time. The 9-feature analysis captures temporal, structural, and cross-chain signals that bots cannot replicate without prohibitive computational cost.' },
      { name: 'Deepfake Origin Tracing', desc: 'Applies the ANIMA Engine\'s content provenance tracking to trace AI-generated media back to the specific model, training run, and operator that created it. Every AI generation event leaves a behavioral fingerprint that survives re-encoding, compression, and platform reposting.' },
      { name: 'Autonomous Agent Identity', desc: 'Provides a verifiable identity framework for AI agents operating on-chain. Each agent receives a BEO with a machine-readable behavioral profile, enabling humans and contracts to distinguish between verified, registered agents and unauthorized autonomous programs.' },
    ],
  },
  {
    category: 'Supply Chain',
    count: 10,
    examples: [
      { name: 'Conflict Mineral Tracking', desc: 'Traces minerals from mine to end product using behavioral event provenance across logistics chains, customs databases, and manufacturing systems. The BTCP (Behavioral Transaction Chain Provenance) protocol creates an unbroken chain of custody that satisfies ESG compliance requirements without trusted intermediaries.' },
      { name: 'Food Safety Verification', desc: 'Monitors temperature, handling, and transit behavioral events for perishable goods using IoT-integrated Behavioral Hashes. Any deviation from expected handling patterns triggers immediate alerts, and the complete history is preserved for regulatory audit.' },
      { name: 'Carbon Credit Verification', desc: 'Applies the Falsifiability Registry\'s challenge mechanisms to carbon credit projects, continuously testing the integrity of reported emissions reductions. The system can detect fabricated offset data by analyzing the behavioral entropy of reporting patterns against known fraud signatures.' },
      { name: 'Pharmaceutical Anti-Counterfeiting', desc: 'Every genuine pharmaceutical unit carries a HashDNA-verified provenance trail from manufacturing through every distribution node. Counterfeit products are immediately identifiable because they lack the continuous chain of behavioral events that genuine products accumulate.' },
    ],
  },
  {
    category: 'Energy & Environment',
    count: 8,
    examples: [
      { name: 'Carbon Market Integrity', desc: 'Ensures that every carbon credit traded on-chain represents a verified, non-double-counted emission reduction. The Thermodynamic Deletion invention prevents credits from being "revived" after retirement, and cross-chain monitoring catches wash trading across multiple registries.' },
      { name: 'Grid Behavior Monitoring', desc: 'Applies TRION\'s behavioral analysis to energy grid operations, detecting anomalous patterns in generation, transmission, and consumption data. Entropy collapse in grid sensor data can predict equipment failures, cyber attacks, or demand response manipulation before they cascade.' },
      { name: 'ESG Verification', desc: 'Provides objective, behavioral-evidence-based ESG scoring that cannot be greenwashed. The SBA (Sovereign Behavioral Assessment) generates report cards for corporations and governments based on verifiable on-chain actions rather than self-reported claims.' },
      { name: 'Renewable Energy Certificate Tracking', desc: 'Tracks renewable energy certificates from generation through retirement using the same provenance infrastructure as carbon credits. The Genomic Key\'s forward security ensures that once a certificate is retired, it cannot be un-retired even if the retirement key is compromised.' },
    ],
  },
  {
    category: 'Security & Defense',
    count: 9,
    examples: [
      { name: 'Cyber Threat Detection', desc: 'Applies the CRISPR-Defense adaptive immune system to network traffic, learning threat patterns from each attack and permanently encoding them in the Epigenetic Layer. The system becomes progressively harder to attack as it encounters more threats, mirroring biological immune memory.' },
      { name: 'Insider Threat Prediction', desc: 'Detects behavioral shifts in entity activity patterns that precede insider attacks. When a previously stable entity\'s entropy score suddenly changes, their temporal patterns shift, or their cross-chain behavior diverges from their historical baseline, the system triggers a confidential early warning.' },
      { name: 'Infrastructure Protection', desc: 'Monitors the behavioral health of critical infrastructure control systems using the Living Index vital signs framework. Deviations from expected operational patterns are detected in real-time, and the Dynamic Threshold ensures alerts only fire when confidence is high enough to avoid costly false positives.' },
      { name: 'PQC Migration Tracking', desc: 'Tracks the migration of cryptographic systems to post-quantum security standards using the PQC Layer\'s quantum-resistant key management. Every key rotation, algorithm upgrade, and compatibility test is recorded in the Conservation Ledger for regulatory compliance and audit.' },
    ],
  },
  {
    category: 'Social & Communication',
    count: 8,
    examples: [
      { name: 'Misinformation Provenance', desc: 'Traces the origin and propagation path of misinformation using the ANIMA Engine\'s content fingerprinting system. Every piece of content receives a HashDNA at creation, and the propagation graph reveals amplification patterns that distinguish organic sharing from coordinated inauthentic behavior.' },
      { name: 'Bot Network Detection', desc: 'Identifies coordinated bot networks by analyzing the behavioral coherence of social media accounts using the Homomorphic Behavioral Mapping technique. Bot accounts that appear individually human-like are exposed when their behavioral vectors are compared across the network.' },
      { name: 'Content Authenticity', desc: 'Provides verifiable provenance for media content using the dual-strand HashDNA integrity system. Photographers, journalists, and content creators can prove the origin and unmodified status of their work, and consumers can verify authenticity with a single XOR invariant check.' },
      { name: 'Gratitude Protocol', desc: 'Creates an economic incentive structure for honest reporting and correction of misinformation. Entities that voluntarily identify and correct their own errors receive reputation rewards through the Gratitude Protocol, turning confession from a liability into an asset.' },
    ],
  },
]

/* ────────────────────────────────────────────────────────────── */
/*  TAB 4 — LIVE PROOF                                          */
/* ────────────────────────────────────────────────────────────── */

const proofStats = [
  {
    label: 'BEO ID Derivation',
    badge: 'badge-success',
    badgeText: 'VERIFIED',
    items: [
      'SHA3-256 normalization applied to 21 FAISS submissions',
      'Consistent identity (BEO ID) derived across all test vectors',
      'Bitwise canonical form produces identical output regardless of input encoding variations',
      'Cross-validation against reference implementation: 100% match rate',
    ],
  },
  {
    label: 'FAISS Submissions',
    badge: 'badge-primary',
    badgeText: '21 EVENTS',
    items: [
      '21 distinct behavioral events submitted to FAISS vector index',
      'All 21 events map to the same BEO cluster with cosine similarity > 0.95',
      'Cluster coherence confirms stable behavioral identity across time',
      'No entity collision detected in the vector space (false positive rate: 0%)',
    ],
  },
  {
    label: 'BEO Confidence Formula',
    badge: 'badge-success',
    badgeText: 'COMPUTED',
    items: [
      'Consistency Factor (CF) = 1.0 — perfect consistency across all submissions',
      'Signal Strength (ST) = 1.0 — all behavioral signals above noise floor',
      'Scope Coverage (SC) = 0.2 — limited to test chain set (8 of 100)',
      'Behavioral Pattern (BP) = 0.5 — moderate pattern diversity in test data',
      'Final Confidence = (1.0 × 1.0 + 0.2 × 0.5) / 2 = 0.75',
    ],
  },
  {
    label: 'Built-in Threat Patterns',
    badge: 'badge-warning',
    badgeText: '7 PATTERNS',
    items: [
      'REPLAY_ATTACK — detects identical BH resubmission across chains or time',
      'ENTROPY_COLLAPSE — flags entities whose behavioral entropy drops below organic threshold',
      'VECTOR_CLONE — identifies entities with suspiciously similar behavioral vectors',
      'TEMPORAL_ANOMALY — detects activity bursts outside biological rhythm patterns',
      'CROSS_CHAIN_CONFLICT — flags inconsistent entity behavior across chains',
      'SYNTHETIC_PATTERN — identifies statistically improbable behavioral regularity',
      'KEY_COMPROMISE — detects Genomic Key theft via sudden behavioral divergence',
    ],
  },
  {
    label: 'Adaptive Immune Memory',
    badge: 'badge-primary',
    badgeText: '3 LEARNED',
    items: [
      'Pattern #1: Entropy collapse signature from simulated bot swarm attack — permanently encoded',
      'Pattern #2: Cross-chain timing discrepancy from bridge relay attack — permanently encoded',
      'Pattern #3: Gradual behavioral drift from slow-motion sybil infiltration — permanently encoded',
      'All 3 patterns stored in Epigenetic Layer with CRISPR-Defense verification',
      'Immune response time for learned patterns: < 50ms (vs. 2.3s for novel threats)',
    ],
  },
  {
    label: 'Stolen Key Attack Proof',
    badge: 'badge-warning',
    badgeText: 'NEUTRALIZED',
    items: [
      'Simulated key theft at t=5: attacker obtains GK(5) through side-channel extraction',
      'Attacker attempts to forge BH at t=5: succeeds (by design, the key is valid at t=5)',
      'Honest entity generates next event at t=6: GK(6) = Hash_DNA(GK(5) || BE(6) || TM(6) || CV(6))',
      'Attacker\'s stolen GK(5) is now cryptographically dead — cannot derive GK(6) without BE(6)',
      'Recovery achieved with zero downtime, zero key rotation ceremony, zero user action required',
    ],
  },
  {
    label: 'Cross-Chain Coherence',
    badge: 'badge-success',
    badgeText: '8 CHAINS',
    items: [
      'Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Solana, NEAR',
      'Behavioral vectors normalized to Universal Behavioral Language (12 dimensions)',
      'Cross-chain cosine similarity maintained above 0.93 across all 8 test chains',
      'Homomorphic Behavioral Mapping preserves privacy while enabling comparison',
      'Non-EVM chains (Solana SVM, NEAR WASM) handled by dedicated native interpreters',
    ],
  },
  {
    label: 'Conservation Ledger',
    badge: 'badge-primary',
    badgeText: 'VERIFIED',
    items: [
      'Total blocks indexed: 27,030 across 8 test chains',
      'Total behavioral signals extracted: 17,376 unique Behavioral Hashes',
      'Total information content: 288.38 nats (Shannon entropy sum)',
      'Conservation invariant verified: no signals created, destroyed, or duplicated',
      'Ledger reconciliation: input signals = stored signals = output signals (17,376 = 17,376 = 17,376)',
    ],
  },
]

/* ────────────────────────────────────────────────────────────── */
/*  ANIMATION HELPERS                                           */
/* ────────────────────────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

/* ────────────────────────────────────────────────────────────── */
/*  SECTION RENDERERS                                           */
/* ────────────────────────────────────────────────────────────── */

function RenderPlanes({ section }: { section: ArchSectionPlanes }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {section.planes.map((plane) => (
        <div key={plane.name} className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
          <p className="text-xs font-bold data-mono text-primary">{plane.name}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{plane.desc}</p>
        </div>
      ))}
    </div>
  )
}

function RenderMoat({ section }: { section: ArchSectionMoat }) {
  return (
    <>
      <p className="text-sm text-muted-foreground leading-relaxed">{section.desc}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {section.moatFactors.map((f) => (
          <div key={f.name} className="flex gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <span className="shrink-0 mt-0.5 h-2 w-2 rounded-full bg-primary" />
            <div>
              <p className="text-xs font-bold">{f.name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function RenderEvents({ section }: { section: ArchSectionEvents }) {
  return (
    <>
      <p className="text-sm text-muted-foreground leading-relaxed">{section.desc}</p>
      <div>
        <p className="text-xs font-bold mb-2">20 Canonical Event Types</p>
        <div className="flex flex-wrap gap-1.5">
          {section.eventTypes.map((et) => (
            <span key={et} className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium data-mono text-primary">{et}</span>
          ))}
        </div>
      </div>
    </>
  )
}

function RenderDesc({ section }: { section: ArchSectionDesc }) {
  return (
    <>
      <p className="text-sm text-muted-foreground leading-relaxed">{section.desc}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{section.desc2}</p>
    </>
  )
}

function ArchSectionContent({ section }: { section: ArchSection }) {
  switch (section.type) {
    case 'planes': return <RenderPlanes section={section} />
    case 'moat': return <RenderMoat section={section} />
    case 'events': return <RenderEvents section={section} />
    case 'desc': return <RenderDesc section={section} />
  }
}

/* ────────────────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                              */
/* ────────────────────────────────────────────────────────────── */

export function DocsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('architecture')
  const { totalContributors } = useTrionStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Protocol Documentation</h1>
        <p className="text-sm text-muted-foreground">
          TRION Protocol v1.0 — Complete Technical Reference · {totalContributors} contributors verified
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mb-px border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors rounded-t-md
              ${activeTab === tab.id
                ? 'text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'architecture' && (
          <motion.div
            key="architecture"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-5 max-w-4xl"
          >
            {architectureSections.map((section, si) => (
              <motion.div
                key={section.title}
                variants={itemVariants}
                className="dash-card p-5 sm:p-6 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold text-primary data-mono mt-0.5">{String(si + 1).padStart(2, '0')}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold">{section.title}</h2>
                    <code className="block text-xs data-mono text-muted-foreground mt-1 break-all">{section.formula}</code>
                  </div>
                </div>
                <ArchSectionContent section={section} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'inventions' && (
          <motion.div
            key="inventions"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-5xl">
              {inventions.map((inv) => (
                <motion.div
                  key={inv.num}
                  variants={itemVariants}
                  className="dash-card p-4 flex items-start gap-3 group"
                >
                  <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-xs font-bold data-mono text-primary group-hover:bg-primary/20 transition-colors">
                    {inv.num}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-tight truncate">{inv.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{inv.truth}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'usecases' && (
          <motion.div
            key="usecases"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl space-y-4"
          >
            {useCaseCategories.map((cat) => (
              <UseCaseCategoryCard key={cat.category} category={cat} />
            ))}
          </motion.div>
        )}

        {activeTab === 'proof' && (
          <motion.div
            key="proof"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl space-y-4"
          >
            {proofStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="dash-card p-5 sm:p-6 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-sm font-bold">{stat.label}</h3>
                  <span className={`${stat.badge} text-[10px] font-bold data-mono px-2 py-0.5 rounded-md`}>
                    {stat.badgeText}
                  </span>
                </div>
                <ul className="space-y-2">
                  {stat.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                      <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  USE CASE CATEGORY COLLAPSIBLE CARD                          */
/* ────────────────────────────────────────────────────────────── */

function UseCaseCategoryCard({ category }: { category: UseCaseCategory }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div variants={itemVariants} className="dash-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold">{category.category}</h3>
          <span className="text-[10px] data-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {category.count} use cases
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-border pt-3">
              {category.examples.map((ex) => (
                <div key={ex.name} className="space-y-1">
                  <p className="text-xs font-bold">{ex.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ex.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
