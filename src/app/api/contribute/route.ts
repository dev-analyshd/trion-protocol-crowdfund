import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ---------------------------------------------------------------------------
// Tier thresholds (USD equivalent)
// bronze  : < 100
// silver  : >= 100 && < 500
// gold    : >= 500
// ---------------------------------------------------------------------------
const TIERS = [
  { name: 'gold', min: 2000, tokens: 150_000 },
  { name: 'silver', min: 500, tokens: 30_000 },
  { name: 'bronze', min: 100, tokens: 5_000 },
] as const

function determineTier(usdAmount: number) {
  // Check from highest tier first
  for (const tier of TIERS) {
    if (usdAmount >= tier.min) {
      return { tier: tier.name, tokenAllocation: tier.tokens }
    }
  }
  return { tier: 'bronze', tokenAllocation: 0 }
}

// Rough conversion rates for simulation
const ETH_USD = 3_500
const USDC_USD = 1

function toUsd(amount: string, currency: string): number {
  const val = parseFloat(amount)
  if (isNaN(val) || val <= 0) return 0
  const rate = currency.toUpperCase() === 'USDC' ? USDC_USD : ETH_USD
  return val * rate
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, walletAddress, amount, currency } = body as {
      email?: string
      walletAddress?: string
      amount?: string
      currency?: string
    }

    // ── Validation ───────────────────────────────────────────────
    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 },
      )
    }

    if (
      !walletAddress ||
      typeof walletAddress !== 'string' ||
      !walletAddress.startsWith('0x')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'A valid wallet address starting with 0x is required.',
        },
        { status: 400 },
      )
    }

    if (!amount || typeof amount !== 'string' || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: 'A positive contribution amount is required.' },
        { status: 400 },
      )
    }

    const validCurrencies = ['ETH', 'USDC']
    const normalizedCurrency =
      currency?.toUpperCase() ?? 'ETH'
    if (!validCurrencies.includes(normalizedCurrency)) {
      return NextResponse.json(
        { success: false, error: 'Currency must be ETH or USDC.' },
        { status: 400 },
      )
    }

    // ── Tier calculation ──────────────────────────────────────────
    const usdValue = toUsd(amount, normalizedCurrency)
    const { tier, tokenAllocation } = determineTier(usdValue)

    // ── Upsert Citizen + Create Contribution (transactional) ──────
    const citizen = await db.citizen.upsert({
      where: { email },
      update: {
        walletAddress,
        tier,
        tokenAllocation: String(tokenAllocation),
        contributionAmount: amount,
        hasAgreedTerms: true,
      },
      create: {
        email,
        walletAddress,
        tier,
        contributionAmount: amount,
        tokenAllocation: String(tokenAllocation),
        hasAgreedTerms: true,
      },
    })

    const contribution = await db.contribution.create({
      data: {
        citizenId: citizen.id,
        amount,
        currency: normalizedCurrency,
        status: 'confirmed',
      },
    })

    // Generate a pseudo NFT token id for simulation
    const nftTokenId = Math.floor(Math.random() * 9000) + 1000

    return NextResponse.json({
      success: true,
      citizenId: citizen.id,
      tier,
      nftTokenId,
      tokenAllocation,
      contributionId: contribution.id,
    })
  } catch (error) {
    console.error('[POST /api/contribute] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 },
    )
  }
}
