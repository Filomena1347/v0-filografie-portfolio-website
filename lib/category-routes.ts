import type { CategoryKey } from "@/lib/media"

export type RouteLang = "en" | "cs"
export type FilterKey = "all" | CategoryKey

/**
 * Public URL slug per gallery category and language. English lives at the site
 * root, Czech under /cs. The English "events" slug cannot be /events because
 * that path belongs to the standalone events page.
 */
export const CATEGORY_SLUGS: Partial<Record<CategoryKey, Record<RouteLang, string>>> = {
  events: { en: "event-photography", cs: "eventy" },
  gastro: { en: "gastro", cs: "gastro" },
  weddings: { en: "weddings", cs: "svatby" },
  video: { en: "video", cs: "video" },
  portraits: { en: "portraits", cs: "portraty" },
  graphics: { en: "graphics", cs: "grafika" },
  products: { en: "product", cs: "produktova" },
}

export const CATEGORY_TITLES: Partial<Record<CategoryKey, Record<RouteLang, string>>> = {
  events: { en: "Events", cs: "Eventy" },
  gastro: { en: "Gastro", cs: "Gastro" },
  weddings: { en: "Weddings", cs: "Svatby" },
  video: { en: "Video", cs: "Video" },
  portraits: { en: "Portraits", cs: "Portréty" },
  graphics: { en: "Graphics", cs: "Grafika" },
  products: { en: "Product Photography", cs: "Produktová fotografie" },
}

export function categoryPath(key: FilterKey, lang: RouteLang): string {
  const prefix = lang === "cs" ? "/cs" : ""
  if (key === "all") return prefix || "/"
  const slug = CATEGORY_SLUGS[key]?.[lang]
  return slug ? `${prefix}/${slug}` : prefix || "/"
}

/** Returns the category for a slug in the given language, or null if unknown. */
export function categoryFromSlug(slug: string, lang: RouteLang): CategoryKey | null {
  for (const [key, slugs] of Object.entries(CATEGORY_SLUGS)) {
    if (slugs?.[lang] === slug) return key as CategoryKey
  }
  return null
}

/** Reads language and selected category out of a public-site pathname. */
export function parseCategoryPath(pathname: string): { lang: RouteLang; key: FilterKey; known: boolean } {
  const clean = pathname.replace(/\/+$/, "") || "/"
  const isCs = clean === "/cs" || clean.startsWith("/cs/")
  const lang: RouteLang = isCs ? "cs" : "en"
  const rest = isCs ? clean.slice(3) : clean
  if (rest === "" || rest === "/") return { lang, key: "all", known: true }
  const key = categoryFromSlug(rest.slice(1), lang)
  return key ? { lang, key, known: true } : { lang, key: "all", known: false }
}

/** The same page in the other language, or null for paths without language URLs. */
export function pathInLanguage(pathname: string, lang: RouteLang): string | null {
  const parsed = parseCategoryPath(pathname)
  return parsed.known ? categoryPath(parsed.key, lang) : null
}
