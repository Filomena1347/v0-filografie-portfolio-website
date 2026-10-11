"use client"

import { User } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import type { MediaItem } from "@/lib/media"

export function About({ photo }: { photo: MediaItem | null }) {
  const { t } = useLanguage()

  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-20 md:py-28 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
        <div className="w-full md:w-5/12">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-card">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.url || "/placeholder.svg"}
                alt={photo.title ?? "Filoména"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-foreground/40">
                <User className="h-10 w-10" aria-hidden="true" />
                <span className="text-sm">{t.about_photo_placeholder}</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-7/12">
          <p className="text-sm tracking-[0.2em] uppercase text-primary mb-3">{t.about_label}</p>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground text-balance">{t.about_title}</h2>
          <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-foreground/70 text-pretty">
            {t.about_bio}
          </p>
        </div>
      </div>
    </section>
  )
}
