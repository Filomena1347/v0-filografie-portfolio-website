"use client"

import { useState } from "react"
import { ChevronsUp, Eye, EyeOff, GripVertical, ImagePlus, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { PositionInput } from "@/components/admin/position-input"
import type { MediaItem } from "@/lib/media"

type GalleryGridProps = {
  items: MediaItem[]
  onDragStart: (id: string) => void
  onDragOver: (e: React.DragEvent, id: string) => void
  onDrop: () => void
  onDragEnd: () => void
  onTogglePublished: (item: MediaItem) => void
  onEditThumbnail: (id: string) => void
  onDelete: (id: string) => void
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onMoveToStart: (id: string) => void
  onMoveToPosition: (id: string, position: number) => void
}

const overlayButton =
  "flex h-8 w-8 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur-sm transition-colors"

export function GalleryGrid({
  items,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onTogglePublished,
  onEditThumbnail,
  onDelete,
  selectedIds,
  onToggleSelect,
  onMoveToStart,
  onMoveToPosition,
}: GalleryGridProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)

  return (
    <div className="columns-2 gap-0 md:columns-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = "move"
            setDraggingId(item.id)
            onDragStart(item.id)
          }}
          onDragOver={(e) => onDragOver(e, item.id)}
          onDrop={(e) => {
            e.preventDefault()
            onDrop()
          }}
          onDragEnd={() => {
            setDraggingId(null)
            onDragEnd()
          }}
          className={`group relative break-inside-avoid transition-opacity ${
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
              className="pointer-events-none block h-auto w-full object-contain"
            />
          ) : (
            // Uploads have unknown aspect ratios, so a plain img keeps them uncropped like the public gallery.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url || "/placeholder.svg"}
              alt={item.title ?? ""}
              loading="lazy"
              draggable={false}
              className="block h-auto w-full object-contain"
            />
          )}

          {!item.published && (
            <span className="absolute bottom-2 left-2 rounded-full bg-background/85 px-2 py-0.5 text-xs text-foreground/70">
              Hidden
            </span>
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

          <div className="absolute inset-0 flex items-start justify-between p-2 pl-11 opacity-0 ring-2 ring-inset ring-primary transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <span
              className={`${overlayButton} cursor-grab active:cursor-grabbing`}
              aria-hidden="true"
              title="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </span>

            <div className="flex gap-1.5">
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
              <button
                type="button"
                onClick={() => onTogglePublished(item)}
                title={item.published ? "Unpublish" : "Publish"}
                aria-label={item.published ? "Unpublish" : "Publish"}
                className={`${overlayButton} hover:text-primary`}
              >
                {item.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                title="Delete"
                aria-label="Delete"
                className={`${overlayButton} hover:bg-destructive hover:text-primary-foreground`}
              >
                <X className="h-4 w-4" />
              </button>
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
      ))}
    </div>
  )
}
