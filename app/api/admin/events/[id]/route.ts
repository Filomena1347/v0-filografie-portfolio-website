import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { isAuthed } from "@/lib/auth"
import {
  UUID_PATTERN,
  destroyCloudinaryAsset,
  isOwnCloudinaryUrl,
  isPosterPublicId,
  publicIdFromUrl,
  revalidateEvents,
  toResourceType,
  type AdminEventItem,
} from "@/lib/events-admin"

export const dynamic = "force-dynamic"

type Context = { params: Promise<{ id: string }> }

async function findItem(id: string) {
  const rows = (await sql`
    SELECT id, type, cloudinary_public_id, url, poster_url, width, height, sort_order, created_at
    FROM events_media
    WHERE id = ${id}
  `) as unknown as AdminEventItem[]
  return rows[0]
}

function posterPublicId(posterUrl: string | null) {
  if (!posterUrl) return null
  const publicId = publicIdFromUrl(posterUrl)
  return publicId && isPosterPublicId(publicId) ? publicId : null
}

/** Sets a custom poster for a video, or clears it with { poster_url: null }. */
export async function PATCH(request: Request, { params }: Context) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const body = (await request.json().catch(() => ({}))) as { poster_url?: unknown }
  const posterUrl = body.poster_url
  if (posterUrl !== null) {
    const publicId = typeof posterUrl === "string" ? publicIdFromUrl(posterUrl) : null
    if (!isOwnCloudinaryUrl(posterUrl, "image") || !publicId || !isPosterPublicId(publicId)) {
      return NextResponse.json({ error: "poster_url must be an uploaded events poster" }, { status: 400 })
    }
  }

  try {
    const existing = await findItem(id)
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (existing.type !== "video") {
      return NextResponse.json({ error: "Only videos have a poster" }, { status: 400 })
    }

    const [item] = (await sql`
      UPDATE events_media
      SET poster_url = ${posterUrl as string | null}
      WHERE id = ${id}
      RETURNING id, type, cloudinary_public_id, url, poster_url, width, height, sort_order, created_at
    `) as unknown as AdminEventItem[]

    const previous = posterPublicId(existing.poster_url)
    if (previous && previous !== posterPublicId(item.poster_url)) {
      await destroyCloudinaryAsset(previous, "image")
    }

    revalidateEvents()
    return NextResponse.json({ item })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  try {
    const item = await findItem(id)
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // The row is kept when Cloudinary fails, so the delete can be retried instead of orphaning the file.
    const removed = await destroyCloudinaryAsset(item.cloudinary_public_id, toResourceType(item.type))
    if (!removed) {
      return NextResponse.json({ error: "Could not delete the file from Cloudinary. Try again." }, { status: 502 })
    }

    const poster = posterPublicId(item.poster_url)
    if (poster) await destroyCloudinaryAsset(poster, "image")

    await sql`DELETE FROM events_media WHERE id = ${id}`
    revalidateEvents()
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
