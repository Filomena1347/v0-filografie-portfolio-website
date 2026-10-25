"use client"

import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import {
  UnauthorizedError,
  isAcceptedFile,
  requestJson,
  sortFilesByPath,
  uploadAsset,
  type UploadJob,
} from "@/lib/events-upload"
import type { AdminEventItem, EventsMediaType } from "@/lib/events-admin"

async function fetchItems(url: string): Promise<AdminEventItem[]> {
  const data = await requestJson(url)
  return data.items
}

type Options = {
  /** Called when the admin session is missing or expired. */
  onUnauthorized: () => void
}

/**
 * Upload, reorder, poster and delete logic for events_media. Used by the admin
 * Events section and by the inline editor on /events, so both behave the same.
 */
export function useEventsMedia(type: EventsMediaType, { onUnauthorized }: Options) {
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
  const [posterUpload, setPosterUpload] = useState<{ id: string; percent: number } | null>(null)
  const queue = useRef<Promise<void>>(Promise.resolve())

  const onUnauthorizedRef = useRef(onUnauthorized)
  useEffect(() => {
    onUnauthorizedRef.current = onUnauthorized
  })

  const uploading = jobs.some((job) => job.status === "queued" || job.status === "uploading" || job.status === "saving")

  useEffect(() => {
    if (!uploading) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [uploading])

  useEffect(() => {
    if (loadError instanceof UnauthorizedError) onUnauthorizedRef.current()
  }, [loadError])

  function handleFailure(err: unknown) {
    if (err instanceof UnauthorizedError) {
      onUnauthorizedRef.current()
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
      if (err instanceof UnauthorizedError) onUnauthorizedRef.current()
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

  /** Deletes the file from Cloudinary and the row from Supabase. Failures are reported through `error`. */
  async function removeItem(item: AdminEventItem) {
    setError("")
    try {
      await requestJson(`/api/admin/events/${item.id}`, { method: "DELETE" })
      await mutate((prev) => (prev ?? []).filter((current) => current.id !== item.id), { revalidate: false })
    } catch (err) {
      handleFailure(err)
    }
  }

  function clearFinished() {
    setJobs((prev) => prev.filter((job) => job.status !== "done" && job.status !== "error"))
  }

  function dismissJob(id: string) {
    setJobs((prev) => prev.filter((job) => job.id !== id))
  }

  return {
    items,
    isLoading,
    loadError,
    jobs,
    notice,
    error,
    uploading,
    posterUpload,
    enqueue,
    reorder,
    pickPoster,
    resetPoster,
    removeItem,
    clearFinished,
    dismissJob,
  }
}
