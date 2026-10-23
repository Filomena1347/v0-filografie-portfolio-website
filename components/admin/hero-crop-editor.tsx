"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AdminHeroSlide } from "@/lib/hero-slides-admin"

const PHONE_WIDTH = 390
const PHONE_HEIGHT = 844
// The real hero is h-[75svh], so a 390 x 844 phone shows a 390 x 633 hero.
const FRAME_HEIGHT = Math.round(PHONE_HEIGHT * 0.75)
const MIN_SCALE = 0.4

type Position = { x: number; y: number }

const KEYWORDS: Record<string, number> = { left: 0, top: 0, center: 50, right: 100, bottom: 100 }

function parseAxis(token: string | undefined) {
  if (!token) return 50
  if (token in KEYWORDS) return KEYWORDS[token]
  const value = parseFloat(token)
  return token.endsWith("%") && Number.isFinite(value) ? value : 50
}

function parsePosition(value: string): Position {
  const [first, second] = value.trim().toLowerCase().split(/\s+/)
  const swapped = first === "top" || first === "bottom" || second === "left" || second === "right"
  return swapped ? { x: parseAxis(second), y: parseAxis(first) } : { x: parseAxis(first), y: parseAxis(second) }
}

function formatPosition({ x, y }: Position) {
  return `${Math.round(x)}% ${Math.round(y)}%`
}

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))

type HeroCropEditorProps = {
  slide: AdminHeroSlide | null
  onClose: () => void
  onSave: (slide: AdminHeroSlide, objectPosition: string) => Promise<void>
}

export function HeroCropEditor({ slide, onClose, onSave }: HeroCropEditorProps) {
  return (
    <Dialog open={slide !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[94svh] gap-3 overflow-y-auto p-4 sm:max-w-md">
        <DialogHeader className="pr-6 text-left">
          <DialogTitle className="font-serif">Upravit výřez</DialogTitle>
          <DialogDescription>
            Posuňte fotku v rámečku tak, jak se zobrazí na mobilu. Pozice se ukládá v procentech.
          </DialogDescription>
        </DialogHeader>
        {slide && <EditorBody key={slide.id} slide={slide} onClose={onClose} onSave={onSave} />}
      </DialogContent>
    </Dialog>
  )
}

function EditorBody({
  slide,
  onClose,
  onSave,
}: {
  slide: AdminHeroSlide
  onClose: () => void
  onSave: HeroCropEditorProps["onSave"]
}) {
  const initial = parsePosition(slide.objectPosition)
  const [position, setPosition] = useState<Position>(initial)
  const [dragging, setDragging] = useState(false)
  const [previewLang, setPreviewLang] = useState<"cs" | "en">("cs")
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null)
  const [frameScale, setFrameScale] = useState(1)
  const [iframeReady, setIframeReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; origin: Position } | null>(null)

  useEffect(() => {
    const img = new window.Image()
    img.onload = () => setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
    img.src = slide.thumbUrl
  }, [slide.thumbUrl])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const update = () => {
      const byWidth = container.clientWidth / PHONE_WIDTH
      const byHeight = (window.innerHeight - 300) / FRAME_HEIGHT
      setFrameScale(clamp(Math.min(byWidth, byHeight), MIN_SCALE, 1))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(container)
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.source !== iframeRef.current?.contentWindow) return
      if (event.data?.type === "hero-preview-ready") setIframeReady(true)
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  const formatted = formatPosition(position)

  useEffect(() => {
    if (!iframeReady) return
    iframeRef.current?.contentWindow?.postMessage(
      { type: "hero-preview-position", value: formatted },
      window.location.origin,
    )
  }, [formatted, iframeReady])

  useEffect(() => {
    if (!iframeReady) return
    iframeRef.current?.contentWindow?.postMessage(
      { type: "hero-preview-lang", value: previewLang },
      window.location.origin,
    )
  }, [previewLang, iframeReady])

  function overflowFor(size: { width: number; height: number }) {
    const coverScale = Math.max(PHONE_WIDTH / size.width, FRAME_HEIGHT / size.height)
    return {
      x: size.width * coverScale - PHONE_WIDTH,
      y: size.height * coverScale - FRAME_HEIGHT,
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: position }
    setDragging(true)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || !naturalSize) return
    const overflow = overflowFor(naturalSize)
    const dx = (e.clientX - drag.startX) / frameScale
    const dy = (e.clientY - drag.startY) / frameScale
    // object-position p% shifts the photo by -p% of its overflow, so dragging right lowers x.
    setPosition({
      x: overflow.x > 0.5 ? clamp(drag.origin.x - (dx / overflow.x) * 100) : drag.origin.x,
      y: overflow.y > 0.5 ? clamp(drag.origin.y - (dy / overflow.y) * 100) : drag.origin.y,
    })
  }

  function endDrag() {
    dragRef.current = null
    setDragging(false)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 5 : 1
    const moves: Record<string, Position> = {
      ArrowLeft: { x: step, y: 0 },
      ArrowRight: { x: -step, y: 0 },
      ArrowUp: { x: 0, y: step },
      ArrowDown: { x: 0, y: -step },
    }
    const move = moves[e.key]
    if (!move) return
    e.preventDefault()
    setPosition((p) => ({ x: clamp(p.x + move.x), y: clamp(p.y + move.y) }))
  }

  async function save() {
    setSaving(true)
    setError("")
    try {
      await onSave(slide, formatted)
      onClose()
    } catch (err) {
      setError((err as Error).message)
      setSaving(false)
    }
  }

  const previewSrc = `/admin/hero-preview?slide=${encodeURIComponent(slide.id)}&lang=cs`

  return (
    <>
      <div ref={containerRef} className="flex justify-center">
        <div
          className="relative overflow-hidden rounded-xl border border-border bg-background"
          style={{ width: PHONE_WIDTH * frameScale, height: FRAME_HEIGHT * frameScale }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: PHONE_WIDTH, height: FRAME_HEIGHT, transform: `scale(${frameScale})` }}
          >
            <iframe
              ref={iframeRef}
              src={previewSrc}
              title="Náhled mobilního hera"
              tabIndex={-1}
              className="pointer-events-none absolute left-0 top-0 border-0"
              style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT }}
            />
            <div
              role="group"
              tabIndex={0}
              aria-label="Posunout fotku. Táhněte myší nebo prstem, nebo použijte šipky."
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={onKeyDown}
              className="absolute inset-0 z-10 cursor-grab touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-primary active:cursor-grabbing"
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 transition-opacity duration-150 ${
                  dragging ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="absolute inset-y-0 left-1/3 w-px bg-foreground/50" />
                <span className="absolute inset-y-0 left-2/3 w-px bg-foreground/50" />
                <span className="absolute inset-x-0 top-1/3 h-px bg-foreground/50" />
                <span className="absolute inset-x-0 top-2/3 h-px bg-foreground/50" />
                <span className="absolute left-1/2 top-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-foreground" />
                <span className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-foreground" />
              </div>
            </div>
          </div>
          {!iframeReady && (
            <span className="absolute inset-0 flex items-center justify-center bg-background text-xs text-foreground/50">
              Načítám náhled…
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-foreground">
          <span className="text-foreground/50">Poloha: </span>
          <span className="tabular-nums">{formatted}</span>
        </p>
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Jazyk náhledu" className="flex rounded-full border border-border p-0.5 text-xs">
            {(["cs", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setPreviewLang(l)}
                aria-pressed={previewLang === l}
                className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
                  previewLang === l ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPosition({ x: 50, y: 50 })}
            className="rounded-full border border-border px-3 py-1 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Na střed
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <DialogFooter className="flex-row justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="rounded-full border border-border px-5 py-2 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          Zrušit
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Ukládám…" : "Uložit"}
        </button>
      </DialogFooter>
    </>
  )
}
