import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { isAuthed } from "@/lib/auth"
import {
  isItemPublicId,
  isMediaType,
  isOwnCloudinaryUrl,
  revalidateEvents,
  toResourceType,
  type AdminEventItem,
} from "@/lib/events-admin"

export const dynamic = "force-dynamic"

const COLUMNS = sql`id, type, cloudinary_public_id, url, poster_url, width, height, sort_order, created_at`

function toDimension(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? Math.round(number) : null
}

export async function GET(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const type = new URL(request.url).searchParams.get("type")
  if (!isMediaType(type)) {
    return NextResponse.json({ error: "type must be photo or video" }, { status: 400 })
  }

  try {
    const items = (await sql`
      SELECT ${COLUMNS}
      FROM events_media
      WHERE type = ${type}
      ORDER BY sort_order ASC, created_at ASC
    `) as unknown as AdminEventItem[]
    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })

  const { type, cloudinary_public_id: publicId, url } = body
  if (!isMediaType(type)) {
    return NextResponse.json({ error: "type must be photo or video" }, { status: 400 })
  }
  if (typeof publicId !== "string" || !isItemPublicId(publicId)) {
    return NextResponse.json({ error: "cloudinary_public_id must be inside the events folder" }, { status: 400 })
  }
  if (!isOwnCloudinaryUrl(url, toResourceType(type))) {
    return NextResponse.json({ error: "url must be a Cloudinary URL of this account" }, { status: 400 })
  }

  const width = toDimension(body.width)
  const height = toDimension(body.height)

  try {
    // The lock keeps the "next sort_order" correct when several inserts arrive at once.
    const item = await sql.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtext('events_media_sort_order'))`
      const [row] = await tx`
        INSERT INTO events_media (type, cloudinary_public_id, url, width, height, sort_order)
        VALUES (
          ${type},
          ${publicId},
          ${url as string},
          ${width},
          ${height},
          (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM events_media WHERE type = ${type})
        )
        RETURNING ${COLUMNS}
      `
      return row
    })

    revalidateEvents()
    return NextResponse.json({ item })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
