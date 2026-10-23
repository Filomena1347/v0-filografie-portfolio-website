"use client"

import { useRef } from "react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, ImagePlus, Loader2, RotateCcw, Trash2 } from "lucide-react"
import { ACCEPT_ATTRIBUTE } from "@/lib/events-upload"
import type { AdminEventItem } from "@/lib/events-admin"

type GridProps = {
  items: AdminEventItem[]
  posterUpload: { id: string; percent: number } | null
  onReorder: (items: AdminEventItem[]) => void
  onDelete: (item: AdminEventItem) => void
  onPickPoster: (item: AdminEventItem, file: File) => void
  onResetPoster: (item: AdminEventItem) => void
}

// The media route is cached for a year per URL, so a changed poster needs a new URL.
function thumbnailSrc(item: AdminEventItem) {
  if (item.type === "photo") return `/api/media/${item.id}?w=480`
  const version = item.poster_url ? `&v=${encodeURIComponent(item.poster_url.split("/").pop() ?? "")}` : ""
  return `/api/media/${item.id}?poster=1&w=480${version}`
}

type TileProps = {
  item: AdminEventItem
  position: number
  uploadingPoster: number | null
  onDelete: GridProps["onDelete"]
  onPickPoster: (item: AdminEventItem) => void
  onResetPoster: GridProps["onResetPoster"]
}

function SortableTile({ item, position, uploadingPoster, onDelete, onPickPoster, onResetPoster }: TileProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })
  const isVideo = item.type === "video"

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative flex flex-col overflow-hidden rounded-lg border border-border bg-card ${
        isDragging ? "z-10 shadow-lg ring-2 ring-primary" : ""
      }`}
    >
      <div className={`relative bg-muted ${isVideo ? "aspect-[9/16]" : "aspect-square"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailSrc(item)}
          alt={`${isVideo ? "Video" : "Photo"} ${position}`}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-xs tabular-nums text-foreground">
          {position}
        </span>
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${isVideo ? "video" : "photo"} ${position}. Press space to pick up, arrow keys to move.`}
          className="absolute left-2 top-2 flex h-8 w-8 cursor-grab touch-none items-center justify-center rounded-full bg-background/90 text-foreground/70 transition-colors hover:text-primary active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(item)}
          aria-label={`Delete ${isVideo ? "video" : "photo"} ${position}`}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground/70 transition-colors hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
        {uploadingPoster !== null && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/70 text-sm text-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {uploadingPoster}%
          </div>
        )}
      </div>

      {isVideo && (
        <div className="flex flex-col gap-2 p-3">
          <p className="text-xs text-foreground/50">{item.poster_url ? "Custom poster" : "Poster: first frame"}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onPickPoster(item)}
              disabled={uploadingPoster !== null}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-foreground/70 transition-colors hover:text-primary disabled:opacity-50"
            >
              <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" /> {item.poster_url ? "Change poster" : "Set poster"}
            </button>
            {item.poster_url && (
              <button
                type="button"
                onClick={() => onResetPoster(item)}
                disabled={uploadingPoster !== null}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-foreground/70 transition-colors hover:text-primary disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> First frame
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

export function EventsGrid({ items, posterUpload, onReorder, onDelete, onPickPoster, onResetPoster }: GridProps) {
  const posterInputRef = useRef<HTMLInputElement>(null)
  const posterTarget = useRef<AdminEventItem | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    const from = items.findIndex((item) => item.id === active.id)
    const to = items.findIndex((item) => item.id === over.id)
    if (from === -1 || to === -1) return
    onReorder(arrayMove(items, from, to))
  }

  function handlePosterFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (file && posterTarget.current) onPickPoster(posterTarget.current, file)
  }

  return (
    <>
      <input
        ref={posterInputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE.poster}
        onChange={handlePosterFile}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item, index) => (
              <SortableTile
                key={item.id}
                item={item}
                position={index + 1}
                uploadingPoster={posterUpload?.id === item.id ? posterUpload.percent : null}
                onDelete={onDelete}
                onPickPoster={(target) => {
                  posterTarget.current = target
                  posterInputRef.current?.click()
                }}
                onResetPoster={onResetPoster}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  )
}
