"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/context/language-context"
import type { MediaItem } from "@/lib/media"

const INITIAL_COUNT = 6

export function Photography({ items }: { items: MediaItem[] }) {
  const { t } = useLanguage()
  const [activeCat, setActiveCat] = useState<string>("all")
  const [expanded, setExpanded] = useState(false)

  const cats = [
    { key: "all", label: t.photo_view_all === "View all" ? "All" : "Vše" },
    { key: "Events", label: t.photo_cat_events },
    { key: "Gastro", label: t.photo_cat_gastro },
    { key: "Weddings", label: t.photo_cat_weddings },
    { key: "Portraits", label: t.photo_cat_portraits },
  ]

  const filtered = useMemo(
    () => (activeCat === "all" ? items : items.filter((i) => i.category === activeCat)),
    [items, activeCat],
  )

  const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT)

  return (
    <section id="photography" className="max-w-7xl mx-auto px-6 py-20 md:py-28 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">{t.photo_label}</p>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground">{t.photo_title}</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setActiveCat(c.key)
                setExpanded(false)
              }}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                activeCat === c.key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground/70 hover:text-primary"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-foreground/50 py-16 text-center">{t.photo_empty}</p>
      ) : (
        <>
          <div className="columns-2 md:columns-3 gap-0 [&>*]:mb-0">
            {visible.map((item, idx) => (
              <figure
                key={item.id}
                className="relative break-inside-avoid overflow-hidden group"
                style={{ animation: `fadeUp 0.5s ease-out ${Math.min(idx, 8) * 0.05}s both` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.title ?? "Photograph"}
                  loading="lazy"
                  className="w-full h-auto align-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </figure>
            ))}
          </div>

          {filtered.length > INITIAL_COUNT && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setExpanded((e) => !e)}
                className="rounded-full border border-foreground/30 px-7 py-2.5 text-sm tracking-wide text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                {expanded ? t.photo_view_less : t.photo_view_all}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
