import { NextResponse } from "next/server"
import { sql, ensureSchema } from "@/lib/db"
import { parseOrderDevice } from "@/lib/media"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    await ensureSchema()
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")
    const device = parseOrderDevice(searchParams.get("device"))
    const orderBy = device === "mobile" ? sql`COALESCE(sort_order_mobile, sort_order)` : sql`sort_order`

    const rows = section
      ? await sql`
          SELECT * FROM media_items
          WHERE published = true AND section = ${section}
          ORDER BY ${orderBy} ASC, created_at DESC
        `
      : await sql`
          SELECT * FROM media_items
          WHERE published = true
          ORDER BY ${orderBy} ASC, created_at DESC
        `

    return NextResponse.json({ items: rows })
  } catch (error) {
    console.log("[v0] GET /api/media error:", (error as Error).message)
    return NextResponse.json({ items: [] })
  }
}
