"use client"

import { useState } from "react"
import { Cloud } from "lucide-react"
import { CloudinaryBrowser } from "@/components/admin/cloudinary-browser"
import type { CloudinaryAsset } from "@/lib/cloudinary-assets"
import type { EventsMediaType } from "@/lib/events-admin"

type EventsBrowsePanelProps = {
  type: EventsMediaType
  existingIds: Set<string>
  onAdd: (asset: CloudinaryAsset) => Promise<void>
}

export function EventsBrowsePanel({ type, existingIds, onAdd }: EventsBrowsePanelProps) {
  const [open, setOpen] = useState(false)
  const noun = type === "photo" ? "photos" : "videos"

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center">
      <Cloud className="h-6 w-6 text-foreground/50" aria-hidden="true" />
      <div>
        <p className="text-sm text-foreground">Add {noun} that are already on Cloudinary</p>
        <p className="mt-1 text-xs text-foreground/50">Search by filename or folder, then select one or more.</p>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Cloud className="h-4 w-4" aria-hidden="true" /> Browse Cloudinary
      </button>

      <CloudinaryBrowser
        open={open}
        onOpenChange={setOpen}
        allow={type === "photo" ? "image" : "video"}
        existingIds={existingIds}
        onAdd={onAdd}
      />
    </div>
  )
}
