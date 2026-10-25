"use client"

import Image from "next/image"
import { useMemo, useRef, useState, useSyncExternalStore } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { InlineGallery } from "@/components/inline-gallery"
import { HeroIntro } from "@/components/hero-intro"
import { useHeroSlideIndex } from "@/components/hero-slideshow"
import { HIDDEN_CATEGORIES, flattenAll, sortForDevice } from "@/lib/media"
import type { CategoryKey, MediaItem, OrderDevice } from "@/lib/media"
import type { HeroSlide } from "@/lib/hero-slides"

type FilterKey = "all" | CategoryKey

const DESKTOP_QUERY = "(min-width: 768px)"

function subscribeToBreakpoint(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/** Matches Tailwind's md breakpoint; the server renders the desktop order. */
function useOrderDevice(): OrderDevice {
  const isDesktop = useSyncExternalStore(
    subscribeToBreakpoint,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  )
  return isDesktop ? "desktop" : "mobile"
}

type HeroProps = {
  covers?: Partial<Record<CategoryKey, string>>
  galleries?: Partial<Record<CategoryKey, MediaItem[]>>
  slides?: HeroSlide[]
}

export function Hero({ covers = {}, galleries = {}, slides = [] }: HeroProps) {
  const { t, lang } = useLanguage()
  const hasSlides = slides.length > 0
  const slideIndex = useHeroSlideIndex(slides.length)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<FilterKey>("all")
  const [open, setOpen] = useState(true)

  const filters = (
    [
      { key: "all", label: t.hero_filter_all },
      { key: "events", label: t.hero_filter_events },
      { key: "gastro", label: t.hero_filter_gastro },
      { key: "weddings", label: t.hero_filter_weddings },
      { key: "video", label: t.hero_filter_video },
      { key: "ugc", label: t.hero_filter_ugc },
      { key: "graphics", label: t.hero_filter_graphics },
    ] as { key: FilterKey; label: string }[]
  ).filter((f) => f.key === "all" || !HIDDEN_CATEGORIES.includes(f.key as CategoryKey))

  const cards = useMemo(
    () =>
      [
        { id: "gastro", image: "/images/cover-gastro.png", category: t.hero_card_gastro_cat, desc: t.hero_card_gastro_desc },
        { id: "weddings", image: "/images/cover-svatby.png", category: t.hero_card_weddings_cat, desc: t.hero_card_weddings_desc },
        { id: "video", image: "/images/pillar-video.png", category: t.hero_card_video_cat, desc: t.hero_card_video_desc },
        { id: "events", image: "/images/cover-eventy.png", category: t.hero_card_events_cat, desc: t.hero_card_events_desc },
        { id: "ugc", image: "/images/pillar-content.png", category: t.hero_card_ugc_cat, desc: t.hero_card_ugc_desc },
        { id: "graphics", image: "/images/card-graphics.png", category: t.hero_card_graphics_cat, desc: t.hero_card_graphics_desc },
      ]
        .filter((c) => !HIDDEN_CATEGORIES.includes(c.id as CategoryKey))
        .map((c) => ({
          ...c,
          id: c.id as CategoryKey,
          image: covers[c.id as CategoryKey] ?? c.image,
        })),
    [t, covers],
  )

  const device = useOrderDevice()
  const galleryItems = useMemo(
    () =>
      active === "all"
        ? flattenAll(galleries, device)
        : sortForDevice(galleries[active] ?? [], device),
    [active, galleries, device],
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
    <section
      id="top"
      className={`relative ${hasSlides ? "pt-0" : "pt-28"} md:pt-32 pb-16 md:pb-24 bg-background`}
    >
      <div className="max-w-7xl mx-auto w-full md:px-6">
        <HeroIntro slides={slides} index={slideIndex} lang={lang} />

        {/* Filter pills: one horizontally scrolling row on mobile, wrapping on desktop */}
        <div
          id="work"
          className="mt-5 flex flex-nowrap items-center gap-[7px] overflow-x-auto px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-mt-24 md:mt-8 md:flex-wrap md:gap-2.5 md:overflow-visible md:px-0"
        >
          {filters.map((f) => {
            const isActive = open && active === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => openGallery(f.key)}
                aria-pressed={isActive}
                aria-controls="work-gallery"
                className={`shrink-0 rounded-full px-[15px] py-[7px] text-[13px] tracking-wide transition-colors md:px-5 md:py-2 md:text-sm ${
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
        <div ref={cardsRef} className="relative mt-10 px-6 md:px-0">
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
            <InlineGallery
              items={galleryItems}
              emptyLabel={t.gallery_empty}
              animationKey={active}
              layout={active === "events" ? "justified" : "masonry"}
            />
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
