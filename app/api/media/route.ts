import { NextResponse } from "next/server"
import { sql, ensureSchema } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    await ensureSchema()
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    const rows = section
      ? await sql`
          SELECT * FROM media_items
          WHERE published = true AND section = ${section}
          ORDER BY sort_order ASC, created_at DESC
        `
      : await sql`
          SELECT * FROM media_items
          WHERE published = true
          ORDER BY sort_order ASC, created_at DESC
        `

    return NextResponse.json({ items: rows })
  } catch (error) {
    console.log("[v0] GET /api/media error:", (error as Error).message)
    return NextResponse.json({ items: [] })
  }
}
