import { NextResponse } from "next/server"
import { sql, ensureSchema } from "@/lib/db"
import { isAuthed } from "@/lib/auth"
import { revalidatePublicMedia } from "@/lib/revalidate"
import { flattenAll, groupGalleries, parseOrderDevice } from "@/lib/media"
import type { MediaItem } from "@/lib/media"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await ensureSchema()
  const { searchParams } = new URL(request.url)
  const section = searchParams.get("section")
  const category = searchParams.get("category")
  const device = parseOrderDevice(searchParams.get("device"))
  const orderBy = device === "mobile" ? sql`COALESCE(sort_order_mobile, sort_order)` : sql`sort_order`

  if (searchParams.get("view") === "all") {
    const published = await sql`
      SELECT * FROM media_items
      WHERE published = true AND section IN ('gallery', 'photography', 'video', 'content')
      ORDER BY array_position(ARRAY['gallery', 'photography', 'video', 'content'], section), ${orderBy} ASC, created_at DESC
    `
    // Photos hidden from "Vše" stay in the admin view (at the end) so they can be restored.
    return NextResponse.json({ items: flattenAll(groupGalleries(published as unknown as MediaItem[]), device, true) })
  }

  const rows =
    section && category
      ? await sql`SELECT * FROM media_items WHERE section = ${section} AND category = ${category} ORDER BY ${orderBy} ASC, created_at DESC`
      : section
        ? await sql`SELECT * FROM media_items WHERE section = ${section} ORDER BY ${orderBy} ASC, created_at DESC`
        : await sql`SELECT * FROM media_items ORDER BY ${orderBy} ASC, created_at DESC`

  return NextResponse.json({ items: rows })
}

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }
  const { type, section, category, title, public_id, url, thumbnail_url, width, height } = body as {
    type?: string
    section?: string
    category?: string | null
    title?: string | null
    public_id?: string
    url?: string
    thumbnail_url?: string | null
    width?: number | null
    height?: number | null
  }

  const missing = Object.entries({ type, section, public_id, url })
    .filter(([, v]) => !v)
    .map(([k]) => k)
  if (missing.length > 0) {
    console.error("[media] Missing required fields:", missing, body)
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 },
    )
  }

  try {
    await ensureSchema()

    const [{ max, max_mobile }] = await sql`
      SELECT
        COALESCE(MAX(sort_order), -1)::int AS max,
        COALESCE(MAX(COALESCE(sort_order_mobile, sort_order)), -1)::int AS max_mobile
      FROM media_items
      WHERE section = ${section!} AND category IS NOT DISTINCT FROM ${category ?? null}
    `
    const nextOrder = Number(max) + 1
    const nextMobileOrder = Number(max_mobile) + 1

    // The table's CHECK constraint only allows 'foto' or 'video' for media_type.
    const mediaType = String(type).toLowerCase() === "video" ? "video" : "foto"

    const [row] = await sql`
      INSERT INTO media_items (media_type, type, section, category, title, public_id, cloudinary_public_id, url, thumbnail_url, width, height, sort_order, sort_order_mobile)
      VALUES (${mediaType}, ${type!}, ${section!}, ${category ?? null}, ${title ?? null}, ${public_id!}, ${public_id!}, ${url!}, ${thumbnail_url ?? null}, ${width != null ? Math.round(Number(width)) : null}, ${height != null ? Math.round(Number(height)) : null}, ${nextOrder}, ${nextMobileOrder})
      RETURNING *
    `

    revalidatePublicMedia()
    return NextResponse.json({ item: row })
  } catch (err) {
    const e = err as { message?: string; code?: string; detail?: string; hint?: string }
    console.error("[media] Database insert failed:", {
      message: e.message,
      code: e.code,
      detail: e.detail,
      hint: e.hint,
      payload: { type, section, category, public_id, url },
    })
    const parts = [e.message ?? "Unknown database error"]
    if (e.code) parts.push(`code ${e.code}`)
    if (e.detail) parts.push(e.detail)
    return NextResponse.json({ error: `Database error: ${parts.join(" | ")}` }, { status: 500 })
  }
}
