"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
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

// Photos touch each other like on the reference collage. Raise this to add a gap (in px).
const MASONRY_GAP = 0

function columnCountFor(viewportWidth: number) {
  if (viewportWidth >= 1024) return 5
  if (viewportWidth >= 768) return 3
  return 2
}

function itemRatio(item: MediaItem) {
  if (item.width && item.height) return item.width / item.height
  return item.type === "video" ? 16 / 9 : 4 / 5
}

type MasonryTile = { item: MediaItem; height: number }

/**
 * Drops every item into the currently shortest column (true masonry), then trims or stretches
 * the last tile of each column so all columns end on the same bottom edge.
 */
function buildMasonryColumns(items: MediaItem[], cols: number, width: number): MasonryTile[][] {
  const columnWidth = (width - MASONRY_GAP * (cols - 1)) / cols
  const columns = Array.from({ length: cols }, () => ({ tiles: [] as MasonryTile[], height: 0 }))

  for (const item of items) {
    const tileHeight = columnWidth / itemRatio(item)
    let shortest = columns[0]
    for (const column of columns) if (column.height < shortest.height) shortest = column
    shortest.height += (shortest.tiles.length > 0 ? MASONRY_GAP : 0) + tileHeight
    shortest.tiles.push({ item, height: tileHeight })
  }

  if (items.length >= cols * 2) {
    const target = columns.reduce((sum, column) => sum + column.height, 0) / cols
    for (const column of columns) {
      const last = column.tiles[column.tiles.length - 1]
      if (!last) continue
      const fitted = target - (column.height - last.height)
      if (fitted >= last.height * 0.4 && fitted <= last.height * 1.6) last.height = fitted
    }
  }

  return columns.map((column) => column.tiles)
}

function useMasonryMetrics(ref: React.RefObject<HTMLDivElement | null>) {
  const [metrics, setMetrics] = useState({ width: 0, cols: 5 })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const width = el.clientWidth
      const cols = columnCountFor(window.innerWidth)
      setMetrics((prev) => (prev.width === width && prev.cols === cols ? prev : { width, cols }))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [ref])

  return metrics
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
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={`absolute inset-0 block h-full w-full object-cover transition-[opacity,transform,filter] duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.03] group-hover:brightness-105 motion-reduce:group-hover:scale-100 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  )
}

function RevealFigure({
  height,
  delayIndex,
  children,
}: {
  height: number
  delayIndex: number
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
      className={`group relative w-full shrink-0 overflow-hidden bg-muted transition-[opacity,transform] duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
      style={{
        height,
        // Small column-based stagger so photos entering together still cascade.
        transitionDelay: visible ? `${delayIndex * 60}ms` : "0ms",
      }}
    >
      {children}
    </figure>
  )
}

function MasonryGrid({ items }: { items: MediaItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, cols } = useMasonryMetrics(containerRef)
  const columns = width > 0 ? buildMasonryColumns(items, cols, width) : []

  return (
    <div ref={containerRef} className="flex w-full items-start" style={{ gap: MASONRY_GAP }}>
      {columns.map((tiles, columnIndex) => (
        <div
          key={columnIndex}
          className="flex min-w-0 flex-1 flex-col"
          style={{ gap: MASONRY_GAP }}
        >
          {tiles.map(({ item, height }) => (
            <RevealFigure key={item.id} height={height} delayIndex={columnIndex}>
              {item.type === "video" ? (
                <video
                  src={item.url}
                  poster={item.thumbnail_url ?? undefined}
                  controls
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 block h-full w-full object-cover"
                />
              ) : (
                <MasonryImage item={item} />
              )}
            </RevealFigure>
          ))}
        </div>
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
