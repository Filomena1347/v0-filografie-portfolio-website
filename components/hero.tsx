"use client"

import Image from "next/image"
import { useMemo, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { InlineGallery } from "@/components/inline-gallery"
import { AdminLoginDot } from "@/components/admin-login-dialog"
import { CATEGORY_KEYS } from "@/lib/media"
import type { CategoryKey, MediaItem } from "@/lib/media"

type FilterKey = "all" | CategoryKey

type HeroProps = {
  covers?: Partial<Record<CategoryKey, string>>
  galleries?: Partial<Record<CategoryKey, MediaItem[]>>
}

export function Hero({ covers = {}, galleries = {} }: HeroProps) {
  const { t } = useLanguage()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<FilterKey>("all")
  const [open, setOpen] = useState(false)

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t.hero_filter_all },
    { key: "events", label: t.hero_filter_events },
    { key: "gastro", label: t.hero_filter_gastro },
    { key: "weddings", label: t.hero_filter_weddings },
    { key: "video", label: t.hero_filter_video },
    { key: "ugc", label: t.hero_filter_ugc },
    { key: "graphics", label: t.hero_filter_graphics },
  ]

  const cards = useMemo(
    () =>
      [
        { id: "events", image: "/images/cover-eventy.png", category: t.hero_card_events_cat, desc: t.hero_card_events_desc },
        { id: "gastro", image: "/images/cover-gastro.png", category: t.hero_card_gastro_cat, desc: t.hero_card_gastro_desc },
        { id: "weddings", image: "/images/cover-svatby.png", category: t.hero_card_weddings_cat, desc: t.hero_card_weddings_desc },
        { id: "video", image: "/images/pillar-video.png", category: t.hero_card_video_cat, desc: t.hero_card_video_desc },
        { id: "ugc", image: "/images/pillar-content.png", category: t.hero_card_ugc_cat, desc: t.hero_card_ugc_desc },
        { id: "graphics", image: "/images/card-graphics.png", category: t.hero_card_graphics_cat, desc: t.hero_card_graphics_desc },
      ].map((c) => ({
        ...c,
        id: c.id as CategoryKey,
        image: covers[c.id as CategoryKey] ?? c.image,
      })),
    [t, covers],
  )

  const galleryItems = useMemo(
    () =>
      active === "all"
        ? CATEGORY_KEYS.flatMap((k) => galleries[k] ?? [])
        : (galleries[active] ?? []),
    [active, galleries],
  )

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.min(el.clientWidth * 0.8, 520)
    el.scrollBy({ left: dir * amount, behavior: "smooth" })
  }

  const openGallery = (key: FilterKey) => {
    setActive(key)
    setOpen(true)
    requestAnimationFrame(() =>
      galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    )
  }

  const closeGallery = () => {
    setOpen(false)
    cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <section id="top" className="relative pt-28 md:pt-32 pb-16 md:pb-24 bg-background">
      <div className="max-w-7xl mx-auto w-full px-6">
        {/* Label + heading */}
        <p className="font-serif text-lg md:text-xl text-foreground/60">{t.hero_label}</p>
        <h1 className="mt-2 font-serif text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-balance text-foreground max-w-3xl">
          {t.hero_title.endsWith(".") ? (
            <>
              {t.hero_title.slice(0, -1)}
              <AdminLoginDot />
            </>
          ) : (
            t.hero_title
          )}
        </h1>

        {/* Filter pills */}
        <div id="work" className="mt-8 flex flex-wrap items-center gap-2.5 scroll-mt-24">
          {filters.map((f) => {
            const isActive = open && active === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => openGallery(f.key)}
                aria-pressed={isActive}
                aria-controls="work-gallery"
                className={`rounded-full px-5 py-2 text-sm tracking-wide transition-colors ${
                  isActive || (!open && f.key === "all")
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground/80 hover:border-primary/60"
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Card row */}
        <div ref={cardsRef} className="relative mt-10">
          <div
            ref={scrollerRef}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((card) => {
              const isActive = open && active === card.id
              return (
                <article key={card.id} className="snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-[31%]">
                  <button
                    type="button"
                    onClick={() => openGallery(card.id)}
                    aria-controls="work-gallery"
                    aria-pressed={isActive}
                    className="group block w-full text-left focus-visible:outline-none"
                  >
                    <div
                      className={`relative aspect-[4/5] w-full overflow-hidden rounded-2xl border bg-card shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] transition-colors group-hover:border-primary/60 group-focus-visible:ring-2 group-focus-visible:ring-primary ${
                        isActive ? "border-primary" : "border-border"
                      }`}
                    >
                      <Image
                        src={card.image || "/placeholder.svg"}
                        alt={`${card.category} — ${card.desc}`}
                        fill
                        sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 31vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-3">
                      <h3 className="font-serif text-xl text-foreground">{card.category}</h3>
                      <p className="text-sm text-foreground/60">{card.desc}</p>
                    </div>
                  </button>
                </article>
              )
            })}
          </div>

          {/* Arrow navigation */}
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-full border border-foreground/20 text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-full border border-foreground/20 text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>

      <div id="work-gallery" ref={galleryRef} aria-live="polite" className="mt-12 w-full scroll-mt-20">
        {open && (
          <>
            <InlineGallery items={galleryItems} emptyLabel={t.gallery_empty} animationKey={active} />
            <div className="mt-10 flex justify-center px-6">
              <button
                type="button"
                onClick={closeGallery}
                className="rounded-full border border-border bg-card px-7 py-2.5 text-sm tracking-wide text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {t.gallery_close}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
