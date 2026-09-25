export type MediaType = "photo" | "video"
export type MediaSection = "photography" | "video" | "content"

export type MediaItem = {
  id: string
  type: MediaType
  section: MediaSection
  category: string | null
  title: string | null
  public_id: string
  url: string
  thumbnail_url: string | null
  width: number | null
  height: number | null
  sort_order: number
  published: boolean
  created_at: string
}

export const PHOTO_CATEGORIES = ["Events", "Gastro", "Portraits"] as const
