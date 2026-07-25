import { NextRequest, NextResponse } from 'next/server'

const RESTRICTED_CODES = new Set(['US', 'CA', 'CN'])

export async function GET(request: NextRequest) {
  try {
    // Extract IP from headers (reverse-proxy / edge environments)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : request.headers.get('x-real-ip') ?? 'unknown'

    // Skip the lookup when IP is unknown or private
    if (!ip || ip === 'unknown' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '127.0.0.1') {
      return NextResponse.json({ restricted: false, countryCode: 'LOCAL' })
    }

    const geoRes = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,countryCode`,
      { next: { revalidate: 300 } }, // cache for 5 minutes
    )

    if (!geoRes.ok) {
      console.error('[GET /api/geocheck] ip-api request failed:', geoRes.status)
      return NextResponse.json({ restricted: false, countryCode: 'UNKNOWN' })
    }

    const geo = (await geoRes.json()) as { status: string; countryCode?: string }

    const countryCode = geo.countryCode ?? 'UNKNOWN'
    const restricted = RESTRICTED_CODES.has(countryCode)

    return NextResponse.json({ restricted, countryCode })
  } catch (error) {
    console.error('[GET /api/geocheck] Error:', error)
    // Fail open — do not block users when the geo service is down
    return NextResponse.json({ restricted: false, countryCode: 'UNKNOWN' })
  }
}
