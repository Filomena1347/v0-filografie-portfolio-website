"use client"

import { useEffect, useRef, useState } from "react"
import type { MediaItem } from "@/lib/media"

type InlineGalleryProps = {
  items: MediaItem[]
  emptyLabel: string
  animationKey: string
  /** On mobile, landscape photos break out of the 2-column grid and take a full-width row. */
  landscapeFullWidthOnMobile?: boolean
}

function GalleryImage({
  item,
  landscapeFullWidthOnMobile,
}: {
  item: MediaItem
  landscapeFullWidthOnMobile: boolean
}) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [measuredLandscape, setMeasuredLandscape] = useState(false)

  const measure = (img: HTMLImageElement) => {
    if (img.naturalWidth > 0) setMeasuredLandscape(img.naturalWidth > img.naturalHeight)
  }

  // Images already in the browser cache can finish before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      measure(img)
      setLoaded(true)
    }
  }, [])

  const hasSize = Boolean(item.width && item.height)
  const ratio = hasSize ? `${item.width} / ${item.height}` : "4 / 5"
  // Older uploads have no stored size, so fall back to the size measured once the image loads.
  const isLandscape = hasSize ? (item.width as number) > (item.height as number) : measuredLandscape

  return (
    // The placeholder reserves the photo's real aspect ratio so the grid doesn't jump while images arrive.
    <div
      className={`relative break-inside-avoid overflow-hidden bg-muted ${
        landscapeFullWidthOnMobile && isLandscape ? "max-md:[column-span:all]" : ""
      }`}
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
        onLoad={(e) => {
          measure(e.currentTarget)
          setLoaded(true)
        }}
        onError={() => setLoaded(true)}
        className={`block h-auto w-full object-contain transition-opacity duration-700 ease-out motion-reduce:transition-none ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}

export function InlineGallery({
  items,
  emptyLabel,
  animationKey,
  landscapeFullWidthOnMobile = false,
}: InlineGalleryProps) {
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
              <GalleryImage
                key={item.id}
                item={item}
                landscapeFullWidthOnMobile={landscapeFullWidthOnMobile}
              />
            ),
          )}
        </div>
      )}
    </div>
  )
}
