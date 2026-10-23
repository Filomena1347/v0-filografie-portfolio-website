import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { isAuthed } from "@/lib/auth"
import { listAdminHeroSlides } from "@/lib/hero-slides-admin"
import { heroSlideSrc, type HeroSlide } from "@/lib/hero-slides"
import { HeroPreviewFrame } from "@/components/admin/hero-preview-frame"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Náhled hera",
  robots: { index: false, follow: false },
}

export default async function HeroPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ slide?: string; lang?: string }>
}) {
  if (!(await isAuthed())) {
    redirect("/admin/login")
  }
  const { slide: slideId, lang } = await searchParams

  // The live hero shows active slides only; keep the edited slide even if it is currently inactive.
  const visible = (await listAdminHeroSlides()).filter((s) => s.isActive || s.id === slideId)
  const slides: HeroSlide[] = visible.map((s) => ({
    id: s.id,
    src: heroSlideSrc(s.publicId, s.imageUrl),
    objectPosition: s.objectPosition,
    altCs: s.altCs,
    altEn: s.altEn,
  }))
  const activeIndex = Math.max(
    0,
    visible.findIndex((s) => s.id === slideId),
  )

  return <HeroPreviewFrame slides={slides} activeIndex={activeIndex} initialLang={lang === "en" ? "en" : "cs"} />
}
