"use client"

import { useEffect, useRef } from "react"
import { ImageOff, X } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import type { MediaItem } from "@/lib/media"

type Props = {
  title: string
  description: string
  items: MediaItem[]
  onClose: () => void
}

export function CategoryGallery({ title, description, items, onClose }: Props) {
  const { t } = useLanguage()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-gallery-title"
      className="fixed inset-0 z-[100] overflow-y-auto bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 z-10 -mx-6 mb-8 flex items-start justify-between gap-6 bg-background/90 px-6 py-4 backdrop-blur">
          <div>
            <h2 id="category-gallery-title" className="font-serif text-4xl md:text-5xl text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              {description}
              {items.length > 0 && ` · ${items.length} ${t.gallery_items}`}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.gallery_close}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card px-6 py-24 text-center">
            <ImageOff className="h-10 w-10 text-foreground/30" aria-hidden="true" />
            <p className="max-w-sm text-foreground/60 text-pretty">{t.gallery_empty}</p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {items.map((item) => (
              <figure
                key={item.id}
                className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border bg-card"
              >
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    poster={item.thumbnail_url ?? undefined}
                    controls
                    playsInline
                    preload="metadata"
                    className="block w-full h-auto"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.title ?? title}
                    loading="lazy"
                    width={item.width ?? undefined}
                    height={item.height ?? undefined}
                    className="block w-full h-auto"
                  />
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
