"use client"

import { useRef, useState } from "react"
import { AlertCircle, Check, FolderUp, Loader2, Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ACCEPT_ATTRIBUTE, collectDroppedFiles, type UploadJob, type UploadKind } from "@/lib/events-upload"
import type { EventsMediaType } from "@/lib/events-admin"

export type { UploadJob }

type DropzoneProps = {
  type: EventsMediaType
  onFiles: (files: File[]) => void
}

const COPY: Record<EventsMediaType, { noun: string; formats: string }> = {
  photo: { noun: "photos", formats: "JPG, JPEG, PNG, WEBP or HEIC" },
  video: { noun: "videos", formats: "MP4 or MOV" },
}

export function EventsDropzone({ type, onFiles }: DropzoneProps) {
  const filesInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const kind: UploadKind = type
  const copy = COPY[type]

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    if (files.length > 0) onFiles(files)
  }

  async function handleDrop(event: React.DragEvent) {
    event.preventDefault()
    setDragging(false)
    const files = await collectDroppedFiles(event.dataTransfer)
    if (files.length > 0) onFiles(files)
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false)
      }}
      onDrop={handleDrop}
      className={`flex flex-col items-center gap-4 rounded-lg border border-dashed px-6 py-10 text-center transition-colors ${
        dragging ? "border-primary bg-primary/5" : "border-border bg-card"
      }`}
    >
      <Upload className="h-6 w-6 text-foreground/50" aria-hidden="true" />
      <div>
        <p className="text-sm text-foreground">Drag and drop {copy.noun} or a whole folder here</p>
        <p className="mt-1 text-xs text-foreground/50">{copy.formats}</p>
      </div>

      <input
        ref={filesInputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTRIBUTE[kind]}
        onChange={handleInput}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        onChange={handleInput}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        {...({ webkitdirectory: "" } as Record<string, string>)}
      />

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => filesInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Upload className="h-4 w-4" aria-hidden="true" /> Select files
        </button>
        <button
          type="button"
          onClick={() => folderInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground/70 transition-colors hover:text-primary"
        >
          <FolderUp className="h-4 w-4" aria-hidden="true" /> Select folder
        </button>
      </div>
    </div>
  )
}

function StatusLabel({ job }: { job: UploadJob }) {
  if (job.status === "done") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-foreground/60">
        <Check className="h-3.5 w-3.5" aria-hidden="true" /> Done
      </span>
    )
  }
  if (job.status === "error") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-destructive">
        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> {job.error}
      </span>
    )
  }
  if (job.status === "saving") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-foreground/60">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Saving
      </span>
    )
  }
  return (
    <span className="text-xs tabular-nums text-foreground/60">
      {job.status === "queued" ? "Waiting" : `${job.percent}%`}
    </span>
  )
}

export function UploadQueue({ jobs, onClearFinished }: { jobs: UploadJob[]; onClearFinished: () => void }) {
  if (jobs.length === 0) return null
  const hasFinished = jobs.some((job) => job.status === "done" || job.status === "error")

  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-foreground">
          Uploads ({jobs.filter((job) => job.status === "done").length}/{jobs.length})
        </p>
        {hasFinished && (
          <button
            type="button"
            onClick={onClearFinished}
            className="text-xs text-foreground/60 transition-colors hover:text-primary"
          >
            Clear finished
          </button>
        )}
      </div>
      <ul className="flex max-h-72 flex-col gap-3 overflow-y-auto" aria-live="polite">
        {jobs.map((job) => (
          <li key={job.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-sm text-foreground/80">{job.file.name}</span>
              <StatusLabel job={job} />
            </div>
            <Progress value={job.percent} aria-label={`Upload progress for ${job.file.name}`} className="h-1.5" />
          </li>
        ))}
      </ul>
    </div>
  )
}
