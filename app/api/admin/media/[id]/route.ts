import { NextResponse } from "next/server"
import { sql, ensureSchema } from "@/lib/db"
import { isAuthed } from "@/lib/auth"
import { revalidatePublicMedia } from "@/lib/revalidate"
import { cloudinary } from "@/lib/cloudinary"

export const dynamic = "force-dynamic"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await ensureSchema()
  const { id } = await params
  const body = await request.json()

  const existing = await sql`SELECT * FROM media_items WHERE id = ${id}`
  if (existing.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const current = existing[0]

  const published = body.published ?? current.published
  const category = body.category ?? current.category
  const title = body.title ?? current.title
  const thumbnail_url = body.thumbnail_url ?? current.thumbnail_url

  const [row] = await sql`
    UPDATE media_items
    SET published = ${published}, category = ${category}, title = ${title}, thumbnail_url = ${thumbnail_url}
    WHERE id = ${id}
    RETURNING *
  `

  revalidatePublicMedia()
  return NextResponse.json({ item: row })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await ensureSchema()
  const { id } = await params

  const rows = await sql`SELECT * FROM media_items WHERE id = ${id}`
  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const item = rows[0]
  try {
    await cloudinary.uploader.destroy(item.public_id as string, {
      resource_type: item.type === "video" ? "video" : "image",
    })
  } catch (error) {
    console.log("[v0] Cloudinary destroy failed:", (error as Error).message)
  }

  await sql`DELETE FROM media_items WHERE id = ${id}`
  revalidatePublicMedia()
  return NextResponse.json({ ok: true })
}
