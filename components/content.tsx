"use client"

import Image from "next/image"
import { useLanguage } from "@/context/language-context"
import type { MediaItem } from "@/lib/media"

export function Content({ items }: { items: MediaItem[] }) {
  const { t } = useLanguage()

  return (
    <section id="content" className="max-w-7xl mx-auto px-6 py-20 md:py-28 scroll-mt-20">
      <div className="max-w-2xl mb-12">
        <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">{t.content_label}</p>
        <h2 className="font-serif text-4xl md:text-6xl text-foreground">{t.content_title}</h2>
        <p className="mt-4 text-foreground/60 leading-relaxed">{t.content_desc}</p>
      </div>

      {items.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-lg bg-muted flex items-center justify-center text-foreground/30 text-sm text-center px-4"
            >
              {i === 0 ? t.content_empty : ""}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted group">
              {item.type === "video" ? (
                <video
                  src={item.url}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                />
              ) : (
                <Image
                  src={item.url || "/placeholder.svg"}
                  alt={item.title ?? "Content"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
