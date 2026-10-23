import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { isAuthed } from "@/lib/auth"
import { UUID_PATTERN, isMediaType, revalidateEvents } from "@/lib/events-admin"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as { type?: unknown; ids?: unknown }
  const { type, ids } = body
  if (!isMediaType(type)) {
    return NextResponse.json({ error: "type must be photo or video" }, { status: 400 })
  }
  if (
    !Array.isArray(ids) ||
    ids.some((id) => typeof id !== "string" || !UUID_PATTERN.test(id)) ||
    new Set(ids).size !== ids.length
  ) {
    return NextResponse.json({ error: "ids must be a list of unique ids" }, { status: 400 })
  }

  try {
    await sql.begin(async (tx) => {
      for (let index = 0; index < ids.length; index++) {
        await tx`UPDATE events_media SET sort_order = ${index} WHERE id = ${ids[index] as string} AND type = ${type}`
      }
    })
    revalidateEvents()
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
