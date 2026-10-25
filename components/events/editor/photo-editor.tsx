'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  type SortingStrategy,
} from '@dnd-kit/sortable'
import { GripVertical, Trash2 } from 'lucide-react'
import { useEventsMedia } from '@/lib/use-events-media'
import { toEventPhoto } from '@/lib/events-mapping'
import type { AdminEventItem } from '@/lib/events-admin'
import { useEventsAdmin } from '../admin-context'
import { PhotoGridSkeleton } from '../skeletons'
import { AddTile } from './add-tile'
import { ConfirmDialog } from './confirm-dialog'
import { JobTile } from './job-tile'

// Photos have different heights, so shifting neighbours while dragging would jump around.
// The dragged photo is shown in an overlay and the photo under the pointer is highlighted instead.
const keepInPlace: SortingStrategy = () => null

const collisionDetection: CollisionDetection = (args) => {
  const underPointer = pointerWithin(args)
  return underPointer.length > 0 ? underPointer : closestCenter(args)
}

const IMAGE_SIZES = '(min-width: 1360px) 440px, (min-width: 920px) 36vw, 50vw'

function SortablePhoto({
  item,
  index,
  onDelete,
}: {
  item: AdminEventItem
  index: number
  onDelete: (item: AdminEventItem) => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging, isOver } = useSortable({ id: item.id })
  const photo = toEventPhoto(item, index)

  return (
    <li ref={setNodeRef} className={`group relative mb-4 break-inside-avoid ${isDragging ? 'opacity-40' : ''}`}>
      <div
        className={`overflow-hidden rounded-[4px] bg-ev-soft ${isOver && !isDragging ? 'outline outline-2 outline-offset-2 outline-ev-text' : ''}`}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={IMAGE_SIZES}
          className="block h-auto w-full"
        />
      </div>

      <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-full bg-white p-1 opacity-0 shadow-[0_1px_8px_rgba(0,0,0,0.15)] transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Reorder photo ${index + 1}`}
          title="Drag to reorder"
          className="flex size-8 cursor-grab touch-none items-center justify-center rounded-full text-ev-text hover:bg-ev-soft active:cursor-grabbing"
        >
          <GripVertical aria-hidden="true" className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(item)}
          aria-label={`Delete photo ${index + 1}`}
          title="Delete"
          className="flex size-8 items-center justify-center rounded-full text-ev-text hover:bg-ev-soft"
        >
          <Trash2 aria-hidden="true" className="size-4" />
        </button>
      </div>
    </li>
  )
}

export default function PhotoEditor() {
  const { sessionExpired, setUploading } = useEventsAdmin()
  const media = useEventsMedia('photo', { onUnauthorized: sessionExpired })
  const { items, jobs, uploading } = media

  const [activeId, setActiveId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminEventItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setUploading('photo', uploading)
    return () => setUploading('photo', false)
  }, [uploading, setUploading])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = items.findIndex((item) => item.id === active.id)
    const to = items.findIndex((item) => item.id === over.id)
    if (from === -1 || to === -1) return
    media.reorder(arrayMove(items, from, to))
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await media.removeItem(deleteTarget)
    setDeleteTarget(null)
    setDeleting(false)
  }

  if (media.isLoading) return <PhotoGridSkeleton />

  const activeIndex = items.findIndex((item) => item.id === activeId)
  const activePhoto = activeIndex === -1 ? null : toEventPhoto(items[activeIndex], activeIndex)
  const pendingJobs = jobs.filter((job) => job.status !== 'done')

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={(event: DragStartEvent) => setActiveId(String(event.active.id))}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext items={items.map((item) => item.id)} strategy={keepInPlace}>
          <ul className="columns-2 gap-4">
            <li className="mb-4 break-inside-avoid">
              <AddTile type="photo" onFiles={media.enqueue} notice={media.notice} error={media.error} />
            </li>
            {items.map((item, index) => (
              <SortablePhoto key={item.id} item={item} index={index} onDelete={setDeleteTarget} />
            ))}
            {pendingJobs.map((job) => (
              <li key={job.id} className="mb-4 break-inside-avoid">
                <JobTile job={job} aspect="aspect-[4/3]" onDismiss={media.dismissJob} />
              </li>
            ))}
          </ul>
        </SortableContext>

        <DragOverlay>
          {activePhoto ? (
            <Image
              src={activePhoto.src}
              alt=""
              width={activePhoto.width}
              height={activePhoto.height}
              sizes={IMAGE_SIZES}
              className="block h-auto w-full rounded-[4px] shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this photo?"
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
