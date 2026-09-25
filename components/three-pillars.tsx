"use client"

import Image from "next/image"
import { useLanguage } from "@/context/language-context"

export function ThreePillars() {
  const { t } = useLanguage()

  const pillars = [
    {
      href: "#photography",
      img: "/images/pillar-photography.png",
      title: t.pillar_photo_title,
      desc: t.pillar_photo_desc,
    },
    {
      href: "#video",
      img: "/images/pillar-video.png",
      title: t.pillar_video_title,
      desc: t.pillar_video_desc,
    },
    {
      href: "#content",
      img: "/images/pillar-content.png",
      title: t.pillar_content_title,
      desc: t.pillar_content_desc,
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
      <p className="text-sm tracking-[0.2em] uppercase text-primary mb-10">{t.pillars_label}</p>

      <div className="grid gap-5 md:grid-cols-3">
        {pillars.map((p) => (
          <a key={p.href} href={p.href} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
              <Image
                src={p.img || "/placeholder.svg"}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="font-serif text-3xl text-background">{p.title}</h3>
                <p className="mt-1 text-sm text-background/80">{p.desc}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
