import { sql } from "@/lib/db"

export type HeroSlide = {
  id: string
  src: string
  objectPosition: string
  altCs: string
  altEn: string
}

type HeroSlideRow = {
  id: string
  cloudinary_public_id: string
  image_url: string
  object_position: string | null
  alt_cs: string | null
  alt_en: string | null
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME

function slideSrc(row: HeroSlideRow) {
  if (!CLOUD_NAME || !row.cloudinary_public_id) return row.image_url
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_800/${row.cloudinary_public_id}`
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const rows = (await sql`
      SELECT id, cloudinary_public_id, image_url, object_position, alt_cs, alt_en
      FROM hero_slides
      WHERE is_active = true
      ORDER BY sort_order ASC, created_at ASC
    `) as unknown as HeroSlideRow[]

    return rows.map((row) => ({
      id: row.id,
      src: slideSrc(row),
      objectPosition: row.object_position || "center center",
      altCs: row.alt_cs ?? "",
      altEn: row.alt_en ?? "",
    }))
  } catch (error) {
    console.log("[v0] getHeroSlides error:", (error as Error).message)
    return []
  }
}
