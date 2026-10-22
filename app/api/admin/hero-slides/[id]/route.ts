import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { isAuthed } from "@/lib/auth"
import { revalidatePublicMedia } from "@/lib/revalidate"
import { toAdminHeroSlide, type HeroSlideRow } from "@/lib/hero-slides-admin"

export const dynamic = "force-dynamic"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json().catch(() => ({}))

  try {
    const existing = (await sql`
      SELECT id, cloudinary_public_id, image_url, sort_order, object_position, alt_cs, alt_en, is_active
      FROM hero_slides WHERE id = ${id}
    `) as unknown as HeroSlideRow[]
    if (existing.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const current = existing[0]

    const isActive = typeof body.is_active === "boolean" ? body.is_active : current.is_active
    const altCs = typeof body.alt_cs === "string" ? body.alt_cs : current.alt_cs
    const altEn = typeof body.alt_en === "string" ? body.alt_en : current.alt_en
    const replacing = typeof body.public_id === "string" && typeof body.url === "string" && body.public_id && body.url
    const publicId = replacing ? body.public_id : current.cloudinary_public_id
    const imageUrl = replacing ? body.url : current.image_url

    const rows = (await sql`
      UPDATE hero_slides
      SET is_active = ${isActive},
          alt_cs = ${altCs},
          alt_en = ${altEn},
          cloudinary_public_id = ${publicId},
          image_url = ${imageUrl}
      WHERE id = ${id}
      RETURNING id, cloudinary_public_id, image_url, sort_order, object_position, alt_cs, alt_en, is_active
    `) as unknown as HeroSlideRow[]

    revalidatePublicMedia()
    return NextResponse.json({ slide: toAdminHeroSlide(rows[0]) })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params

  try {
    await sql`DELETE FROM hero_slides WHERE id = ${id}`
    revalidatePublicMedia()
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
