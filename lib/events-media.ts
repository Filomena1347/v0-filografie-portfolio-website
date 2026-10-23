import { sql } from '@/lib/db'
import type { EventPhoto, EventVideo } from '@/lib/events-data'

type EventsMediaRow = {
  id: string
  width: number | null
  height: number | null
}

const PHOTO_GRID_WIDTH = 1200
const PHOTO_FULL_WIDTH = 2000
const POSTER_WIDTH = 720

const DEFAULT_PHOTO_SIZE = { width: 1200, height: 800 }
const DEFAULT_VIDEO_SIZE = { width: 720, height: 1280 }

// Media is only ever referenced through our own /api/media route, so the page
// HTML never contains the Cloudinary host or account name.
function mediaPath(id: string, params?: Record<string, string | number>) {
  const query = params
    ? `?${new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString()}`
    : ''
  return `/api/media/${id}${query}`
}

export async function getEventPhotos(): Promise<EventPhoto[]> {
  try {
    const rows = (await sql`
      SELECT id, width, height
      FROM events_media
      WHERE type = 'photo'
      ORDER BY sort_order ASC, created_at ASC
    `) as unknown as EventsMediaRow[]

    return rows.map((row, index) => ({
      id: row.id,
      src: mediaPath(row.id, { w: PHOTO_GRID_WIDTH }),
      fullSrc: mediaPath(row.id, { w: PHOTO_FULL_WIDTH }),
      width: row.width || DEFAULT_PHOTO_SIZE.width,
      height: row.height || DEFAULT_PHOTO_SIZE.height,
      alt: `Event photo ${index + 1}`,
    }))
  } catch (error) {
    console.log('[v0] getEventPhotos error:', (error as Error).message)
    return []
  }
}

export async function getEventVideos(): Promise<EventVideo[]> {
  try {
    const rows = (await sql`
      SELECT id, width, height, poster_url
      FROM events_media
      WHERE type = 'video'
      ORDER BY sort_order ASC, created_at ASC
    `) as unknown as (EventsMediaRow & { poster_url: string | null })[]

    return rows.map((row, index) => ({
      id: row.id,
      title: `Event reel ${index + 1}`,
      src: mediaPath(row.id),
      poster: {
        // The poster route is cached for a year per URL, so a replaced poster needs a new URL.
        // Only the random file name is used, never the Cloudinary host.
        src: mediaPath(row.id, {
          poster: 1,
          w: POSTER_WIDTH,
          ...(row.poster_url ? { v: row.poster_url.split('/').pop() ?? '' } : {}),
        }),
        width: DEFAULT_VIDEO_SIZE.width,
        height: DEFAULT_VIDEO_SIZE.height,
      },
    }))
  } catch (error) {
    console.log('[v0] getEventVideos error:', (error as Error).message)
    return []
  }
}
