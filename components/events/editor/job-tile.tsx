'use client'

import { X } from 'lucide-react'
import type { UploadJob } from '@/lib/events-upload'

type JobTileProps = {
  job: UploadJob
  aspect: string
  onDismiss: (id: string) => void
}

const STATUS_LABEL = {
  queued: 'Waiting',
  uploading: 'Uploading',
  saving: 'Saving',
  done: 'Done',
  error: 'Failed',
} as const

/** Placeholder shown where an upload will land, until the real item replaces it. */
export function JobTile({ job, aspect, onDismiss }: JobTileProps) {
  const failed = job.status === 'error'
  const label = `${STATUS_LABEL[job.status]}: ${job.file.name}`

  return (
    <div className={`relative flex flex-col justify-end overflow-hidden rounded-[4px] bg-ev-soft p-4 ${aspect}`}>
      <p className="truncate text-[13px]" title={job.file.name}>
        {job.file.name}
      </p>
      {failed ? (
        <p role="alert" className="mt-1 text-[13px] text-ev-accent">
          {job.error ?? 'Upload failed'}
        </p>
      ) : (
        <>
          <p className="mt-1 text-[13px] text-ev-muted">
            {STATUS_LABEL[job.status]}
            {job.status === 'uploading' ? ` ${job.percent}%` : ''}
          </p>
          <div
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={job.percent}
            className="mt-3 h-1 overflow-hidden rounded-full bg-ev-line"
          >
            <div className="h-full bg-ev-text transition-[width] duration-200" style={{ width: `${job.percent}%` }} />
          </div>
        </>
      )}

      {failed && (
        <button
          type="button"
          onClick={() => onDismiss(job.id)}
          aria-label={`Dismiss failed upload ${job.file.name}`}
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.12)]"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      )}
    </div>
  )
}
