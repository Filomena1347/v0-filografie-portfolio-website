import { NextResponse, type NextRequest } from 'next/server'

const EVENTS_HOST = 'event-coverage-prague.vercel.app'

const PORTFOLIO_HOSTS = new Set([
  'filography.cz',
  'www.filography.cz',
  'filography.com',
  'www.filography.com',
])

// Paths the standalone events site is allowed to serve besides "/".
const EVENTS_HOST_ALLOWED_PREFIXES = [
  '/_next/',
  '/events-assets/',
  '/api/events',
  '/events/opengraph-image',
  '/events/twitter-image',
]

function notFound() {
  return new NextResponse(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>404</title></head><body style="font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0"><p>404 &ndash; Not found</p></body></html>',
    { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } },
  )
}

function isEventsPath(pathname: string) {
  return pathname === '/events' || pathname.startsWith('/events/')
}

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').split(':')[0].toLowerCase()
  const { pathname } = request.nextUrl

  if (host === EVENTS_HOST) {
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/events'
      return NextResponse.rewrite(url)
    }

    if (EVENTS_HOST_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return NextResponse.next()
    }

    return notFound()
  }

  if (PORTFOLIO_HOSTS.has(host) && isEventsPath(pathname)) {
    return notFound()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
