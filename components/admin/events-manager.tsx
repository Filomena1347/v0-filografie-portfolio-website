"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EventsDropzone, UploadQueue, type UploadJob } from "@/components/admin/events-dropzone"
import { EventsGrid } from "@/components/admin/events-grid"
import {
  UnauthorizedError,
  isAcceptedFile,
  requestJson,
  sortFilesByPath,
  uploadAsset,
} from "@/lib/events-upload"
import type { AdminEventItem, EventsMediaType } from "@/lib/events-admin"

const TABS: { type: EventsMediaType; label: string }[] = [
  { type: "photo", label: "Photos" },
  { type: "video", label: "Videos" },
]

async function fetchItems(url: string): Promise<AdminEventItem[]> {
  const data = await requestJson(url)
  return data.items
}

function EventsTab({ type }: { type: EventsMediaType }) {
  const router = useRouter()
  const listUrl = `/api/admin/events?type=${type}`
  const {
    data,
    error: loadError,
    isLoading,
    mutate,
  } = useSWR(listUrl, fetchItems, { revalidateOnFocus: false })
  const items = data ?? []

  const [jobs, setJobs] = useState<UploadJob[]>([])
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<AdminEventItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [posterUpload, setPosterUpload] = useState<{ id: string; percent: number } | null>(null)
  const queue = useRef<Promise<void>>(Promise.resolve())

  const uploading = jobs.some((job) => job.status === "queued" || job.status === "uploading" || job.status === "saving")

  useEffect(() => {
    if (!uploading) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [uploading])

  useEffect(() => {
    if (loadError instanceof UnauthorizedError) router.push("/admin/login")
  }, [loadError, router])

  function handleFailure(err: unknown) {
    if (err instanceof UnauthorizedError) {
      router.push("/admin/login")
      return
    }
    setError((err as Error).message)
  }

  function patchJob(id: string, patch: Partial<UploadJob>) {
    setJobs((prev) => prev.map((job) => (job.id === id ? { ...job, ...patch } : job)))
  }

  async function processJob(job: UploadJob) {
    patchJob(job.id, { status: "uploading", percent: 0 })
    try {
      const asset = await uploadAsset(job.file, type, (percent) => patchJob(job.id, { percent }))
      patchJob(job.id, { status: "saving", percent: 100 })
      const { item } = await requestJson("/api/admin/events", {
        method: "POST",
        body: JSON.stringify({
          type,
          cloudinary_public_id: asset.publicId,
          url: asset.url,
          width: asset.width,
          height: asset.height,
        }),
      })
      await mutate((prev) => [...(prev ?? []), item as AdminEventItem], { revalidate: false })
      patchJob(job.id, { status: "done" })
    } catch (err) {
      if (err instanceof UnauthorizedError) router.push("/admin/login")
      patchJob(job.id, { status: "error", error: (err as Error).message })
    }
  }

  function enqueue(files: File[]) {
    setError("")
    const visible = files.filter((file) => !file.name.startsWith("."))
    const accepted = sortFilesByPath(visible.filter((file) => isAcceptedFile(file, type)))
    const skipped = visible.length - accepted.length
    setNotice(skipped > 0 ? `${skipped} file${skipped === 1 ? "" : "s"} skipped because of an unsupported format.` : "")
    if (accepted.length === 0) return

    const newJobs: UploadJob[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "queued",
      percent: 0,
    }))
    setJobs((prev) => [...prev, ...newJobs])
    // One file at a time keeps the sort order identical to the file order.
    queue.current = queue.current.then(async () => {
      for (const job of newJobs) await processJob(job)
    })
  }

  async function reorder(next: AdminEventItem[]) {
    setError("")
    await mutate(next, { revalidate: false })
    try {
      await requestJson("/api/admin/events/reorder", {
        method: "POST",
        body: JSON.stringify({ type, ids: next.map((item) => item.id) }),
      })
    } catch (err) {
      handleFailure(err)
      await mutate()
    }
  }

  async function savePoster(item: AdminEventItem, posterUrl: string | null) {
    const { item: updated } = await requestJson(`/api/admin/events/${item.id}`, {
      method: "PATCH",
      body: JSON.stringify({ poster_url: posterUrl }),
    })
    await mutate((prev) => (prev ?? []).map((current) => (current.id === item.id ? (updated as AdminEventItem) : current)), {
      revalidate: false,
    })
  }

  async function pickPoster(item: AdminEventItem, file: File) {
    setError("")
    setPosterUpload({ id: item.id, percent: 0 })
    try {
      const asset = await uploadAsset(file, "poster", (percent) => setPosterUpload({ id: item.id, percent }))
      await savePoster(item, asset.url)
    } catch (err) {
      handleFailure(err)
    } finally {
      setPosterUpload(null)
    }
  }

  async function resetPoster(item: AdminEventItem) {
    setError("")
    try {
      await savePoster(item, null)
    } catch (err) {
      handleFailure(err)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    setError("")
    try {
      await requestJson(`/api/admin/events/${deleteTarget.id}`, { method: "DELETE" })
      const deletedId = deleteTarget.id
      await mutate((prev) => (prev ?? []).filter((item) => item.id !== deletedId), { revalidate: false })
      setDeleteTarget(null)
    } catch (err) {
      handleFailure(err)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const noun = type === "photo" ? "photo" : "video"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <EventsDropzone type={type} onFiles={enqueue} />
        <UploadQueue jobs={jobs} onClearFinished={() => setJobs((prev) => prev.filter((job) => job.status !== "done" && job.status !== "error"))} />
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
