'use client'

import { useState } from 'react'
import { Cloud } from 'lucide-react'
import { CloudinaryBrowser } from '@/components/admin/cloudinary-browser'
import type { CloudinaryAsset } from '@/lib/cloudinary-assets'

type BrowseTileProps = {
  type: 'photo' | 'video'
  existingIds: Set<string>
  onAdd: (asset: CloudinaryAsset) => Promise<void>
}

const COPY = {
  photo: { title: 'Add photos', hint: 'Pick photos that are already on Cloudinary.' },
  video: { title: 'Add video', hint: 'Pick videos that are already on Cloudinary.' },
}

export function BrowseTile({ type, existingIds, onAdd }: BrowseTileProps) {
  const [open, setOpen] = useState(false)
  const copy = COPY[type]

  return (
    <div>
      <div className="flex min-h-44 flex-col items-center justify-center gap-4 rounded-[4px] border border-dashed border-ev-muted/50 bg-ev-bg px-5 py-8 text-center">
        <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-ev-soft">
          <Cloud className="size-4" />
        </span>
        <div>
          <p className="font-display text-2xl leading-none">{copy.title}</p>
          <p className="mt-2 text-sm text-ev-muted">{copy.hint}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-ev-text px-4 text-[13px] font-medium text-ev-bg transition-opacity hover:opacity-90"
        >
          <Cloud aria-hidden="true" className="size-3.5" />
          Browse Cloudinary
        </button>
      </div>

      <CloudinaryBrowser
        open={open}
        onOpenChange={setOpen}
        allow={type === 'photo' ? 'image' : 'video'}
        existingIds={existingIds}
        onAdd={onAdd}
      />
    </div>
  )
}
