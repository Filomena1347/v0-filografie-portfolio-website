"use client"

import Image from "next/image"
import { useLanguage } from "@/context/language-context"

export function Hero() {
  const { t } = useLanguage()
  const tags = [t.hero_tag_photo, t.hero_tag_video, t.hero_tag_content]

  return (
    <section id="top" className="relative min-h-screen flex items-end overflow-hidden">
      <Image
        src="/images/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto w-full px-6 pb-20 md:pb-28">
        <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl leading-[0.95] text-balance text-foreground max-w-4xl">
          {t.hero_title}
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-foreground/25 px-4 py-1.5 text-sm tracking-wide text-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 hidden md:block">
        <span
          className="text-xs tracking-[0.2em] text-foreground/50 uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          {t.hero_scroll}
        </span>
      </div>
    </section>
  )
}
