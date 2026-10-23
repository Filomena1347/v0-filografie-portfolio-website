'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import type { EventPhoto } from '@/lib/events-data'
import { Lightbox } from './lightbox'

export function PhotoGrid({ photos }: { photos: EventPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const lastTrigger = useRef<number | null>(null)

  const open = (index: number) => {
    lastTrigger.current = index
    setOpenIndex(index)
  }

  const close = useCallback(() => {
    setOpenIndex(null)
    const index = lastTrigger.current
    if (index !== null) {
      requestAnimationFrame(() => triggerRefs.current[index]?.focus())
    }
  }, [])

  return (
    <>
      <ul className="columns-2 gap-4">
        {photos.map((photo, index) => (
          <li key={photo.id} className="mb-4 break-inside-avoid">
            <button
              type="button"
              ref={(node) => {
                triggerRefs.current[index] = node
              }}
              onClick={() => open(index)}
              aria-haspopup="dialog"
              aria-label={`Open photo ${index + 1} of ${photos.length}`}
              className="block w-full cursor-zoom-in overflow-hidden rounded-[4px] bg-ev-soft"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1360px) 440px, (min-width: 920px) 36vw, 50vw"
                className="block h-auto w-full"
              />
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={close}
        />
      )}
    </>
  )
}
