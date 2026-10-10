export type MediaType = "photo" | "video"
export type MediaSection = "photography" | "video" | "content" | "about" | "cover" | "gallery"

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

export const PHOTO_CATEGORIES = ["Events", "Gastro", "Weddings", "Portraits"] as const

export const CATEGORY_KEYS = ["video", "events", "gastro", "weddings", "ugc", "graphics"] as const
export type CategoryKey = (typeof CATEGORY_KEYS)[number]

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  video: "Video",
  events: "Eventy",
  gastro: "Gastro",
  weddings: "Svatby",
  ugc: "UGC",
  graphics: "Grafika",
}

const LEGACY_PHOTO_CATEGORY: Record<string, CategoryKey> = {
  Events: "events",
  Gastro: "gastro",
  Weddings: "weddings",
}

/** Groups gallery items by category key, folding in items from the older section-based uploads. */
export function groupGalleries(items: MediaItem[]): Record<CategoryKey, MediaItem[]> {
  const groups = Object.fromEntries(CATEGORY_KEYS.map((k) => [k, [] as MediaItem[]])) as Record<
    CategoryKey,
    MediaItem[]
  >
  for (const item of items) {
    let key: CategoryKey | undefined
    if (item.section === "gallery" && CATEGORY_KEYS.includes(item.category as CategoryKey)) {
      key = item.category as CategoryKey
    } else if (item.section === "video") {
      key = "video"
    } else if (item.section === "content") {
      key = "ugc"
    } else if (item.section === "photography" && item.category) {
      key = LEGACY_PHOTO_CATEGORY[item.category]
    }
    if (key) groups[key].push(item)
  }
  return groups
}
