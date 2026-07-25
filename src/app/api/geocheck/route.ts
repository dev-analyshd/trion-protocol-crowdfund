import { NextRequest, NextResponse } from 'next/server'

const RESTRICTED_CODES = new Set(['US', 'CA', 'CN'])

/**
 * GET /api/geocheck
 *
 * Checks the visitor's country via IP geolocation.
 * - In development mode: always returns unrestricted (geo-block disabled).
 * - In production: checks x-forwarded-for → x-real-ip → fallback,
 *   then queries ip-api.com. Any lookup failure → fail open (unrestricted).
 */
export async function GET(request: NextRequest) {
  // In development/demo mode, skip geo-blocking entirely
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json({ restricted: false, countryCode: 'DEV' })
  }

  try {
    // Extract the real client IP from reverse proxy headers
    // Caddy, Cloudflare, Vercel all set x-forwarded-for
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfIp = request.headers.get('cf-connecting-ip')

    let ip = cfIp || (forwarded ? forwarded.split(',')[0].trim() : realIp) || '127.0.0.1'

    // Skip lookup for private/local/missing IPs — fail open
    const isPrivate =
      !ip ||
      ip === 'unknown' ||
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.') ||
      ip.startsWith('169.254.') ||
      ip.startsWith('100.') // Carrier-grade NAT

    if (isPrivate) {
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

      // If ip-api returns an error (rate limit, etc.), fail open
      if (geo.status !== 'success') {
        return NextResponse.json({ restricted: false, countryCode: 'UNKNOWN' })
      }

      const countryCode = geo.countryCode ?? 'UNKNOWN'

      return NextResponse.json({
        restricted: RESTRICTED_CODES.has(countryCode),
        countryCode,
      })
    } catch {
      // Timeout or fetch error — fail open (don't block anyone on API failure)
      return NextResponse.json({ restricted: false, countryCode: 'UNKNOWN' })
    } finally {
      clearTimeout(timeoutId)
    }
  } catch {
    // Any unexpected error — fail open
    return NextResponse.json({ restricted: false, countryCode: 'UNKNOWN' })
  }
}
