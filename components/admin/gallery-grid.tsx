"use client"

import { useState } from "react"
import { Eye, EyeOff, GripVertical, ImagePlus, X } from "lucide-react"
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
}: GalleryGridProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)

  return (
    <div className="columns-2 gap-0 md:columns-4">
      {items.map((item) => (
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

          <div className="absolute inset-0 flex items-start justify-between p-2 opacity-0 ring-2 ring-inset ring-primary transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
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
        </div>
      ))}
    </div>
  )
}
