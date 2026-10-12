"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Eye,
  EyeOff,
  Trash2,
  ImagePlus,
  GripVertical,
  Upload,
  LogOut,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
} from "lucide-react"
import type { CategoryKey, MediaItem, MediaSection } from "@/lib/media"
import { CATEGORY_KEYS, CATEGORY_LABELS, PHOTO_CATEGORIES } from "@/lib/media"
import { GalleryGrid } from "@/components/admin/gallery-grid"

const SECTIONS: { key: MediaSection; label: string; accept: string }[] = [
  { key: "cover", label: "Category covers", accept: "image/*" },
  { key: "gallery", label: "Category galleries", accept: "image/*,video/*" },
  { key: "about", label: "About photo", accept: "image/*" },
  { key: "photography", label: "Photography", accept: "image/*" },
  { key: "video", label: "Video", accept: "video/*" },
  { key: "content", label: "Content", accept: "image/*,video/*" },
]

const CATEGORY_SECTIONS: MediaSection[] = ["cover", "gallery"]

const CLOUD_NAME = "duntvai9w"
const UPLOAD_PRESET = "videos"
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`

export function AdminDashboard() {
  const router = useRouter()
  const pendingSaves = useRef(new Set<Promise<unknown>>())
  const [exiting, setExiting] = useState(false)
  const [section, setSection] = useState<MediaSection>("cover")
  const [category, setCategory] = useState<CategoryKey>("video")
  const usesCategory = CATEGORY_SECTIONS.includes(section)
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)
  const editingThumbId = useRef<string | null>(null)
  const dragId = useRef<string | null>(null)
  const lastOverId = useRef<string | null>(null)
  const itemsRef = useRef<MediaItem[]>([])
  const loadSeq = useRef(0)

  function updateItems(next: MediaItem[] | ((prev: MediaItem[]) => MediaItem[])) {
    const value = typeof next === "function" ? next(itemsRef.current) : next
    itemsRef.current = value
    setItems(value)
  }

  const load = useCallback(async (s: MediaSection, cat: CategoryKey | null) => {
    const seq = ++loadSeq.current
    setLoading(true)
    setError("")
    itemsRef.current = []
    setItems([])
    try {
      const params = new URLSearchParams({ section: s })
      if (cat) params.set("category", cat)
      const res = await fetch(`/api/admin/media?${params}`, { cache: "no-store" })
      if (seq !== loadSeq.current) return
      if (res.status === 401) {
        router.push("/admin/login")
        return
      }
      const data = await res.json()
      if (seq !== loadSeq.current) return
      itemsRef.current = data.items ?? []
      setItems(itemsRef.current)
    } catch {
      if (seq === loadSeq.current) setError("Failed to load media")
    } finally {
      if (seq === loadSeq.current) setLoading(false)
    }
  }, [router])

  useEffect(() => {
    load(section, usesCategory ? category : null)
  }, [section, category, usesCategory, load])

  async function uploadToCloudinary(file: File): Promise<{
    public_id: string
    url: string
    width?: number
    height?: number
    resourceType: string
  }> {
    const form = new FormData()
    form.append("file", file)
    form.append("upload_preset", UPLOAD_PRESET)

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("POST", CLOUDINARY_UPLOAD_URL)
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const r = JSON.parse(xhr.responseText)
          resolve({
            public_id: r.public_id,
            url: r.secure_url,
            width: r.width,
            height: r.height,
            resourceType: r.resource_type,
          })
        } else {
          let detail = `HTTP ${xhr.status}`
          try {
            detail = JSON.parse(xhr.responseText)?.error?.message || detail
          } catch {}
          reject(new Error(`Cloudinary upload failed: ${detail} (cloud "${CLOUD_NAME}", preset "${UPLOAD_PRESET}")`))
        }
      }
      xhr.onerror = () => reject(new Error("Network error"))
      xhr.send(form)
    })
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setError("")
    setUploading(true)

    try {
      for (const file of files) {
        setProgress(0)
        const uploaded = await uploadToCloudinary(file)
        const type = uploaded.resourceType === "video" ? "video" : "photo"
        const thumbnail_url =
          type === "video"
            ? uploaded.url.replace(/\.[^/.]+$/, ".jpg")
            : null

        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            section,
            category: usesCategory
              ? category
              : section === "photography"
                ? PHOTO_CATEGORIES[0]
                : null,
            public_id: uploaded.public_id,
            url: uploaded.url,
            thumbnail_url,
            width: uploaded.width,
            height: uploaded.height,
          }),
        })
        if (!res.ok) throw new Error("Failed to save media")
        const { item } = await res.json()
        updateItems((prev) => [...prev, item])
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const id = editingThumbId.current
    if (!file || !id) return
    setError("")
    setUploading(true)
    try {
      setProgress(0)
      const uploaded = await uploadToCloudinary(file)
      await patchItem(id, { thumbnail_url: uploaded.url })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploading(false)
      setProgress(0)
      editingThumbId.current = null
      if (thumbInputRef.current) thumbInputRef.current.value = ""
    }
  }

  async function patchItem(id: string, patch: Partial<MediaItem>) {
    const res = await fetch(`/api/admin/media/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    if (!res.ok) {
      setError("Update failed")
      return
    }
    const { item } = await res.json()
    updateItems((prev) => prev.map((i) => (i.id === id ? item : i)))
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this item permanently?")) return
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" })
    if (!res.ok) {
      setError("Delete failed")
      return
    }
    updateItems((prev) => prev.filter((i) => i.id !== id))
  }

  function onDragStart(id: string) {
    dragId.current = id
    lastOverId.current = null
  }

  function onDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault()
    const from = dragId.current
    // Only move once per new target; otherwise the shifted tile under the cursor swaps back and forth.
    if (!from || from === overId || lastOverId.current === overId) return
    lastOverId.current = overId
    updateItems((prev) => {
      const fromIdx = prev.findIndex((i) => i.id === from)
      const overIdx = prev.findIndex((i) => i.id === overId)
      if (fromIdx === -1 || overIdx === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(fromIdx, 1)
      next.splice(overIdx, 0, moved)
      return next
    })
  }

  function trackSave<T>(promise: Promise<T>) {
    pendingSaves.current.add(promise)
    promise.finally(() => pendingSaves.current.delete(promise))
    return promise
  }

  function saveOrder(list: MediaItem[]) {
    return trackSave(persistOrder(list))
  }

  async function persistOrder(list: MediaItem[]) {
    try {
      const res = await fetch("/api/admin/media/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: list.map((i) => i.id) }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(`Saving order failed: ${data.error ?? `HTTP ${res.status}`}`)
        return
      }
      updateItems((prev) => prev.map((item, index) => ({ ...item, sort_order: index })))
    } catch (err) {
      setError(`Saving order failed: ${(err as Error).message}`)
    }
  }

  function finishDrag() {
    if (!dragId.current) return
    dragId.current = null
    lastOverId.current = null
    saveOrder(itemsRef.current)
  }

  function onDrop() {
    finishDrag()
  }

  function onDragEnd() {
    finishDrag()
  }

  function moveItem(id: string, to: "up" | "down" | "top" | "bottom") {
    const idx = items.findIndex((i) => i.id === id)
    if (idx === -1) return
    const next = [...items]
    const [moved] = next.splice(idx, 1)
    const target =
      to === "top" ? 0 : to === "bottom" ? next.length : to === "up" ? Math.max(0, idx - 1) : Math.min(next.length, idx + 1)
    next.splice(target, 0, moved)
    updateItems(next)
    saveOrder(next)
  }

  async function saveAndExit() {
    setExiting(true)
    if (dragId.current) finishDrag()
    await Promise.allSettled([...pendingSaves.current])
    router.push("/")
    router.refresh()
  }

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="font-serif italic text-3xl text-foreground">Filoména</p>
          <p className="text-sm text-foreground/50">Content manager</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={saveAndExit}
            disabled={exiting || uploading}
            title={uploading ? "Wait for the upload to finish" : "Uložit a odejít"}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> {exiting ? "Saving…" : "Save & Exit"}
          </button>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </header>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              section === s.key
                ? "bg-primary text-primary-foreground"
                : "border border-border text-foreground/70 hover:text-primary"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {usesCategory && (
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Category">
            <span className="text-xs uppercase tracking-widest text-foreground/50 mr-1">Category</span>
            {CATEGORY_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                aria-pressed={category === key}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                  category === key
                    ? "bg-accent text-accent-foreground"
                    : "border border-border text-foreground/70 hover:text-primary"
                }`}
              >
                {CATEGORY_LABELS[key]}
              </button>
            ))}
          </div>
          <p className="text-xs text-foreground/50">
            {section === "cover"
              ? "The first published image is used as the card cover on the homepage."
              : "Photos and videos shown when a visitor opens this category. Drag to reorder."}
          </p>
        </div>
      )}

      {/* Upload */}
      <div
        className={
          section === "gallery"
            ? "sticky top-0 z-10 -mx-2 mb-4 bg-background/90 px-2 py-3 backdrop-blur-sm"
            : "mb-8"
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={SECTIONS.find((s) => s.key === section)?.accept}
          onChange={handleUpload}
          className="hidden"
        />
        <input
          ref={thumbInputRef}
          type="file"
          accept="image/*"
          onChange={handleThumbnailUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60 ${
            section === "gallery" ? "px-4 py-1.5 text-xs" : "px-6 py-2.5 text-sm"
          }`}
        >
          <Upload className={section === "gallery" ? "w-3.5 h-3.5" : "w-4 h-4"} />
          {uploading ? `Uploading… ${progress}%` : "Upload media"}
        </button>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-foreground/50 py-10 text-center">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-foreground/50 py-10 text-center border border-dashed border-border rounded-lg">
          No media yet. Upload your first item.
        </p>
      ) : section === "gallery" ? (
        <GalleryGrid
          items={items}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
          onTogglePublished={(item) => patchItem(item.id, { published: !item.published })}
          onEditThumbnail={(id) => {
            editingThumbId.current = id
            thumbInputRef.current?.click()
          }}
          onDelete={deleteItem}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item, index) => (
            <li
              key={item.id}
              draggable
              onDragStart={() => onDragStart(item.id)}
              onDragOver={(e) => onDragOver(e, item.id)}
              onDrop={onDrop}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-3"
            >
              <GripVertical className="w-5 h-5 text-foreground/30 cursor-grab shrink-0" />

              <div className="relative w-16 h-20 shrink-0 overflow-hidden rounded bg-muted">
                {item.type === "video" ? (
                  <video src={item.url} poster={item.thumbnail_url ?? undefined} className="w-full h-full object-cover" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{item.public_id}</p>
                <div className="mt-1 flex items-center gap-2">
                  {section === "photography" ? (
                    <select
                      value={item.category ?? PHOTO_CATEGORIES[0]}
                      onChange={(e) => patchItem(item.id, { category: e.target.value })}
                      className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                    >
                      {PHOTO_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-foreground/50 capitalize">
                      {usesCategory ? `${CATEGORY_LABELS[category]} · ${item.type}` : item.type}
                    </span>
                  )}
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 ${
                      item.published
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-foreground/50"
                    }`}
                  >
                    {item.published ? "Published" : "Hidden"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => moveItem(item.id, "top")}
                  disabled={index === 0}
                  title="Move to top"
                  aria-label="Move to top"
                  className="p-2 rounded hover:bg-muted text-foreground/60 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveItem(item.id, "up")}
                  disabled={index === 0}
                  title="Move up"
                  aria-label="Move up"
                  className="p-2 rounded hover:bg-muted text-foreground/60 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveItem(item.id, "down")}
                  disabled={index === items.length - 1}
                  title="Move down"
                  aria-label="Move down"
                  className="p-2 rounded hover:bg-muted text-foreground/60 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                {item.type === "video" && (
                  <button
                    onClick={() => {
                      editingThumbId.current = item.id
                      thumbInputRef.current?.click()
                    }}
                    title="Edit thumbnail"
                    className="p-2 rounded hover:bg-muted text-foreground/60 hover:text-primary transition-colors"
                  >
                    <ImagePlus className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => patchItem(item.id, { published: !item.published })}
                  title={item.published ? "Unpublish" : "Publish"}
                  className="p-2 rounded hover:bg-muted text-foreground/60 hover:text-primary transition-colors"
                >
                  {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  title="Delete"
                  className="p-2 rounded hover:bg-muted text-foreground/60 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
