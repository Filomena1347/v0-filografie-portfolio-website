"use client"

import { useEffect, useRef, useState } from "react"
import { JustifiedGrid, useItemRatios } from "@/components/justified-grid"
import type { MediaItem } from "@/lib/media"

type InlineGalleryProps = {
  items: MediaItem[]
  emptyLabel: string
  animationKey: string
  /** "masonry" flows photos into columns by height; "justified" keeps the row layout used for Eventy. */
  layout?: "masonry" | "justified"
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

function MasonryImage({ item }: { item: MediaItem }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) setLoaded(true)
  }, [item.id])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={item.url || "/placeholder.svg"}
      alt={item.title ?? ""}
      width={item.width ?? undefined}
      height={item.height ?? undefined}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={`block h-auto w-full transition-[opacity,transform,filter] duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.03] group-hover:brightness-105 motion-reduce:group-hover:scale-100 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  )
}

function RevealFigure({
  item,
  index,
  children,
}: {
  item: MediaItem
  index: number
  children: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <figure
      ref={ref}
      className={`group relative mb-[5px] overflow-hidden bg-muted break-inside-avoid transition-[opacity,transform] duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
      style={{
        ...(item.width && item.height ? { aspectRatio: item.width / item.height } : null),
        // Small column-based stagger so photos entering together still cascade.
        transitionDelay: visible ? `${(index % 5) * 60}ms` : "0ms",
      }}
    >
      {children}
    </figure>
  )
}

function MasonryGrid({ items }: { items: MediaItem[] }) {
  return (
    <div className="columns-2 gap-[5px] md:columns-3 lg:columns-5">
      {items.map((item, index) => (
        <RevealFigure key={item.id} item={item} index={index}>
          {item.type === "video" ? (
            <video
              src={item.url}
              poster={item.thumbnail_url ?? undefined}
              controls
              playsInline
              preload="metadata"
              className="block h-auto w-full"
            />
          ) : (
            <MasonryImage item={item} />
          )}
        </RevealFigure>
      ))}
    </div>
  )
}

export function InlineGallery({ items, emptyLabel, animationKey, layout = "justified" }: InlineGalleryProps) {
  const { getRatio, reportSize } = useItemRatios()

  return (
    <div key={animationKey} className="bg-background" style={{ animation: "fadeUp 0.6s ease both" }}>
      {items.length === 0 ? (
        <p className="py-20 text-center text-sm text-foreground/60">{emptyLabel}</p>
      ) : layout === "masonry" ? (
        <MasonryGrid items={items} />
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
