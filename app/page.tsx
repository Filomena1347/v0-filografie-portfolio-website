import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ThreePillars } from "@/components/three-pillars"
import { Photography } from "@/components/photography"
import { Video } from "@/components/video"
import { Content } from "@/components/content"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { sql, ensureSchema } from "@/lib/db"
import { CATEGORY_KEYS, groupGalleries } from "@/lib/media"
import { SEED_GALLERIES } from "@/lib/seed-gallery"
import type { CategoryKey, MediaItem, MediaSection } from "@/lib/media"

export const dynamic = "force-dynamic"

async function getSection(section: MediaSection): Promise<MediaItem[]> {
  try {
    await ensureSchema()
    const rows = await sql`
      SELECT * FROM media_items
      WHERE published = true AND section = ${section}
      ORDER BY sort_order ASC, created_at DESC
    `
    return rows as unknown as MediaItem[]
  } catch (error) {
    console.log("[v0] getSection error:", (error as Error).message)
    return []
  }
}

export default async function HomePage() {
  const [photos, videos, content, about, covers, gallery] = await Promise.all([
    getSection("photography"),
    getSection("video"),
    getSection("content"),
    getSection("about"),
    getSection("cover"),
    getSection("gallery"),
  ])

  const coverMap: Partial<Record<CategoryKey, string>> = {}
  for (const c of covers) {
    const key = c.category as CategoryKey
    if (CATEGORY_KEYS.includes(key) && !coverMap[key]) coverMap[key] = c.url
  }
  const galleries = groupGalleries([...gallery, ...photos, ...videos, ...content])
  for (const key of CATEGORY_KEYS) {
    galleries[key] = [...galleries[key], ...(SEED_GALLERIES[key] ?? [])]
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero covers={coverMap} galleries={galleries} />
      <ThreePillars />
      <Photography items={photos} />
      <Video items={videos} />
      <Content items={content} />
      <About photo={about[0] ?? null} />
      <Contact />
      <Footer />
    </main>
  )
}
