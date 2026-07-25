import { NextRequest, NextResponse } from 'next/server'

const RESTRICTED_CODES = new Set(['US', 'CA', 'CN'])

export async function GET(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded
      ? forwarded.split(',')[0].trim()
      : request.headers.get('x-real-ip') ?? '127.0.0.1'

    // Skip lookup for private/local IPs or missing IPs — fail open
    if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1' ||
        ip.startsWith('192.168.') || ip.startsWith('10.') ||
        ip.startsWith('172.') || ip.startsWith('169.254.')) {
      return NextResponse.json({ restricted: false, countryCode: 'LOCAL' })
    }

    // Attempt geo lookup with a 3-second timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    try {
      const geoRes = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,countryCode`,
        { signal: controller.signal, next: { revalidate: 300 } }
      )

      if (!geoRes.ok) {
        return NextResponse.json({ restricted: false, countryCode: 'UNKNOWN' })
      }

      const geo = (await geoRes.json()) as { status: string; countryCode?: string }
      const countryCode = geo.countryCode ?? 'UNKNOWN'

      return NextResponse.json({
        restricted: RESTRICTED_CODES.has(countryCode),
        countryCode,
      })
    } catch {
      // Timeout or fetch error — fail open
      return NextResponse.json({ restricted: false, countryCode: 'UNKNOWN' })
    } finally {
      clearTimeout(timeoutId)
    }
  } catch {
    return NextResponse.json({ restricted: false, countryCode: 'UNKNOWN' })
  }
}
