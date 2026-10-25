import { sql } from '@/lib/db'
import type { EventPhoto, EventVideo } from '@/lib/events-data'
import { toEventPhoto, toEventVideo } from '@/lib/events-mapping'

type EventsMediaRow = {
  id: string
  width: number | null
  height: number | null
}

export async function getEventPhotos(): Promise<EventPhoto[]> {
  try {
    const rows = (await sql`
      SELECT id, width, height
      FROM events_media
      WHERE type = 'photo'
      ORDER BY sort_order ASC, created_at ASC
    `) as unknown as EventsMediaRow[]

    return rows.map(toEventPhoto)
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

    return rows.map(toEventVideo)
  } catch (error) {
    console.log('[v0] getEventVideos error:', (error as Error).message)
    return []
  }
}
