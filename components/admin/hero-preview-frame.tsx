"use client"

import { useEffect, useState } from "react"
import { LanguageProvider, useLanguage, type Lang } from "@/context/language-context"
import { Navbar } from "@/components/navbar"
import { HeroIntro } from "@/components/hero-intro"
import type { HeroSlide } from "@/lib/hero-slides"

type HeroPreviewFrameProps = {
  slides: HeroSlide[]
  activeIndex: number
  initialLang: Lang
}

export function HeroPreviewFrame({ slides, activeIndex, initialLang }: HeroPreviewFrameProps) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <PreviewContent slides={slides} activeIndex={activeIndex} />
    </LanguageProvider>
  )
}

function PreviewContent({ slides, activeIndex }: Pick<HeroPreviewFrameProps, "slides" | "activeIndex">) {
  const { lang, setLang } = useLanguage()
  const [position, setPosition] = useState<string>()

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const data = event.data
      if (data?.type === "hero-preview-position" && typeof data.value === "string") setPosition(data.value)
      if (data?.type === "hero-preview-lang" && (data.value === "cs" || data.value === "en")) setLang(data.value)
    }
    window.addEventListener("message", onMessage)
    window.parent.postMessage({ type: "hero-preview-ready" }, window.location.origin)
    return () => window.removeEventListener("message", onMessage)
  }, [setLang])

  const previewSlides = slides.map((slide, i) =>
    i === activeIndex && position ? { ...slide, objectPosition: position } : slide,
  )

  return (
    <>
      <Navbar />
      <section className="relative bg-background">
        <HeroIntro slides={previewSlides} index={activeIndex} lang={lang} />
      </section>
    </>
  )
}
