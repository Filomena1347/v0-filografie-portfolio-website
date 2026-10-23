import { NextResponse } from "next/server"
import { sql, ensureSchema } from "@/lib/db"
import { isAuthed } from "@/lib/auth"
import { revalidatePublicMedia } from "@/lib/revalidate"
import { parseOrderDevice } from "@/lib/media"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await ensureSchema()

  const { ids, scope, device } = (await request.json()) as {
    ids: string[]
    scope?: "category" | "all"
    device?: string
  }
  if (!Array.isArray(ids)) {
    return NextResponse.json({ error: "ids must be an array" }, { status: 400 })
  }
  const mobile = parseOrderDevice(device) === "mobile"

  // The "Vše" tab keeps its own order so it never disturbs the order inside each category,
  // and each device writes only its own column so desktop and mobile never disturb each other.
  await sql.begin(async (tx) => {
    for (let i = 0; i < ids.length; i++) {
      if (scope === "all") {
        if (mobile) await tx`UPDATE media_items SET all_sort_order_mobile = ${i} WHERE id = ${ids[i]}`
        else await tx`UPDATE media_items SET all_sort_order = ${i} WHERE id = ${ids[i]}`
      } else if (mobile) {
        await tx`UPDATE media_items SET sort_order_mobile = ${i} WHERE id = ${ids[i]}`
      } else {
        await tx`UPDATE media_items SET sort_order = ${i} WHERE id = ${ids[i]}`
      }
    }
  })

  revalidatePublicMedia()
  return NextResponse.json({ ok: true })
}
