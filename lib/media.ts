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
  /** Desktop position inside the category. */
  sort_order: number
  /** Mobile position inside the category; falls back to sort_order when null. */
  sort_order_mobile?: number | null
  /** Position in the homepage "Vše" tab; independent of sort_order. Null until the owner orders it. */
  all_sort_order?: number | null
  /** Mobile position in the "Vše" tab; falls back to all_sort_order when null. */
  all_sort_order_mobile?: number | null
  /** When false the item is left out of the "Vše" tab but stays in its own category. */
  show_in_vse?: boolean
  /** When true the item spans 2 columns in the tablet/desktop gallery grid. */
  is_wide?: boolean
  published: boolean
  created_at: string
}

export const PHOTO_CATEGORIES = ["Events", "Gastro", "Weddings", "Portraits"] as const

export const CATEGORY_KEYS = [
  "video",
  "events",
  "gastro",
  "weddings",
  "ugc",
  "portraits",
  "graphics",
  "products",
] as const
export type CategoryKey = (typeof CATEGORY_KEYS)[number]

// Temporarily hidden from the public site; remove a key here to restore it.
export const HIDDEN_CATEGORIES: CategoryKey[] = ["ugc"]

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  video: "Video",
  events: "Eventy",
  gastro: "Gastro",
  weddings: "Svatby",
  ugc: "UGC",
  portraits: "Portréty",
  graphics: "Grafika",
  products: "Produktová fotografie",
}

const LEGACY_PHOTO_CATEGORY: Record<string, CategoryKey> = {
  Events: "events",
  Gastro: "gastro",
  Weddings: "weddings",
}

export type OrderDevice = "desktop" | "mobile"

export function parseOrderDevice(value: unknown): OrderDevice {
  return value === "mobile" ? "mobile" : "desktop"
}

function categoryOrder(item: MediaItem, device: OrderDevice): number {
  return device === "mobile" ? (item.sort_order_mobile ?? item.sort_order) : item.sort_order
}

function allOrder(item: MediaItem, device: OrderDevice): number | null | undefined {
  return device === "mobile" ? (item.all_sort_order_mobile ?? item.all_sort_order) : item.all_sort_order
}

/** Stable sort by the device's category order; ties keep the incoming order. */
export function sortForDevice(items: MediaItem[], device: OrderDevice): MediaItem[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => categoryOrder(a.item, device) - categoryOrder(b.item, device) || a.index - b.index)
    .map(({ item }) => item)
}

/**
 * Items shown in the "Vše" tab: every visible category, ordered by the owner's custom
 * all_sort_order for the given device. Items without one keep the default category order
 * after the ordered ones.
 */
export function flattenAll(
  groups: Partial<Record<CategoryKey, MediaItem[]>>,
  device: OrderDevice = "desktop",
  includeHidden = false,
): MediaItem[] {
  const ordered = CATEGORY_KEYS.filter((k) => !HIDDEN_CATEGORIES.includes(k))
    .flatMap((k) => sortForDevice(groups[k] ?? [], device))
    .filter((item) => includeHidden || item.show_in_vse !== false)
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const ao = allOrder(a.item, device)
      const bo = allOrder(b.item, device)
      if (ao != null && bo != null && ao !== bo) return ao - bo
      if (ao != null && bo == null) return -1
      if (ao == null && bo != null) return 1
      return a.index - b.index
    })
    .map(({ item }) => item)
  return includeHidden ? hiddenLast(ordered) : ordered
}

/** Stable partition: items hidden from "Vše" go after the visible ones, keeping their relative order. */
export function hiddenLast(items: MediaItem[]): MediaItem[] {
  return [...items.filter((i) => i.show_in_vse !== false), ...items.filter((i) => i.show_in_vse === false)]
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
