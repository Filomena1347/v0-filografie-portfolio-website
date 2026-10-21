import { NextResponse } from "next/server"
import { sql, ensureSchema } from "@/lib/db"
import { isAuthed } from "@/lib/auth"
import { revalidatePublicMedia } from "@/lib/revalidate"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await ensureSchema()

  const { ids, scope } = (await request.json()) as { ids: string[]; scope?: "category" | "all" }
  if (!Array.isArray(ids)) {
    return NextResponse.json({ error: "ids must be an array" }, { status: 400 })
  }

  // The "Vše" tab keeps its own order so it never disturbs the order inside each category.
  await sql.begin(async (tx) => {
    for (let i = 0; i < ids.length; i++) {
      if (scope === "all") {
        await tx`UPDATE media_items SET all_sort_order = ${i} WHERE id = ${ids[i]}`
      } else {
        await tx`UPDATE media_items SET sort_order = ${i} WHERE id = ${ids[i]}`
      }
    }
  })

  revalidatePublicMedia()
  return NextResponse.json({ ok: true })
}
