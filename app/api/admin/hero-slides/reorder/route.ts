import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { isAuthed } from "@/lib/auth"
import { revalidatePublicMedia } from "@/lib/revalidate"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const ids: unknown = body.ids
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "ids must be an array of strings" }, { status: 400 })
  }

  try {
    await sql.begin(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
        await tx`UPDATE hero_slides SET sort_order = ${i} WHERE id = ${ids[i] as string}`
      }
    })
    revalidatePublicMedia()
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
