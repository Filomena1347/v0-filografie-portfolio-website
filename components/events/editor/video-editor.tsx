'use client'

import { useEffect, useRef, useState } from 'react'
import { CloudImage } from "@/components/cloud-image"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { ACCEPT_ATTRIBUTE } from '@/lib/events-upload'
import { useEventsMedia } from '@/lib/use-events-media'
import { toEventVideo } from '@/lib/events-mapping'
import type { AdminEventItem } from '@/lib/events-admin'
import { useEventsAdmin } from '../admin-context'
import { ReelListSkeleton } from '../skeletons'
import { AddTile } from './add-tile'
import { ConfirmDialog } from './confirm-dialog'
import { JobTile } from './job-tile'

function SortableReel({
  item,
  index,
  posterPercent,
  onDelete,
  onChangePoster,
}: {
  item: AdminEventItem
  index: number
  posterPercent: number | null
  onDelete: (item: AdminEventItem) => void
  onChangePoster: (item: AdminEventItem) => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })
  const video = toEventVideo(item, index)
  const savingPoster = posterPercent !== null

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative aspect-[9/16] overflow-hidden rounded-[4px] bg-ev-soft ${isDragging ? 'z-10 shadow-[0_12px_40px_rgba(0,0,0,0.25)]' : ''}`}
    >
      <CloudImage
        src={video.poster.src}
        alt=""
        width={video.poster.width}
        height={video.poster.height}
        sizes="(min-width: 480px) 420px, 100vw"
        className="absolute inset-0 size-full object-cover"
      />

      <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.12em] text-ev-text">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-ev-accent" />
        Reel
      </span>

      {savingPoster && (
        <div
          role="status"
          className="absolute inset-0 flex items-center justify-center bg-white/70 text-[13px] text-ev-text"
        >
          <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />
          Poster {posterPercent}%
        </div>
      )}

      <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
        <div className="flex items-center gap-0.5 rounded-full bg-white p-1 shadow-[0_1px_8px_rgba(0,0,0,0.15)]">
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            aria-label={`Reorder reel ${index + 1}`}
            title="Drag to reorder"
            className="flex size-8 cursor-grab touch-none items-center justify-center rounded-full text-ev-text hover:bg-ev-soft active:cursor-grabbing"
          >
            <GripVertical aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onChangePoster(item)}
            disabled={savingPoster}
            className="flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] text-ev-text hover:bg-ev-soft disabled:opacity-50"
          >
            <ImagePlus aria-hidden="true" className="size-4" />
            Change poster
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            aria-label={`Delete reel ${index + 1}`}
            title="Delete"
            className="flex size-8 items-center justify-center rounded-full text-ev-text hover:bg-ev-soft"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </li>
  )
}

export default function VideoEditor() {
  const { sessionExpired, setUploading } = useEventsAdmin()
  const media = useEventsMedia('video', { onUnauthorized: sessionExpired })
  const { items, jobs, uploading } = media

  const [deleteTarget, setDeleteTarget] = useState<AdminEventItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const posterInput = useRef<HTMLInputElement>(null)
  const posterTarget = useRef<AdminEventItem | null>(null)

  useEffect(() => {
    setUploading('video', uploading)
    return () => setUploading('video', false)
  }, [uploading, setUploading])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    const from = items.findIndex((item) => item.id === active.id)
    const to = items.findIndex((item) => item.id === over.id)
    if (from === -1 || to === -1) return
    media.reorder(arrayMove(items, from, to))
  }

  function handlePosterFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    const target = posterTarget.current
    event.target.value = ''
    if (file && target) media.pickPoster(target, file)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await media.removeItem(deleteTarget)
    setDeleteTarget(null)
    setDeleting(false)
  }

  if (media.isLoading) return <ReelListSkeleton />

  const pendingJobs = jobs.filter((job) => job.status !== 'done')

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-4">
            {items.map((item, index) => (
              <SortableReel
                key={item.id}
                item={item}
                index={index}
                posterPercent={media.posterUpload?.id === item.id ? media.posterUpload.percent : null}
                onDelete={setDeleteTarget}
                onChangePoster={(target) => {
                  posterTarget.current = target
                  posterInput.current?.click()
                }}
              />
            ))}
            {pendingJobs.map((job) => (
              <li key={job.id}>
                <JobTile job={job} aspect="aspect-[9/16]" onDismiss={media.dismissJob} />
              </li>
            ))}
            <li>
              <AddTile type="video" onFiles={media.enqueue} notice={media.notice} error={media.error} />
            </li>
          </ul>
        </SortableContext>
      </DndContext>

      <input
        ref={posterInput}
        type="file"
        accept={ACCEPT_ATTRIBUTE.poster}
        onChange={handlePosterFile}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this video?"
          description="It is removed from Cloudinary and from the events page. This cannot be undone."
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}
