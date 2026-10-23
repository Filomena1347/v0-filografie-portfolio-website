import { NextResponse } from "next/server"
import { sql, ensureSchema } from "@/lib/db"
import { isAuthed } from "@/lib/auth"
import { revalidatePublicMedia } from "@/lib/revalidate"
import { cloudinary } from "@/lib/cloudinary"
import { CATEGORY_KEYS } from "@/lib/media"

export const dynamic = "force-dynamic"

const MAX_IDS = 500
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { action?: string; ids?: unknown; category?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const ids = Array.isArray(body.ids) ? body.ids.filter((id): id is string => typeof id === "string" && UUID.test(id)) : []
  if (ids.length === 0 || ids.length > MAX_IDS) {
    return NextResponse.json({ error: `Provide between 1 and ${MAX_IDS} valid ids` }, { status: 400 })
  }

  await ensureSchema()

  if (body.action === "delete") {
    const rows = await sql`SELECT id, public_id, type FROM media_items WHERE id IN ${sql(ids)}`
    await Promise.allSettled(
      rows.map((row) =>
        cloudinary.uploader.destroy(row.public_id as string, {
          resource_type: row.type === "video" ? "video" : "image",
        }),
      ),
    )
    await sql`DELETE FROM media_items WHERE id IN ${sql(ids)}`
    revalidatePublicMedia()
    return NextResponse.json({ ok: true, deleted: rows.map((r) => r.id as string) })
  }

  if (body.action === "hide_from_all") {
    const rows = await sql`UPDATE media_items SET show_in_vse = false WHERE id IN ${sql(ids)} RETURNING id`
    revalidatePublicMedia()
    return NextResponse.json({ ok: true, updated: rows.map((r) => r.id as string) })
  }

  if (body.action === "move") {
    const category = body.category
    if (!category || !(CATEGORY_KEYS as readonly string[]).includes(category)) {
      return NextResponse.json({ error: "Invalid target category" }, { status: 400 })
    }

    // Only category gallery items belong to a category; other sections are left untouched.
    const rows = await sql`
      SELECT id FROM media_items WHERE id IN ${sql(ids)} AND section = 'gallery'
    `
    const movable = new Set(rows.map((r) => r.id as string))
    const ordered = ids.filter((id) => movable.has(id))

    const [{ max, max_mobile }] = await sql`
      SELECT
        COALESCE(MAX(sort_order), -1)::int AS max,
        COALESCE(MAX(COALESCE(sort_order_mobile, sort_order)), -1)::int AS max_mobile
      FROM media_items
      WHERE section = 'gallery' AND category = ${category}
    `
    let next = Number(max) + 1
    let nextMobile = Number(max_mobile) + 1
    const moved: { id: string; sort_order: number }[] = []
    for (const id of ordered) {
      await sql`
        UPDATE media_items
        SET category = ${category}, sort_order = ${next}, sort_order_mobile = ${nextMobile}
        WHERE id = ${id}
      `
      moved.push({ id, sort_order: next })
      next += 1
      nextMobile += 1
    }

    revalidatePublicMedia()
    return NextResponse.json({ ok: true, moved, skipped: ids.length - ordered.length })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
