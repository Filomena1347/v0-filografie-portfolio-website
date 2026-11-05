"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { useLanguage } from "@/context/language-context"

// One shared registry so every video on the page follows the same rule: only one plays at a time.
const visibleRatios = new Map<HTMLVideoElement, number>()
const pausedByVisitor = new WeakSet<HTMLVideoElement>()
let currentlyPlaying: HTMLVideoElement | null = null
let sharedObserver: IntersectionObserver | null = null

const PLAY_RATIO = 0.55
const OUT_OF_VIEW_RATIO = 0.2

function startPlaying(video: HTMLVideoElement) {
  if (currentlyPlaying && currentlyPlaying !== video) currentlyPlaying.pause()
  currentlyPlaying = video
  video.muted = true
  video.play().catch(() => {
    if (currentlyPlaying === video) currentlyPlaying = null
  })
}

function canAutoplay(video: HTMLVideoElement) {
  return (visibleRatios.get(video) ?? 0) >= PLAY_RATIO && !pausedByVisitor.has(video)
}

function reconcile() {
  if (currentlyPlaying && canAutoplay(currentlyPlaying)) return

  let best: HTMLVideoElement | null = null
  let bestRatio = 0
  for (const [video, ratio] of visibleRatios) {
    if (canAutoplay(video) && ratio > bestRatio) {
      best = video
      bestRatio = ratio
    }
  }

  if (best) {
    startPlaying(best)
  } else if (currentlyPlaying && (visibleRatios.get(currentlyPlaying) ?? 0) < OUT_OF_VIEW_RATIO) {
    currentlyPlaying.pause()
  }
}

function getObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement
          visibleRatios.set(video, entry.isIntersecting ? entry.intersectionRatio : 0)
          if (!entry.isIntersecting) pausedByVisitor.delete(video)
        }
        reconcile()
      },
      { threshold: [0, 0.2, 0.4, 0.55, 0.7, 0.85, 1] },
    )
  }
  return sharedObserver
}

type AutoplayVideoProps = {
  src: string
  poster?: string | null
  fit?: "cover" | "contain"
  className?: string
  onLoadedMetadata?: (video: HTMLVideoElement) => void
}

export function AutoplayVideo({ src, poster, fit = "cover", className = "", onLoadedMetadata }: AutoplayVideoProps) {
  const { lang } = useLanguage()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const observer = getObserver()
    visibleRatios.set(video, 0)
    observer.observe(video)

    return () => {
      observer.unobserve(video)
      visibleRatios.delete(video)
      if (currentlyPlaying === video) currentlyPlaying = null
    }
  }, [])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      pausedByVisitor.delete(video)
      startPlaying(video)
    } else {
      pausedByVisitor.add(video)
      video.pause()
    }
  }

  const label =
    lang === "cs" ? (playing ? "Pozastavit video" : "Přehrát video") : playing ? "Pause video" : "Play video"

  return (
    <div className={`absolute inset-0 ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={(e) => {
          const video = e.currentTarget
          if (currentlyPlaying && currentlyPlaying !== video) currentlyPlaying.pause()
          currentlyPlaying = video
          setPlaying(true)
        }}
        onPause={(e) => {
          if (currentlyPlaying === e.currentTarget) currentlyPlaying = null
          setPlaying(false)
        }}
        onLoadedMetadata={(e) => onLoadedMetadata?.(e.currentTarget)}
        className={`block h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
      />
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={label}
        className="group/play absolute inset-0 flex items-center justify-center focus-visible:outline-none"
      >
        <span
          aria-hidden="true"
          className={`flex size-16 items-center justify-center rounded-full bg-foreground/45 text-background backdrop-blur-sm transition-[opacity,transform] duration-200 group-hover/play:scale-105 group-focus-visible/play:ring-2 group-focus-visible/play:ring-background md:size-20 ${
            playing ? "pointer-events-none scale-90 opacity-0" : "opacity-100"
          }`}
        >
          {playing ? (
            <Pause className="size-7 fill-current md:size-8" />
          ) : (
            <Play className="ml-1 size-7 fill-current md:size-8" />
          )}
        </span>
      </button>
    </div>
  )
}
