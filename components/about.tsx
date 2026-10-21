"use client"

import { useLanguage } from "@/context/language-context"
import type { MediaItem } from "@/lib/media"

export function About({ photo }: { photo: MediaItem | null }) {
  const { t } = useLanguage()

  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-20 md:py-28 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
        <div className="w-full md:w-5/12">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo?.url || "/images/filomena.jpg"}
              alt={photo?.title ?? "Filoména"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-7/12">
          <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">{t.about_label}</p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground text-balance">{t.about_title}</h2>
          <div className="mt-6 flex max-w-xl flex-col gap-4 text-base md:text-lg leading-relaxed text-foreground/70 text-pretty">
            {t.about_bio.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
