"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EventsDropzone, UploadQueue } from "@/components/admin/events-dropzone"
import { EventsGrid } from "@/components/admin/events-grid"
import { UnauthorizedError } from "@/lib/events-upload"
import { useEventsMedia } from "@/lib/use-events-media"
import type { AdminEventItem, EventsMediaType } from "@/lib/events-admin"

const TABS: { type: EventsMediaType; label: string }[] = [
  { type: "photo", label: "Photos" },
  { type: "video", label: "Videos" },
]

function EventsTab({ type }: { type: EventsMediaType }) {
  const router = useRouter()
  const {
    items,
    isLoading,
    loadError,
    jobs,
    notice,
    error,
    posterUpload,
    enqueue,
    reorder,
    pickPoster,
    resetPoster,
    removeItem,
    clearFinished,
  } = useEventsMedia(type, { onUnauthorized: () => router.push("/admin/login") })

  const [deleteTarget, setDeleteTarget] = useState<AdminEventItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await removeItem(deleteTarget)
    setDeleteTarget(null)
    setDeleting(false)
  }

  const noun = type === "photo" ? "photo" : "video"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <EventsDropzone type={type} onFiles={enqueue} />
        <UploadQueue jobs={jobs} onClearFinished={clearFinished} />
        {notice && <p className="mt-3 text-sm text-foreground/60">{notice}</p>}
        {(error || (loadError && !(loadError instanceof UnauthorizedError))) && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error || (loadError as Error).message}
          </p>
        )}
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-foreground/50">Loading…</p>
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-10 text-center text-foreground/50">
          No {noun}s yet. Upload your first {noun}.
        </p>
      ) : (
        <div>
          <p className="mb-3 text-xs text-foreground/50">
            {items.length} {noun}
            {items.length === 1 ? "" : "s"}. Drag the handle to reorder, the order is saved automatically.
          </p>
          <EventsGrid
            items={items}
            posterUpload={posterUpload}
            onReorder={reorder}
            onDelete={setDeleteTarget}
            onPickPoster={pickPoster}
            onResetPoster={resetPoster}
          />
        </div>
      )}

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && !deleting && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {noun}?</AlertDialogTitle>
            <AlertDialogDescription>
              It is removed from Cloudinary and from the events page. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              className="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function EventsManager() {
  const [tab, setTab] = useState<EventsMediaType>("photo")

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    const next = tab === "photo" ? "video" : "photo"
    setTab(next)
    document.getElementById(`events-tab-${next}`)?.focus()
  }

  return (
    <section aria-label="Events media">
      <div role="tablist" aria-label="Events media type" onKeyDown={handleKeyDown} className="mb-6 flex gap-2">
        {TABS.map(({ type, label }) => (
          <button
            key={type}
            id={`events-tab-${type}`}
            type="button"
            role="tab"
            aria-selected={tab === type}
            aria-controls={`events-panel-${type}`}
            tabIndex={tab === type ? 0 : -1}
            onClick={() => setTab(type)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              tab === type
                ? "bg-primary text-primary-foreground"
                : "border border-border text-foreground/70 hover:text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Both panels stay mounted so a running upload keeps going when you switch tabs. */}
      {TABS.map(({ type }) => (
        <div
          key={type}
          id={`events-panel-${type}`}
          role="tabpanel"
          aria-labelledby={`events-tab-${type}`}
          hidden={tab !== type}
        >
          <EventsTab type={type} />
        </div>
      ))}
    </section>
  )
}
