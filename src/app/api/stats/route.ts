import { NextResponse } from 'next/server'

/**
 * GET /api/stats
 *
 * Returns mock crowdfund stats. In production this would read
 * from the on-chain TRIONCrowdfundVault contract.
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    totalContributions: 67_250,
    totalContributors: 147,
    fundingGoal: 250_000,
  })
}
