import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Import gemeente redirects (plaatsnaam -> official gemeente)
import gemeenteRedirects from './data/nextjs-gemeente-redirects.json'

// Import cemetery redirects for known old slug patterns
import cemeteryRedirects from './data/cemetery-redirects.json'

// Create lookup maps for fast O(1) access
const gemeenteRedirectMap = new Map<string, string>(
  gemeenteRedirects.map(r => [r.source, r.destination])
)

const cemeteryRedirectMap = new Map<string, string>(
  cemeteryRedirects.map((r: { source: string; destination: string }) => [r.source, r.destination])
)

// Middleware om 404 errors te voorkomen tijdens de overgang
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Log requests in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Request for: ${url.pathname}`)
  }

  // Check for gemeente redirects (plaatsnaam -> official gemeente)
  // This handles 1720+ old URLs where plaatsnamen were used as gemeente slugs
  if (url.pathname.startsWith('/gemeente/')) {
    const redirectTo = gemeenteRedirectMap.get(url.pathname)
    if (redirectTo) {
      url.pathname = redirectTo
      return NextResponse.redirect(url, 301)
    }
  }

  // Check for cemetery redirects (old slug patterns -> new slugs)
  if (url.pathname.startsWith('/begraafplaats/')) {
    const redirectTo = cemeteryRedirectMap.get(url.pathname)
    if (redirectTo) {
      url.pathname = redirectTo
      return NextResponse.redirect(url, 301)
    }
  }

  // Redirect oude gemeente URLs als de structuur is veranderd
  // Bijvoorbeeld: /gemeenten/beek → /gemeente/beek
  if (url.pathname.startsWith('/gemeenten/')) {
    const gemeente = url.pathname.replace('/gemeenten/', '')
    url.pathname = `/gemeente/${gemeente}`
    return NextResponse.redirect(url, 301)
  }

  // Redirect oude begraafplaatsen URLs
  if (url.pathname.startsWith('/begraafplaatsen/')) {
    const slug = url.pathname.replace('/begraafplaatsen/', '')
    url.pathname = `/begraafplaats/${slug}`
    return NextResponse.redirect(url, 301)
  }

  // Redirect oude provincie URLs
  if (url.pathname.startsWith('/provincies/')) {
    const provincie = url.pathname.replace('/provincies/', '')
    url.pathname = `/provincie/${provincie}`
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

// Configureer welke paden de middleware moet checken
export const config = {
  matcher: [
    // Match alle paden behalve static files en api routes
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|cache).*)',
  ],
}