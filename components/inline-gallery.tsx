"use client"

import type { MediaItem } from "@/lib/media"

type InlineGalleryProps = {
  items: MediaItem[]
  emptyLabel: string
  animationKey: string
}

export function InlineGallery({ items, emptyLabel, animationKey }: InlineGalleryProps) {
  return (
    <div
      key={animationKey}
      className="bg-background"
      style={{ animation: "fadeUp 0.6s ease both" }}
    >
      {items.length === 0 ? (
        <p className="py-20 text-center text-sm text-foreground/60">{emptyLabel}</p>
      ) : (
        <div className="columns-2 gap-0 md:columns-4">
          {items.map((item) =>
            item.type === "video" ? (
              <video
                key={item.id}
                src={item.url}
                poster={item.thumbnail_url ?? undefined}
                controls
                playsInline
                preload="metadata"
                className="block h-auto w-full break-inside-avoid object-contain"
              />
            ) : (
              // Natural aspect ratio is unknown for uploads, so a plain img keeps photos uncropped.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.id}
                src={item.url || "/placeholder.svg"}
                alt={item.title ?? ""}
                loading="lazy"
                className="block h-auto w-full break-inside-avoid object-contain"
              />
            ),
          )}
        </div>
      )}
    </div>
  )
}
