"use client"

import { useLanguage } from "@/context/language-context"
import type { MediaItem } from "@/lib/media"

export function About({ photo }: { photo: MediaItem | null }) {
  const { t } = useLanguage()

  return (
    <section
      id="about"
      className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-20 md:py-28 scroll-mt-20"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-12 md:flex-row md:gap-20 lg:gap-28">
        <div className="w-full max-w-[260px] shrink-0 md:w-[300px] md:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo?.url || "/images/filomena.jpg"}
              alt={photo?.title ?? "Filoména"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="w-full max-w-xl text-center md:text-left">
          <p className="mb-4 text-xs tracking-[0.25em] uppercase text-primary">{t.about_label}</p>
          <h2 className="font-serif text-2xl md:text-3xl leading-snug text-foreground text-balance">{t.about_title}</h2>
          <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-foreground/70 text-pretty">
            {t.about_bio.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
