import { sql } from '@/lib/db'

export const runtime = 'nodejs'

type MediaRow = {
  type: 'photo' | 'video'
  cloudinary_public_id: string
  url: string
  poster_url: string | null
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const CLOUDINARY_HOST = 'res.cloudinary.com'
const ALLOWED_WIDTHS = [320, 480, 640, 720, 800, 1200, 1600, 2000, 2400]
const IMMUTABLE_CACHE = 'public, max-age=31536000, s-maxage=31536000, immutable'

const FORWARDED_HEADERS = ['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']

function notFound() {
  return new Response('Not found', { status: 404, headers: { 'cache-control': 'public, max-age=60' } })
}

function snapWidth(raw: string | null, fallback: number) {
  const requested = Number.parseInt(raw ?? '', 10)
  if (!Number.isFinite(requested) || requested <= 0) return fallback
  return ALLOWED_WIDTHS.find((width) => width >= requested) ?? ALLOWED_WIDTHS[ALLOWED_WIDTHS.length - 1]
}

function cloudNameFor(row: MediaRow) {
  const match = row.url.match(/^https:\/\/res\.cloudinary\.com\/([^/]+)\//)
  return match?.[1] || process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
}

function isCloudinaryUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === CLOUDINARY_HOST
  } catch {
    return false
  }
}

function upstreamUrl(row: MediaRow, searchParams: URLSearchParams) {
  const cloud = cloudNameFor(row)
  if (!cloud) return null

  const publicId = row.cloudinary_public_id.split('/').map(encodeURIComponent).join('/')

  if (row.type === 'video') {
    if (searchParams.get('poster') === '1') {
      const width = snapWidth(searchParams.get('w'), 720)
      if (row.poster_url && isCloudinaryUrl(row.poster_url)) {
        return row.poster_url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)
      }
      return `https://${CLOUDINARY_HOST}/${cloud}/video/upload/so_0,f_jpg,q_auto,w_${width}/${publicId}.jpg`
    }
    return `https://${CLOUDINARY_HOST}/${cloud}/video/upload/f_auto,q_auto/${publicId}`
  }

  const width = snapWidth(searchParams.get('w'), 1200)
  return `https://${CLOUDINARY_HOST}/${cloud}/image/upload/f_auto,q_auto,w_${width}/${publicId}`
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID.test(id)) return notFound()

  let row: MediaRow | undefined
  try {
    const rows = (await sql`
      SELECT type, cloudinary_public_id, url, poster_url
      FROM events_media
      WHERE id = ${id}
      LIMIT 1
    `) as unknown as MediaRow[]
    row = rows[0]
  } catch (error) {
    console.log('[v0] media lookup error:', (error as Error).message)
    return new Response('Service unavailable', { status: 503, headers: { 'cache-control': 'no-store' } })
  }

  if (!row) return notFound()

  const { searchParams } = new URL(request.url)
  const target = upstreamUrl(row, searchParams)
  if (!target) return new Response('Media is not configured', { status: 503, headers: { 'cache-control': 'no-store' } })

  const upstreamHeaders = new Headers()
  const range = request.headers.get('range')
  if (range) upstreamHeaders.set('range', range)
  // f_auto picks the format from Accept, so it has to reach Cloudinary.
  const accept = request.headers.get('accept')
  if (accept) upstreamHeaders.set('accept', accept)

  let upstream: Response
  try {
    upstream = await fetch(target, { headers: upstreamHeaders, cache: 'no-store' })
  } catch (error) {
    console.log('[v0] media upstream error:', (error as Error).message)
    return new Response('Bad gateway', { status: 502, headers: { 'cache-control': 'no-store' } })
  }

  if (upstream.status === 404) return notFound()
  if (!upstream.ok) {
    return new Response('Bad gateway', { status: 502, headers: { 'cache-control': 'no-store' } })
  }

  const headers = new Headers()
  for (const name of FORWARDED_HEADERS) {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }
  headers.set('cache-control', IMMUTABLE_CACHE)
  headers.set('vary', 'Accept, Range')
  headers.set('x-content-type-options', 'nosniff')
  headers.set('content-disposition', 'inline')

  return new Response(upstream.body, { status: upstream.status, headers })
}
