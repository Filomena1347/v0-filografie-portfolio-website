"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { CloudImage } from "@/components/cloud-image"
import { JustifiedGrid, useItemRatios } from "@/components/justified-grid"
import type { MediaItem } from "@/lib/media"

const GALLERY_SIZES = "(max-width: 768px) 50vw, 20vw"
// A wide tile spans two of the five desktop columns.
const WIDE_GALLERY_SIZES = "(max-width: 768px) 50vw, 40vw"

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
      <CloudImage
        ref={imgRef}
        src={item.url || "/placeholder.svg"}
        alt={item.title ?? ""}
        fill
        sizes={GALLERY_SIZES}
        onLoad={(e) => {
          onSize(item.id, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
          setLoaded(true)
        }}
        onError={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  )
}

// Photos touch each other like on the reference collage. Raise this to add a gap (in px).
export const MASONRY_GAP = 0

function columnCountFor(viewportWidth: number) {
  if (viewportWidth >= 1024) return 5
  if (viewportWidth >= 768) return 3
  return 2
}

export function itemRatio(item: MediaItem) {
  if (item.width && item.height) return item.width / item.height
  return item.type === "video" ? 16 / 9 : 4 / 5
}

/** Height of one implicit grid row; tiles span as many rows as their photo needs. */
export const GRID_ROW_UNIT = 4

/** Wide photos need room for two columns; on phones (2 columns) every photo stays 1 column. */
const MIN_COLUMNS_FOR_WIDE = 3

/** Portrait photos marked wide are cropped to this ratio instead of becoming very tall. */
const WIDE_FALLBACK_RATIO = 16 / 9

export type GridTile = { item: MediaItem; colSpan: number; rowSpan: number }

/**
 * CSS Grid masonry: the grid has `cols` equal columns and tiny rows, and every tile spans the
 * rows its aspect ratio needs. Wide photos span 2 columns and keep their natural landscape ratio.
 */
export function buildGridTiles(items: MediaItem[], cols: number, width: number): GridTile[] {
  const columnWidth = (width - MASONRY_GAP * (cols - 1)) / cols

  return items.map((item) => {
    const colSpan = item.is_wide && cols >= MIN_COLUMNS_FOR_WIDE ? 2 : 1
    const ratio = itemRatio(item)
    const tileRatio = colSpan === 2 ? (ratio >= 1 ? ratio : WIDE_FALLBACK_RATIO) : ratio
    const tileWidth = columnWidth * colSpan + MASONRY_GAP * (colSpan - 1)
    const tileHeight = tileWidth / tileRatio
    const rowSpan = Math.max(1, Math.round((tileHeight + MASONRY_GAP) / (GRID_ROW_UNIT + MASONRY_GAP)))
    return { item, colSpan, rowSpan }
  })
}

export function masonryGridStyle(cols: number): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridAutoRows: `${GRID_ROW_UNIT}px`,
    // Dense packing lets later photos fill the hole a wide photo leaves behind.
    gridAutoFlow: "dense",
    gap: MASONRY_GAP,
  }
}

export function tilePlacement(tile: Pick<GridTile, "colSpan" | "rowSpan">): React.CSSProperties {
  return { gridColumn: `span ${tile.colSpan}`, gridRow: `span ${tile.rowSpan}` }
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

function MasonryImage({ item, wide }: { item: MediaItem; wide: boolean }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) setLoaded(true)
  }, [item.id])

  return (
    <CloudImage
      ref={imgRef}
      src={item.url || "/placeholder.svg"}
      alt={item.title ?? ""}
      fill
      sizes={wide ? WIDE_GALLERY_SIZES : GALLERY_SIZES}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={`object-cover transition-[opacity,transform,filter] duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.03] group-hover:brightness-105 motion-reduce:group-hover:scale-100 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  )
}

function RevealFigure({
  tile,
  delayIndex,
  children,
}: {
  tile: GridTile
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
      className={`group relative min-w-0 overflow-hidden bg-muted transition-[opacity,transform] duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
      style={{
        ...tilePlacement(tile),
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
  const tiles = width > 0 ? buildGridTiles(items, cols, width) : []

  return (
    <div ref={containerRef} className="w-full" style={masonryGridStyle(cols)}>
      {tiles.map((tile, index) => (
        <RevealFigure key={tile.item.id} tile={tile} delayIndex={index % cols}>
          {tile.item.type === "video" ? (
            <video
              src={tile.item.url}
              poster={tile.item.thumbnail_url ?? undefined}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 block h-full w-full object-cover"
            />
          ) : (
            <MasonryImage item={tile.item} wide={tile.colSpan === 2} />
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
