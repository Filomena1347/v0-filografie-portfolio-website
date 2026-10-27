"use client"

import { AdminLoginDot } from "@/components/admin-login-dialog"
import { RotatingHeadline } from "@/components/rotating-headline"
import { HeroSlideDashes, HeroSlideImages } from "@/components/hero-slideshow"
import type { HeroSlide } from "@/lib/hero-slides"

type HeroIntroProps = {
  slides: HeroSlide[]
  index: number
  lang: "cs" | "en"
}

/**
 * Mobile: full-width 1:1 square photo (image only) from the top of the page, with the text block and dots below it.
 * Desktop: headline only. Shared by the homepage and the admin crop-editor preview.
 */
export function HeroIntro({ slides, index, lang }: HeroIntroProps) {
  const hasSlides = slides.length > 0

  return (
    <div className={hasSlides ? undefined : "px-6 md:px-0"}>
      {hasSlides && (
        <div className="relative aspect-square w-full overflow-hidden md:hidden">
          <HeroSlideImages slides={slides} index={index} lang={lang} />
        </div>
      )}
      <div className={hasSlides ? "bg-background px-5 pb-5 pt-5 md:bg-transparent md:p-0" : undefined}>
        <RotatingHeadline
          lang={lang}
          eyebrowClassName={
            hasSlides
              ? "mb-2 font-sans text-xs tracking-[0.02em] text-[#D4D4D8] md:mb-0 md:font-serif md:text-xl md:tracking-normal md:text-foreground/60"
              : "font-serif text-lg md:text-xl text-foreground/60"
          }
          headingClassName={
            hasSlides
              ? "font-serif text-[33px] font-normal leading-[1.12] whitespace-nowrap text-balance text-[#F4F4F5] max-w-3xl md:mt-2 md:text-7xl md:leading-[0.95] md:whitespace-normal md:text-foreground"
              : "mt-2 font-serif text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-balance text-foreground max-w-3xl"
          }
          trailing={<AdminLoginDot />}
        />
        {hasSlides && (
          <div className="md:hidden">
            <HeroSlideDashes count={slides.length} index={index} />
          </div>
        )}
      </div>
    </div>
  )
}
