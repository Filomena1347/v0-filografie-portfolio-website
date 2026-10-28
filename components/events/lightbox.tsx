'use client'

import { useEffect, useRef } from 'react'
import { CloudImage } from "@/components/cloud-image"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { EventPhoto } from '@/lib/events-data'

type LightboxProps = {
  photos: EventPhoto[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

const controlClass =
  'flex size-12 items-center justify-center rounded-full bg-white text-ev-text transition-transform duration-200 hover:scale-105 focus-visible:scale-105 focus-visible:outline-white'

export function Lightbox({ photos, index, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const photo = photos[index]
  const total = photos.length

  const go = (step: number) => onIndexChange((index + step + total) % total)

  useEffect(() => {
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowLeft') {
        go(-1)
      } else if (event.key === 'ArrowRight') {
        go(1)
      } else if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${total}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ev-text"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <CloudImage
        key={photo.id}
        src={photo.fullSrc ?? photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="100vw"
        maxWidth={1200}
        className="h-auto max-h-[calc(100dvh-160px)] w-auto max-w-[calc(100vw-40px)] rounded-[4px] bg-ev-soft object-contain md:max-w-[calc(100vw-240px)]"
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className={`absolute right-4 top-4 md:right-8 md:top-8 ${controlClass}`}
      >
        <X aria-hidden="true" className="size-5" />
      </button>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous photo"
        className={`absolute bottom-6 left-1/2 -translate-x-[calc(100%+40px)] md:bottom-auto md:left-6 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 ${controlClass}`}
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>

      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next photo"
        className={`absolute bottom-6 left-1/2 translate-x-10 md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 ${controlClass}`}
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>

      <p
        aria-live="polite"
        className="absolute left-4 top-6 text-sm tabular-nums tracking-[0.1em] text-white md:bottom-8 md:left-1/2 md:top-auto md:-translate-x-1/2"
      >
        {index + 1} / {total}
      </p>
    </div>
  )
}
