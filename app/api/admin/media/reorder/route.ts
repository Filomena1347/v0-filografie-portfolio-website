import { NextResponse } from "next/server"
import { sql, ensureSchema } from "@/lib/db"
import { isAuthed } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await ensureSchema()

  const { ids } = (await request.json()) as { ids: string[] }
  if (!Array.isArray(ids)) {
    return NextResponse.json({ error: "ids must be an array" }, { status: 400 })
  }

  await sql.begin(async (tx) => {
    for (let i = 0; i < ids.length; i++) {
      await tx`UPDATE media_items SET sort_order = ${i} WHERE id = ${ids[i]}`
    }
  })

  return NextResponse.json({ ok: true })
}
