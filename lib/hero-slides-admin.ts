import { sql } from "@/lib/db"

export type AdminHeroSlide = {
  id: string
  publicId: string
  imageUrl: string
  thumbUrl: string
  sortOrder: number
  objectPosition: string
  altCs: string
  altEn: string
  isActive: boolean
}

export type HeroSlideRow = {
  id: string
  cloudinary_public_id: string
  image_url: string
  sort_order: number
  object_position: string | null
  alt_cs: string | null
  alt_en: string | null
  is_active: boolean
}

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

function thumbUrl(row: HeroSlideRow) {
  if (!CLOUD_NAME || !row.cloudinary_public_id) return row.image_url
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_480/${row.cloudinary_public_id}`
}

export function toAdminHeroSlide(row: HeroSlideRow): AdminHeroSlide {
  return {
    id: row.id,
    publicId: row.cloudinary_public_id,
    imageUrl: row.image_url,
    thumbUrl: thumbUrl(row),
    sortOrder: row.sort_order,
    objectPosition: row.object_position || "center center",
    altCs: row.alt_cs ?? "",
    altEn: row.alt_en ?? "",
    isActive: row.is_active,
  }
}

export async function listAdminHeroSlides(): Promise<AdminHeroSlide[]> {
  const rows = (await sql`
    SELECT id, cloudinary_public_id, image_url, sort_order, object_position, alt_cs, alt_en, is_active
    FROM hero_slides
    ORDER BY sort_order ASC, created_at ASC
  `) as unknown as HeroSlideRow[]
  return rows.map(toAdminHeroSlide)
}
