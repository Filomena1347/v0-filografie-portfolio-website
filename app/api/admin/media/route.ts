import { NextResponse } from "next/server"
import { sql, ensureSchema } from "@/lib/db"
import { isAuthed } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await ensureSchema()
  const { searchParams } = new URL(request.url)
  const section = searchParams.get("section")
  const category = searchParams.get("category")

  const rows =
    section && category
      ? await sql`SELECT * FROM media_items WHERE section = ${section} AND category = ${category} ORDER BY sort_order ASC, created_at DESC`
      : section
        ? await sql`SELECT * FROM media_items WHERE section = ${section} ORDER BY sort_order ASC, created_at DESC`
        : await sql`SELECT * FROM media_items ORDER BY sort_order ASC, created_at DESC`

  return NextResponse.json({ items: rows })
}

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await ensureSchema()

  const body = await request.json()
  const { type, section, category, title, public_id, url, thumbnail_url, width, height } = body

  if (!type || !section || !public_id || !url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const [{ max }] = await sql`
    SELECT COALESCE(MAX(sort_order), -1) AS max FROM media_items
    WHERE section = ${section} AND category IS NOT DISTINCT FROM ${category ?? null}
  `
  const nextOrder = (max as number) + 1

  const [row] = await sql`
    INSERT INTO media_items (type, section, category, title, public_id, url, thumbnail_url, width, height, sort_order)
    VALUES (${type}, ${section}, ${category ?? null}, ${title ?? null}, ${public_id}, ${url}, ${thumbnail_url ?? null}, ${width ?? null}, ${height ?? null}, ${nextOrder})
    RETURNING *
  `

  return NextResponse.json({ item: row })
}
