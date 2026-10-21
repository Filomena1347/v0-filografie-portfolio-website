"use client"

import { useEffect, useRef, useState } from "react"
import type { MediaItem } from "@/lib/media"

type InlineGalleryProps = {
  items: MediaItem[]
  emptyLabel: string
  animationKey: string
}

function GalleryImage({ item }: { item: MediaItem }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  // Images already in the browser cache can finish before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])

  const ratio = item.width && item.height ? `${item.width} / ${item.height}` : "4 / 5"

  return (
    // The placeholder reserves the photo's real aspect ratio so the grid doesn't jump while images arrive.
    <div
      className="relative break-inside-avoid overflow-hidden bg-muted"
      style={loaded ? undefined : { aspectRatio: ratio }}
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-foreground/5" aria-hidden="true" />}
      {/* Natural aspect ratio is unknown for older uploads, so a plain img keeps photos uncropped. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={item.url || "/placeholder.svg"}
        alt={item.title ?? ""}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`block h-auto w-full object-contain transition-opacity duration-700 ease-out motion-reduce:transition-none ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}

export function InlineGallery({ items, emptyLabel, animationKey }: InlineGalleryProps) {
  return (
    <div
      key={animationKey}
      className="bg-background"
      style={{ animation: "fadeUp 0.6s ease both" }}
    >
      {items.length === 0 ? (
        <p className="py-20 text-center text-sm text-foreground/60">{emptyLabel}</p>
      ) : (
        <div className="columns-2 gap-0 md:columns-4">
          {items.map((item) =>
            item.type === "video" ? (
              <video
                key={item.id}
                src={item.url}
                poster={item.thumbnail_url ?? undefined}
                controls
                playsInline
                preload="metadata"
                className="block h-auto w-full break-inside-avoid object-contain"
              />
            ) : (
              <GalleryImage key={item.id} item={item} />
            ),
          )}
        </div>
      )}
    </div>
  )
}
