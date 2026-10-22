"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { GripVertical, ImagePlus, Replace, Trash2, Upload } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import type { AdminHeroSlide } from "@/lib/hero-slides-admin"

const SLIDES_URL = "/api/admin/hero-slides"

class UnauthorizedError extends Error {}

async function fetchSlides(url: string): Promise<AdminHeroSlide[]> {
  const res = await fetch(url, { cache: "no-store" })
  if (res.status === 401) throw new UnauthorizedError("Unauthorized")
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
  return data.slides
}

async function requestJson(url: string, init: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) throw new UnauthorizedError("Unauthorized")
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
  return data
}

type UploadedImage = { publicId: string; url: string }

async function uploadImage(file: File, onProgress: (percent: number) => void): Promise<UploadedImage> {
  const config = await requestJson("/api/admin/upload-config", { method: "GET" })
  const form = new FormData()
  form.append("file", file)
  form.append("upload_preset", config.uploadPreset)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const r = JSON.parse(xhr.responseText)
        resolve({ publicId: r.public_id, url: r.secure_url })
        return
      }
      let detail = `HTTP ${xhr.status}`
      try {
        detail = JSON.parse(xhr.responseText)?.error?.message || detail
      } catch {}
      reject(new Error(`Cloudinary upload failed: ${detail}`))
    }
    xhr.onerror = () => reject(new Error("Network error during upload"))
    xhr.send(form)
  })
}

export function HeroSlidesManager() {
  const router = useRouter()
  const { data, error: loadError, isLoading, mutate } = useSWR(SLIDES_URL, fetchSlides, {
    revalidateOnFocus: false,
  })
  const slides = data ?? []

  const [error, setError] = useState("")
  const [upload, setUpload] = useState<{ target: string; percent: number } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminHeroSlide | null>(null)
  const [dragEnabledId, setDragEnabledId] = useState<string | null>(null)

  const addInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const replacingId = useRef<string | null>(null)
  const slidesRef = useRef<AdminHeroSlide[]>([])
  slidesRef.current = slides
  const dragId = useRef<string | null>(null)
  const lastOverId = useRef<string | null>(null)
  const orderChanged = useRef(false)

  function handleFailure(err: unknown) {
    if (err instanceof UnauthorizedError) {
      router.push("/admin/login")
      return
    }
    setError((err as Error).message)
  }

  async function addSlide(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (addInputRef.current) addInputRef.current.value = ""
    if (files.length === 0) return
    setError("")
    try {
      for (const file of files) {
        setUpload({ target: "new", percent: 0 })
        const uploaded = await uploadImage(file, (percent) => setUpload({ target: "new", percent }))
        const { slide } = await requestJson(SLIDES_URL, {
          method: "POST",
          body: JSON.stringify({ public_id: uploaded.publicId, url: uploaded.url }),
        })
        await mutate((prev) => [...(prev ?? []), slide], { revalidate: false })
      }
    } catch (err) {
      handleFailure(err)
    } finally {
      setUpload(null)
    }
  }

  async function replaceImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const id = replacingId.current
    if (replaceInputRef.current) replaceInputRef.current.value = ""
    replacingId.current = null
    if (!file || !id) return
    setError("")
    try {
      setUpload({ target: id, percent: 0 })
      const uploaded = await uploadImage(file, (percent) => setUpload({ target: id, percent }))
      await patchSlide(id, { public_id: uploaded.publicId, url: uploaded.url })
    } catch (err) {
      handleFailure(err)
    } finally {
      setUpload(null)
    }
  }

  async function patchSlide(id: string, patch: Record<string, unknown>) {
    const { slide } = await requestJson(`${SLIDES_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    })
    await mutate((prev) => (prev ?? []).map((s) => (s.id === id ? slide : s)), { revalidate: false })
  }

  async function toggleActive(slide: AdminHeroSlide, isActive: boolean) {
    setError("")
    await mutate((prev) => (prev ?? []).map((s) => (s.id === slide.id ? { ...s, isActive } : s)), {
      revalidate: false,
    })
    try {
      await patchSlide(slide.id, { is_active: isActive })
    } catch (err) {
      await mutate()
      handleFailure(err)
    }
  }

  async function saveAlt(slide: AdminHeroSlide, field: "alt_cs" | "alt_en", value: string) {
    setError("")
    try {
      await patchSlide(slide.id, { [field]: value })
    } catch (err) {
      handleFailure(err)
    }
  }

  async function confirmDelete() {
    const target = deleteTarget
    setDeleteTarget(null)
    if (!target) return
    setError("")
    try {
      await requestJson(`${SLIDES_URL}/${target.id}`, { method: "DELETE" })
      await mutate((prev) => (prev ?? []).filter((s) => s.id !== target.id), { revalidate: false })
    } catch (err) {
      handleFailure(err)
    }
  }

  function onDragStart(e: React.DragEvent, id: string) {
    dragId.current = id
    lastOverId.current = null
    orderChanged.current = false
    e.dataTransfer.effectAllowed = "move"
  }

  function onDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault()
    const from = dragId.current
    // Move once per new target, otherwise the shifted card under the cursor swaps back and forth.
    if (!from || from === overId || lastOverId.current === overId) return
    lastOverId.current = overId
    const next = [...slidesRef.current]
    const fromIdx = next.findIndex((s) => s.id === from)
    const overIdx = next.findIndex((s) => s.id === overId)
    if (fromIdx === -1 || overIdx === -1) return
    const [moved] = next.splice(fromIdx, 1)
    next.splice(overIdx, 0, moved)
    orderChanged.current = true
    slidesRef.current = next
    mutate(next, { revalidate: false })
  }

  async function finishDrag() {
    const changed = orderChanged.current
    dragId.current = null
    lastOverId.current = null
    orderChanged.current = false
    setDragEnabledId(null)
    if (!changed) return
    setError("")
    try {
      await requestJson(`${SLIDES_URL}/reorder`, {
        method: "POST",
        body: JSON.stringify({ ids: slidesRef.current.map((s) => s.id) }),
      })
    } catch (err) {
      await mutate()
      handleFailure(err)
    }
  }

  if (loadError instanceof UnauthorizedError) {
    router.push("/admin/login")
    return null
  }

  const activeCount = slides.filter((s) => s.isActive).length
  const uploadingNew = upload?.target === "new"

  return (
    <section aria-labelledby="hero-slides-heading">
      <input ref={addInputRef} type="file" accept="image/*" multiple onChange={addSlide} className="hidden" />
      <input ref={replaceInputRef} type="file" accept="image/*" onChange={replaceImage} className="hidden" />

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="hero-slides-heading" className="font-serif text-xl text-foreground">
            Hero fotky
          </h2>
          <span className="text-xs text-foreground/50">
            Aktivní: {activeCount} z {slides.length}
          </span>
        </div>
        <p className="text-xs text-foreground/50">
          Fotky z mobilního hera na úvodní stránce. Přetažením za úchyt změníte pořadí, uloží se hned po puštění.
          Neaktivní fotka se na webu nezobrazí, ale zůstane tady.
        </p>
        <div>
          <button
            type="button"
            onClick={() => addInputRef.current?.click()}
            disabled={upload !== null}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {uploadingNew ? `Nahrávám… ${upload.percent}%` : "Nahrát novou hero fotku"}
          </button>
        </div>
        {(error || loadError) && (
          <p role="alert" className="text-sm text-destructive">
            {error || `Načtení se nepodařilo: ${(loadError as Error).message}`}
          </p>
        )}
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-foreground/50">Loading…</p>
      ) : slides.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-10 text-center text-foreground/50">
          Zatím žádné hero fotky. Nahrajte první.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {slides.map((slide, index) => {
            const replacing = upload?.target === slide.id
            return (
              <li
                key={slide.id}
                draggable={dragEnabledId === slide.id}
                onDragStart={(e) => onDragStart(e, slide.id)}
                onDragOver={(e) => onDragOver(e, slide.id)}
                onDrop={(e) => {
                  e.preventDefault()
                  finishDrag()
                }}
                onDragEnd={finishDrag}
                className={`flex flex-col gap-4 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-start ${
                  slide.isActive ? "" : "opacity-70"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onPointerDown={() => setDragEnabledId(slide.id)}
                    onPointerUp={() => setDragEnabledId(null)}
                    aria-label={`Přetáhnout fotku na pozici ${index + 1}`}
                    className="mt-1 shrink-0 cursor-grab touch-none text-foreground/30 hover:text-foreground/60 active:cursor-grabbing"
                  >
                    <GripVertical className="h-5 w-5" />
                  </button>

                  <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.thumbUrl || "/placeholder.svg"}
                      alt={slide.altCs || `Hero fotka ${index + 1}`}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: slide.objectPosition }}
                      draggable={false}
                    />
                    <span className="absolute left-1 top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-background/90 px-1.5 text-xs font-medium text-foreground">
                      {index + 1}
                    </span>
                    {replacing && (
                      <span className="absolute inset-0 flex items-center justify-center bg-background/80 text-xs text-foreground">
                        {upload.percent}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid min-w-0 flex-1 gap-3">
                  <AltField
                    label="Alt text CZ"
                    value={slide.altCs}
                    onSave={(value) => saveAlt(slide, "alt_cs", value)}
                  />
                  <AltField
                    label="Alt text EN"
                    value={slide.altEn}
                    onSave={(value) => saveAlt(slide, "alt_en", value)}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 sm:w-40 sm:flex-col sm:items-end">
                  <label className="flex items-center gap-2 text-xs text-foreground/70">
                    <Switch
                      checked={slide.isActive}
                      onCheckedChange={(checked) => toggleActive(slide, checked)}
                      aria-label={slide.isActive ? "Deaktivovat fotku" : "Aktivovat fotku"}
                    />
                    {slide.isActive ? "Aktivní" : "Neaktivní"}
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        replacingId.current = slide.id
                        replaceInputRef.current?.click()
                      }}
                      disabled={upload !== null}
                      title="Nahradit fotku"
                      aria-label="Nahradit fotku"
                      className="rounded p-2 text-foreground/60 transition-colors hover:bg-muted hover:text-primary disabled:opacity-40"
                    >
                      <Replace className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(slide)}
                      title="Smazat fotku"
                      aria-label="Smazat fotku"
                      className="rounded p-2 text-foreground/60 transition-colors hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Smazat tuto hero fotku?</AlertDialogTitle>
            <AlertDialogDescription>
              Fotka zmizí z mobilního hera a z tohoto seznamu. Pokud ji jen nechcete zobrazovat, použijte raději
              přepínač Aktivní.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Smazat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

function AltField({
  label,
  value,
  onSave,
}: {
  label: string
  value: string
  onSave: (value: string) => void
}) {
  const [draft, setDraft] = useState(value)

  return (
    <label className="grid gap-1 text-xs text-foreground/50">
      {label}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== value) onSave(draft)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur()
        }}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
      />
    </label>
  )
}
