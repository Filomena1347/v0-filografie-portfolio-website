"use client"

import { useEffect, useRef, useState } from "react"
import { JustifiedGrid, useItemRatios } from "@/components/justified-grid"
import type { MediaItem } from "@/lib/media"

type InlineGalleryProps = {
  items: MediaItem[]
  emptyLabel: string
  animationKey: string
}

function GalleryImage({
  item,
  onSize,
}: {
  item: MediaItem
  onSize: (id: string, width: number, height: number) => void
}) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  // Images already in the browser cache can finish before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      onSize(item.id, img.naturalWidth, img.naturalHeight)
      setLoaded(true)
    }
  }, [item.id, onSize])

  return (
    <>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-foreground/5" aria-hidden="true" />}
      {/* The surrounding box already has the photo's aspect ratio, so cover never crops it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={item.url || "/placeholder.svg"}
        alt={item.title ?? ""}
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          onSize(item.id, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
          setLoaded(true)
        }}
        onError={() => setLoaded(true)}
        className={`absolute inset-0 block h-full w-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  )
}

export function InlineGallery({ items, emptyLabel, animationKey }: InlineGalleryProps) {
  const { getRatio, reportSize } = useItemRatios()

  return (
    <div key={animationKey} className="bg-background" style={{ animation: "fadeUp 0.6s ease both" }}>
      {items.length === 0 ? (
        <p className="py-20 text-center text-sm text-foreground/60">{emptyLabel}</p>
      ) : (
        <JustifiedGrid
          items={items}
          getKey={(item) => item.id}
          getRatio={getRatio}
          renderItem={(item, _index, boxStyle) => (
            <div key={item.id} className="relative min-w-0 overflow-hidden bg-muted" style={boxStyle}>
              {item.type === "video" ? (
                <video
                  src={item.url}
                  poster={item.thumbnail_url ?? undefined}
                  controls
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(e) =>
                    reportSize(item.id, e.currentTarget.videoWidth, e.currentTarget.videoHeight)
                  }
                  className="absolute inset-0 block h-full w-full object-contain"
                />
              ) : (
                <GalleryImage item={item} onSize={reportSize} />
              )}
            </div>
          )}
        />
      )}
    </div>
  )
}
