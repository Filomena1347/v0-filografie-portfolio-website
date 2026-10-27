"use client"

import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { ChevronsUp, Eye, EyeOff, GripVertical, ImagePlus, LayoutGrid, RectangleHorizontal, Undo2, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { PositionInput } from "@/components/admin/position-input"
import { buildGridTiles, masonryGridStyle, tilePlacement } from "@/components/inline-gallery"
import type { MediaItem } from "@/lib/media"

/** Width of a phone preview; the public gallery shows 2 columns below 768px. */
const MOBILE_PREVIEW_WIDTH = 390

type GalleryGridProps = {
  items: MediaItem[]
  /** Exactly how many columns the preview shows: 5 for the desktop gallery, 2 for the mobile one. */
  columns: number
  onDragStart: (id: string) => void
  onDragOver: (e: React.DragEvent, id: string) => void
  dropTargetId: string | null
  onDrop: (targetId: string) => void
  onDragEnd: () => void
  onTogglePublished: (item: MediaItem) => void
  onEditThumbnail: (id: string) => void
  onDelete: (id: string) => void
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onMoveToStart: (id: string) => void
  onMoveToPosition: (id: string, position: number) => void
  /** In the "Vše" view the remove button only hides the item from "Vše" instead of deleting it. */
  isAllView: boolean
  onToggleShowInVse: (item: MediaItem) => void
  /** Flips the "Wide / Široká" flag: a wide photo spans 2 columns in the desktop gallery. */
  onToggleWide: (item: MediaItem) => void
}

const overlayButton =
  "flex h-7 w-7 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur-sm transition-colors"

export function GalleryGrid({
  items,
  columns: columnCount,
  onDragStart,
  onDragOver,
  dropTargetId,
  onDrop,
  onDragEnd,
  onTogglePublished,
  onEditThumbnail,
  onDelete,
  selectedIds,
  onToggleSelect,
  onMoveToStart,
  onMoveToPosition,
  isAllView,
  onToggleShowInVse,
  onToggleWide,
}: GalleryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const draggingIndex = draggingId ? items.findIndex((i) => i.id === draggingId) : -1
  // Only the "Vše" view dims hidden photos; in their own category they look normal.
  const isHiddenInAll = (item: MediaItem) => isAllView && item.show_in_vse === false
  const isMobilePreview = columnCount <= 2

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setWidth((prev) => (Math.abs(prev - el.clientWidth) >= 1 ? el.clientWidth : prev))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const indexById = useMemo(() => new Map(items.map((item, index) => [item.id, index])), [items])
  const tiles = useMemo(
    () => (width > 0 ? buildGridTiles(items, columnCount, width) : []),
    [items, columnCount, width],
  )

  return (
    <div
      ref={containerRef}
      className={`w-full ${isMobilePreview ? "mx-auto ring-1 ring-border" : ""}`}
      style={isMobilePreview ? { maxWidth: MOBILE_PREVIEW_WIDTH } : undefined}
    >
      <div className="w-full" style={masonryGridStyle(columnCount)}>
        {tiles.map((tile) => {
          const { item } = tile
          const index = indexById.get(item.id) ?? 0
          return (
            <div
              key={item.id}
              style={tilePlacement(tile)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move"
                setDraggingId(item.id)
                onDragStart(item.id)
              }}
              onDragOver={(e) => onDragOver(e, item.id)}
              onDrop={(e) => {
                e.preventDefault()
                onDrop(item.id)
              }}
              onDragEnd={() => {
                setDraggingId(null)
                onDragEnd()
              }}
              className={`group relative min-w-0 overflow-hidden bg-muted transition-opacity ${
                draggingId === item.id ? "opacity-40" : ""
              }`}
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  poster={item.thumbnail_url ?? undefined}
                  muted
                  playsInline
                  preload="metadata"
                  className={`pointer-events-none absolute inset-0 block h-full w-full object-cover ${
                    isHiddenInAll(item) ? "opacity-40" : ""
                  }`}
                />
              ) : (
                // The tile height comes from the photo's ratio, so cover matches the public gallery.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.title ?? ""}
                  loading="lazy"
                  draggable={false}
                  className={`absolute inset-0 block h-full w-full object-cover ${
                    isHiddenInAll(item) ? "opacity-40" : ""
                  }`}
                />
              )}

              {isHiddenInAll(item) && (
                <span className="pointer-events-none absolute inset-0 bg-muted-foreground/30" />
              )}

              {(!item.published || isHiddenInAll(item) || (item.is_wide && !isMobilePreview)) && (
                <div className="absolute bottom-2 left-2 flex flex-col items-start gap-1">
                  {item.is_wide && !isMobilePreview && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      Široká
                    </span>
                  )}
                  {!item.published && (
                    <span className="rounded-full bg-background/85 px-2 py-0.5 text-xs text-foreground/70">
                      Hidden
                    </span>
                  )}
                  {isHiddenInAll(item) && (
                    <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-medium text-background">
                      Skryto ve Vše
                    </span>
                  )}
                </div>
              )}

              {dropTargetId === item.id && (
                <>
                  <span className="pointer-events-none absolute inset-0 z-20 bg-primary/10 ring-4 ring-inset ring-primary" />
                  <span
                    className={`pointer-events-none absolute inset-x-0 z-20 h-2 bg-primary ${
                      draggingIndex !== -1 && draggingIndex < index ? "bottom-0" : "top-0"
                    }`}
                  />
                  <span className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-9 min-w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary px-2 text-sm font-medium text-primary-foreground">
                    {index + 1}
                  </span>
                </>
              )}

              {selectedIds.has(item.id) && (
                <span className="pointer-events-none absolute inset-0 bg-primary/10 ring-4 ring-inset ring-primary" />
              )}

              <Checkbox
                checked={selectedIds.has(item.id)}
                onCheckedChange={() => onToggleSelect(item.id)}
                aria-label={`Vybrat ${item.title ?? item.public_id}`}
                className="absolute left-2 top-2 z-10 h-6 w-6 border-2 border-primary bg-background/90 backdrop-blur-sm data-[state=checked]:bg-primary"
              />

              <div className="absolute inset-0 flex flex-wrap content-start items-start justify-between gap-1 p-2 pl-11 opacity-0 ring-2 ring-inset ring-primary transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <span
                  className={`${overlayButton} cursor-grab active:cursor-grabbing`}
                  aria-hidden="true"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-4 w-4" />
                </span>

                <div className="flex flex-wrap justify-end gap-1">
                  {item.type === "video" && (
                    <button
                      type="button"
                      onClick={() => onEditThumbnail(item.id)}
                      title="Edit thumbnail"
                      aria-label="Edit thumbnail"
                      className={`${overlayButton} hover:text-primary`}
                    >
                      <ImagePlus className="h-4 w-4" />
                    </button>
                  )}
                  {!isMobilePreview && (
                    <button
                      type="button"
                      onClick={() => onToggleWide(item)}
                      aria-pressed={item.is_wide === true}
                      title={item.is_wide ? "Široká (kliknutím zúžit)" : "Wide / Široká: přes 2 sloupce"}
                      aria-label="Wide / Široká"
                      className={`${overlayButton} ${
                        item.is_wide
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "hover:text-primary"
                      }`}
                    >
                      <RectangleHorizontal className="h-4 w-4" />
                    </button>
                  )}
                  {!isAllView && (
                    <button
                      type="button"
                      onClick={() => onToggleShowInVse(item)}
                      aria-pressed={item.show_in_vse !== false}
                      title={
                        item.show_in_vse === false ? "Zobrazit ve Vše" : "Zobrazeno ve Vše (kliknutím skrýt)"
                      }
                      aria-label="Zobrazit ve Vše"
                      className={`${overlayButton} ${
                        item.show_in_vse === false
                          ? "hover:text-primary"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onTogglePublished(item)}
                    title={item.published ? "Unpublish" : "Publish"}
                    aria-label={item.published ? "Unpublish" : "Publish"}
                    className={`${overlayButton} hover:text-primary`}
                  >
                    {item.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  {isHiddenInAll(item) ? (
                    <button
                      type="button"
                      onClick={() => onToggleShowInVse(item)}
                      title="Vrátit do Vše"
                      aria-label="Vrátit do Vše"
                      className={`${overlayButton} bg-primary text-primary-foreground hover:opacity-90`}
                    >
                      <Undo2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      title={isAllView ? "Odebrat z Vše (fotka zůstane v kategorii)" : "Delete"}
                      aria-label={isAllView ? "Odebrat z Vše" : "Delete"}
                      className={`${overlayButton} ${
                        isAllView ? "hover:text-primary" : "hover:bg-destructive hover:text-primary-foreground"
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <button
                  type="button"
                  onClick={() => onMoveToStart(item.id)}
                  disabled={index === 0}
                  title="Přesunout na začátek"
                  aria-label="Přesunout na začátek"
                  className={`${overlayButton} hover:text-primary disabled:pointer-events-none disabled:opacity-40`}
                >
                  <ChevronsUp className="h-4 w-4" />
                </button>
                <PositionInput
                  position={index + 1}
                  total={items.length}
                  onCommit={(position) => onMoveToPosition(item.id, position)}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
