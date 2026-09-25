"use client"

import { useLanguage } from "@/context/language-context"
import type { MediaItem } from "@/lib/media"

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative shrink-0 w-[240px] snap-center">
      <div className="relative rounded-[2rem] border border-border bg-card p-2 shadow-sm">
        <div className="relative aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-muted">
          {children}
        </div>
      </div>
    </div>
  )
}

export function Video({ items }: { items: MediaItem[] }) {
  const { t } = useLanguage()

  const frames = items.length > 0 ? items : []

  return (
    <section id="video" className="py-20 md:py-28 scroll-mt-20 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">{t.video_label}</p>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground">{t.video_title}</h2>
          <p className="mt-2 text-foreground/60">{t.video_sub}</p>
        </div>

        {frames.length === 0 ? (
          <div className="flex gap-5 overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <PhoneFrame key={i}>
                <div className="flex h-full items-center justify-center text-foreground/30 text-sm px-4 text-center">
                  {i === 0 ? t.video_empty : ""}
                </div>
              </PhoneFrame>
            ))}
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {frames.map((item) => (
              <PhoneFrame key={item.id}>
                <video
                  src={item.url}
                  poster={item.thumbnail_url ?? undefined}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                />
              </PhoneFrame>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
