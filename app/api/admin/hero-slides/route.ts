import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { isAuthed } from "@/lib/auth"
import { revalidatePublicMedia } from "@/lib/revalidate"
import { listAdminHeroSlides, toAdminHeroSlide, type HeroSlideRow } from "@/lib/hero-slides-admin"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    return NextResponse.json({ slides: await listAdminHeroSlides() })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const publicId = typeof body.public_id === "string" ? body.public_id : ""
  const url = typeof body.url === "string" ? body.url : ""
  if (!publicId || !url) {
    return NextResponse.json({ error: "public_id and url are required" }, { status: 400 })
  }

  try {
    const rows = (await sql`
      INSERT INTO hero_slides (cloudinary_public_id, image_url, sort_order, alt_cs, alt_en)
      VALUES (
        ${publicId},
        ${url},
        (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM hero_slides),
        ${typeof body.alt_cs === "string" ? body.alt_cs : ""},
        ${typeof body.alt_en === "string" ? body.alt_en : ""}
      )
      RETURNING id, cloudinary_public_id, image_url, sort_order, object_position, alt_cs, alt_en, is_active
    `) as unknown as HeroSlideRow[]

    revalidatePublicMedia()
    return NextResponse.json({ slide: toAdminHeroSlide(rows[0]) })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
