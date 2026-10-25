'use client'

import { useRef, useState } from 'react'
import { FolderUp, Plus, Upload } from 'lucide-react'
import { ACCEPT_ATTRIBUTE, collectDroppedFiles } from '@/lib/events-upload'

type AddTileProps = {
  type: 'photo' | 'video'
  onFiles: (files: File[]) => void
  notice: string
  error: string
}

const COPY = {
  photo: { title: 'Add photos', formats: 'JPG, PNG, WebP, HEIC' },
  video: { title: 'Add video', formats: 'MP4, MOV' },
}

export function AddTile({ type, onFiles, notice, error }: AddTileProps) {
  const filesInput = useRef<HTMLInputElement>(null)
  const folderInput = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const copy = COPY[type]

  async function handleDrop(event: React.DragEvent) {
    event.preventDefault()
    setDragging(false)
    onFiles(await collectDroppedFiles(event.dataTransfer))
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    onFiles(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-44 flex-col items-center justify-center gap-4 rounded-[4px] border border-dashed px-5 py-8 text-center transition-colors ${
          dragging ? 'border-ev-text bg-ev-soft' : 'border-ev-muted/50 bg-ev-bg'
        }`}
      >
        <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-ev-soft">
          {dragging ? <Upload className="size-4" /> : <Plus className="size-4" />}
        </span>
        <div>
          <p className="font-display text-2xl leading-none">{copy.title}</p>
          <p className="mt-2 text-sm text-ev-muted">Drop files or a folder here. {copy.formats}.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => filesInput.current?.click()}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-ev-text px-4 text-[13px] font-medium text-ev-bg transition-opacity hover:opacity-90"
          >
            <Upload aria-hidden="true" className="size-3.5" />
            Select files
          </button>
          <button
            type="button"
            onClick={() => folderInput.current?.click()}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-ev-line px-4 text-[13px] transition-colors hover:border-ev-text"
          >
            <FolderUp aria-hidden="true" className="size-3.5" />
            Select folder
          </button>
        </div>

        <input
          ref={filesInput}
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE[type]}
          onChange={handleInput}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        <input
          ref={folderInput}
          type="file"
          multiple
          onChange={handleInput}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          {...{ webkitdirectory: '', directory: '' }}
        />
      </div>

      {notice && <p className="mt-2 text-[13px] text-ev-muted">{notice}</p>}
      {error && (
        <p role="alert" className="mt-2 text-[13px] text-ev-accent">
          {error}
        </p>
      )}
    </div>
  )
}
