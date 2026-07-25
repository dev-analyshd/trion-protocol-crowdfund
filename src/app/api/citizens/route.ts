import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const wallet = request.nextUrl.searchParams.get('wallet')

    if (!wallet || typeof wallet !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query parameter ?wallet=0x... is required.' },
        { status: 400 },
      )
    }

    const citizen = await db.citizen.findUnique({
      where: { walletAddress: wallet },
      select: {
        tier: true,
        contributionAmount: true,
        tokenAllocation: true,
        nftTokenId: true,
        createdAt: true,
      },
    })

    if (!citizen) {
      return NextResponse.json(
        { success: false, error: 'Citizen not found.' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      tier: citizen.tier,
      totalContributed: citizen.contributionAmount,
      tokenBalance: citizen.tokenAllocation,
      nftTokenId: citizen.nftTokenId ? parseInt(citizen.nftTokenId, 10) : null,
      memberSince: citizen.createdAt,
    })
  } catch (error) {
    console.error('[GET /api/citizens] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 },
    )
  }
}
