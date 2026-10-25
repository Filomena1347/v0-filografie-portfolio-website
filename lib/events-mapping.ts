import type { EventPhoto, EventVideo } from '@/lib/events-data'

type MediaRow = {
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
export function mediaPath(id: string, params?: Record<string, string | number>) {
  const query = params
    ? `?${new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString()}`
    : ''
  return `/api/media/${id}${query}`
}

export function toEventPhoto(row: MediaRow, index: number): EventPhoto {
  return {
    id: row.id,
    src: mediaPath(row.id, { w: PHOTO_GRID_WIDTH }),
    fullSrc: mediaPath(row.id, { w: PHOTO_FULL_WIDTH }),
    width: row.width || DEFAULT_PHOTO_SIZE.width,
    height: row.height || DEFAULT_PHOTO_SIZE.height,
    alt: `Event photo ${index + 1}`,
  }
}

export function toEventVideo(row: MediaRow & { poster_url: string | null }, index: number): EventVideo {
  return {
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
  }
}
