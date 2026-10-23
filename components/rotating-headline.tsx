"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type Lang = "cs" | "en"

const COPY: Record<Lang, { eyebrow: string; before: string; words: string[]; after: string }> = {
  cs: {
    eyebrow: "Fotografka & content creator · Praha",
    before: "Vaše",
    words: ["fotky", "video", "sociální sítě", "grafika"],
    after: "v dobrých rukou",
  },
  en: {
    eyebrow: "Photographer & content creator · Prague",
    before: "Your",
    words: ["photos", "video", "social media", "graphics"],
    after: "in good hands",
  },
}

const PRODUCTION_HOSTS = new Set([
  "filography.cz",
  "www.filography.cz",
  "filography.com",
  "www.filography.com",
])
const EVENTS_SITE_URL = "https://event-coverage-prague.vercel.app"

const INTERVAL_MS = 2800
const OUT = { duration: 350, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" } as const
const IN = { duration: 500, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" } as const

type RotatingHeadlineProps = {
  lang: Lang
  eyebrowClassName?: string
  headingClassName?: string
  rotatingClassName?: string
  trailing?: ReactNode
}

export function RotatingHeadline({
  lang,
  eyebrowClassName,
  headingClassName,
  rotatingClassName = "text-violet-400",
  trailing,
}: RotatingHeadlineProps) {
  const { eyebrow, before, words, after } = COPY[lang]
  const [index, setIndex] = useState(0)
  const [width, setWidth] = useState<number>()
  const [eventsHref, setEventsHref] = useState("/events")
  const wordRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (PRODUCTION_HOSTS.has(window.location.hostname.toLowerCase())) {
      setEventsHref(EVENTS_SITE_URL)
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const word = wordRef.current
    if (!word) return

    let alive = true
    let running: Animation | undefined

    const timer = window.setInterval(() => {
      running = word.animate(
        [
          { transform: "translateY(0)", opacity: 1 },
          { transform: "translateY(-100%)", opacity: 0 },
        ],
        OUT,
      )
      running.onfinish = () => {
        if (!alive) return
        setIndex((i) => (i + 1) % words.length)
      }
    }, INTERVAL_MS)

    return () => {
      alive = false
      window.clearInterval(timer)
      running?.cancel()
    }
  }, [words.length])

  useEffect(() => {
    const word = wordRef.current
    if (!word) return
    setWidth(word.offsetWidth)
    if (index === 0 && word.getAnimations().length === 0) return
    word.animate(
      [
        { transform: "translateY(100%)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ],
      IN,
    )
  }, [index, lang])

  const current = words[index % words.length]

  return (
    <>
      <p className={eyebrowClassName}>{eyebrow}</p>
      <h1 className={headingClassName}>
        <span className="sr-only">{`${before} ${words[0]} ${after}`}</span>
        <a
          href={eventsHref}
          aria-label="Event coverage"
          className="cursor-default text-inherit no-underline [-webkit-tap-highlight-color:transparent]"
        >
          {before.charAt(0)}
        </a>
        <span aria-hidden="true">
          {before.slice(1)}{" "}
          <span
            className="relative inline-block h-[1.15em] overflow-hidden align-bottom transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={width ? { width } : undefined}
          >
            <span
              ref={wordRef}
              className={`inline-block whitespace-nowrap leading-[1.15] ${rotatingClassName}`}
            >
              {current}
            </span>
          </span>
          <br />
          {after}
        </span>
        {trailing ?? <span aria-hidden="true">.</span>}
      </h1>
    </>
  )
}
