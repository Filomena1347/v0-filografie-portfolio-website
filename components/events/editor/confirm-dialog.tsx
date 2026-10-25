'use client'

import { useEffect, useRef } from 'react'

type ConfirmDialogProps = {
  title: string
  description: string
  confirmLabel: string
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, description, confirmLabel, busy, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="ev-confirm-title"
      aria-describedby="ev-confirm-description"
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onCancel()
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !busy) onCancel()
      }}
      className="m-auto w-[calc(100%-40px)] max-w-sm rounded-[4px] border border-ev-line bg-ev-bg p-0 text-ev-text shadow-[0_8px_40px_rgba(0,0,0,0.12)] backdrop:bg-black/40"
    >
      <div className="flex flex-col gap-5 p-8">
        <div>
          <h2 id="ev-confirm-title" className="font-display text-3xl leading-none">
            {title}
          </h2>
          <p id="ev-confirm-description" className="mt-3 text-sm leading-relaxed text-ev-muted">
            {description}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="h-11 flex-1 rounded-full bg-ev-text px-5 text-sm font-medium text-ev-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? 'Deleting…' : confirmLabel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            disabled={busy}
            className="h-11 rounded-full border border-ev-line px-5 text-sm transition-colors hover:border-ev-text disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  )
}
