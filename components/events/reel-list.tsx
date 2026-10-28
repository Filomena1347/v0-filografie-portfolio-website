'use client'

import { useEffect, useRef, useState } from 'react'
import { CloudImage } from "@/components/cloud-image"
import { Play } from 'lucide-react'
import type { EventVideo } from '@/lib/events-data'

type ReelProps = {
  video: EventVideo
  active: boolean
  onActivate: (id: string) => void
  priority?: boolean
}

function Reel({ video, active, onActivate, priority }: ReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasSource = Boolean(video.src)

  useEffect(() => {
    const element = videoRef.current
    if (!element) return
    if (active) {
      element.play().catch(() => {})
    } else {
      element.pause()
    }
  }, [active])

  return (
    <li className="relative aspect-[9/16] overflow-hidden rounded-[4px] bg-ev-soft">
      {hasSource && (
        <video
          ref={videoRef}
          src={video.src}
          preload="metadata"
          playsInline
          controls={active}
          onPlay={() => onActivate(video.id)}
          aria-label={video.title}
          className={`absolute inset-0 size-full object-cover ${active ? '' : 'invisible'}`}
        />
      )}

      {!active && (
        <>
          <CloudImage
            src={video.poster.src}
            alt=""
            width={video.poster.width}
            height={video.poster.height}
            sizes="(min-width: 480px) 420px, 100vw"
            priority={priority}
            className="absolute inset-0 size-full object-cover"
          />
          <button
            type="button"
            onClick={() => onActivate(video.id)}
            disabled={!hasSource}
            aria-label={`Play video: ${video.title}`}
            className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-white text-ev-text shadow-[0_2px_16px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:scale-105 focus-visible:scale-105 disabled:cursor-default disabled:hover:scale-100"
          >
            <Play aria-hidden="true" className="ml-0.5 size-6 fill-current" />
          </button>
        </>
      )}

      <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.12em] text-ev-text">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-ev-accent" />
        Reel
      </span>
    </li>
  )
}

export function ReelList({ videos }: { videos: EventVideo[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <ul className="flex flex-col gap-4">
      {videos.map((video, index) => (
        <Reel
          key={video.id}
          video={video}
          active={activeId === video.id}
          onActivate={setActiveId}
          priority={index === 0}
        />
      ))}
    </ul>
  )
}
