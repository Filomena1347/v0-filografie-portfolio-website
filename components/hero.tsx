"use client"

import Image from "next/image"
import { useMemo, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useLanguage } from "@/context/language-context"

type FilterKey = "all" | "photo" | "video" | "gastro" | "events" | "ugc"

export function Hero() {
  const { t } = useLanguage()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<FilterKey>("all")

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t.hero_filter_all },
    { key: "photo", label: t.hero_filter_photo },
    { key: "video", label: t.hero_filter_video },
    { key: "gastro", label: t.hero_filter_gastro },
    { key: "events", label: t.hero_filter_events },
    { key: "ugc", label: t.hero_filter_ugc },
  ]

  const cards = useMemo(
    () => [
      {
        id: "events",
        image: "/images/pillar-photography.png",
        category: t.hero_card_events_cat,
        desc: t.hero_card_events_desc,
        filters: ["photo", "events"] as FilterKey[],
      },
      {
        id: "gastro",
        image: "/images/hero.png",
        category: t.hero_card_gastro_cat,
        desc: t.hero_card_gastro_desc,
        filters: ["photo", "gastro"] as FilterKey[],
      },
      {
        id: "video",
        image: "/images/pillar-video.png",
        category: t.hero_card_video_cat,
        desc: t.hero_card_video_desc,
        filters: ["video"] as FilterKey[],
      },
      {
        id: "ugc",
        image: "/images/pillar-content.png",
        category: t.hero_card_ugc_cat,
        desc: t.hero_card_ugc_desc,
        filters: ["video", "ugc"] as FilterKey[],
      },
      {
        id: "portraits",
        image: "/images/pillar-photography.png",
        category: t.hero_card_portraits_cat,
        desc: t.hero_card_portraits_desc,
        filters: ["photo"] as FilterKey[],
      },
    ],
    [t],
  )

  const visibleCards = active === "all" ? cards : cards.filter((c) => c.filters.includes(active))

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.min(el.clientWidth * 0.8, 520)
    el.scrollBy({ left: dir * amount, behavior: "smooth" })
  }

  return (
    <section id="top" className="relative pt-28 md:pt-32 pb-16 md:pb-24 bg-background">
      <div className="max-w-7xl mx-auto w-full px-6">
        {/* Label + heading */}
        <p className="font-serif text-lg md:text-xl text-foreground/60">{t.hero_label}</p>
        <h1 className="mt-2 font-serif text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-balance text-foreground max-w-3xl">
          {t.hero_title}
        </h1>

        {/* Filter pills */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          {filters.map((f) => {
            const isActive = active === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActive(f.key)}
                aria-pressed={isActive}
                className={`rounded-full px-5 py-2 text-sm tracking-wide transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "border border-foreground/20 text-foreground/80 hover:border-foreground/40"
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Card row */}
        <div className="relative mt-10">
          <div
            ref={scrollerRef}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {visibleCards.map((card) => (
              <article
                key={card.id}
                className="snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-[31%]"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]">
                  <Image
                    src={card.image || "/placeholder.svg"}
                    alt={`${card.category} — ${card.desc}`}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 31vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-serif text-xl text-foreground">{card.category}</h3>
                  <p className="text-sm text-foreground/60">{card.desc}</p>
                </div>
              </article>
            ))}
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
    </section>
  )
}
