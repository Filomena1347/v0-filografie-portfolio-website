"use client"

import { CloudImage } from "@/components/cloud-image"
import { useEffect, useState } from "react"
import type { HeroSlide } from "@/lib/hero-slides"

const SLIDE_INTERVAL_MS = 5000

export function useHeroSlideIndex(count: number) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (count < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [count])

  return count > 0 ? index % count : 0
}

type SlideImagesProps = {
  slides: HeroSlide[]
  index: number
  lang: "cs" | "en"
}

export function HeroSlideImages({ slides, index, lang }: SlideImagesProps) {
  return (
    <>
      {slides.map((slide, i) => {
        const alt = (lang === "en" ? slide.altEn || slide.altCs : slide.altCs || slide.altEn) || ""
        const isActive = i === index
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <CloudImage
              src={slide.src}
              alt={alt}
              fill
              priority={i === 0}
              sizes="100vw"
              maxWidth={1200}
              className="object-cover"
              style={{ objectPosition: slide.objectPosition }}
            />
          </div>
        )
      })}
    </>
  )
}

export function HeroSlideDashes({ count, index }: { count: number; index: number }) {
  return (
    <div className="mt-[14px] flex items-center gap-[5px]" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`h-[2px] w-5 rounded-full transition-colors duration-500 ${
            i === index ? "bg-foreground" : "bg-foreground/30"
          }`}
        />
      ))}
    </div>
  )
}
