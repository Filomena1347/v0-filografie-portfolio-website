export type UploadKind = "photo" | "video" | "poster"

export type UploadedAsset = {
  publicId: string
  url: string
  width: number | null
  height: number | null
}

export type UploadJob = {
  id: string
  file: File
  status: "queued" | "uploading" | "saving" | "done" | "error"
  percent: number
  error?: string
}

export class UnauthorizedError extends Error {}

const EXTENSIONS: Record<UploadKind, string[]> = {
  photo: ["jpg", "jpeg", "png", "webp", "heic"],
  video: ["mp4", "mov"],
  poster: ["jpg", "jpeg", "png", "webp"],
}

export const ACCEPT_ATTRIBUTE: Record<UploadKind, string> = {
  photo: ".jpg,.jpeg,.png,.webp,.heic",
  video: ".mp4,.mov",
  poster: ".jpg,.jpeg,.png,.webp",
}

// Cloudinary rejects single video requests above 100 MB, so larger files go up in chunks.
const CHUNK_THRESHOLD = 100 * 1024 * 1024
const CHUNK_SIZE = 20 * 1024 * 1024

function extensionOf(name: string) {
  const dot = name.lastIndexOf(".")
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase()
}

export function isAcceptedFile(file: File, kind: UploadKind) {
  return EXTENSIONS[kind].includes(extensionOf(file.name))
}

export function sortFilesByPath(files: File[]) {
  const pathOf = (file: File) => file.webkitRelativePath || file.name
  return [...files].sort((a, b) => pathOf(a).localeCompare(pathOf(b), undefined, { numeric: true }))
}

export async function requestJson(url: string, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init.headers },
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) throw new UnauthorizedError("Unauthorized")
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
  return data
}

type CloudinaryResponse = {
  public_id?: string
  secure_url?: string
  width?: number
  height?: number
}

function sendForm(
  url: string,
  form: FormData,
  headers: Record<string, string>,
  onProgress: (loaded: number) => void,
): Promise<CloudinaryResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url)
    for (const [name, value] of Object.entries(headers)) xhr.setRequestHeader(name, value)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded)
    }
    xhr.onload = () => {
      let body: (CloudinaryResponse & { error?: { message?: string } }) | null = null
      try {
        body = JSON.parse(xhr.responseText)
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && body) {
        resolve(body)
        return
      }
      reject(new Error(body?.error?.message ?? `Upload failed (HTTP ${xhr.status})`))
    }
    xhr.onerror = () => reject(new Error("Network error during upload"))
    xhr.send(form)
  })
}

/**
 * Uploads straight to Cloudinary using a signature from our server, so the file
 * never passes through the Next.js server.
 */
export async function uploadAsset(
  file: File,
  kind: UploadKind,
  onProgress: (percent: number) => void,
): Promise<UploadedAsset> {
  const signed = await requestJson("/api/admin/events/sign", {
    method: "POST",
    body: JSON.stringify({ kind }),
  })

  const endpoint = `https://api.cloudinary.com/v1_1/${signed.cloudName}/${signed.resourceType}/upload`
  const fields: Record<string, string> = {
    api_key: signed.apiKey,
    timestamp: String(signed.timestamp),
    signature: signed.signature,
    folder: signed.folder,
    allowed_formats: signed.allowedFormats,
  }

  function buildForm(blob: Blob) {
    const form = new FormData()
    for (const [name, value] of Object.entries(fields)) form.append(name, value)
    form.append("file", blob, file.name)
    return form
  }

  const percentOf = (loaded: number) => Math.min(99, Math.round((loaded / file.size) * 100))
  let result: CloudinaryResponse

  if (file.size <= CHUNK_THRESHOLD) {
    result = await sendForm(endpoint, buildForm(file), {}, (loaded) => onProgress(percentOf(loaded)))
  } else {
    const uploadId = crypto.randomUUID()
    result = {}
    for (let start = 0; start < file.size; start += CHUNK_SIZE) {
      const end = Math.min(start + CHUNK_SIZE, file.size)
      result = await sendForm(
        endpoint,
        buildForm(file.slice(start, end)),
        {
          "X-Unique-Upload-Id": uploadId,
          "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
        },
        (loaded) => onProgress(percentOf(start + loaded)),
      )
    }
  }

  if (!result.public_id || !result.secure_url) {
    throw new Error("Cloudinary did not return the uploaded file")
  }
  onProgress(100)
  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width ?? null,
    height: result.height ?? null,
  }
}

async function readEntry(entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) {
    return new Promise((resolve) => {
      ;(entry as FileSystemFileEntry).file(
        (file) => resolve([file]),
        () => resolve([]),
      )
    })
  }

  const reader = (entry as FileSystemDirectoryEntry).createReader()
  const children: FileSystemEntry[] = []
  // readEntries hands back results in batches until it returns an empty list.
  for (;;) {
    const batch = await new Promise<FileSystemEntry[]>((resolve) => reader.readEntries(resolve, () => resolve([])))
    if (batch.length === 0) break
    children.push(...batch)
  }
  return (await Promise.all(children.map(readEntry))).flat()
}

/** Files from a drop, including everything inside dropped folders. */
export async function collectDroppedFiles(dataTransfer: DataTransfer): Promise<File[]> {
  // The entries must be read synchronously, before the first await.
  const entries = Array.from(dataTransfer.items ?? [])
    .map((item) => (item.kind === "file" ? item.webkitGetAsEntry?.() : null))
    .filter((entry): entry is FileSystemEntry => Boolean(entry))

  if (entries.length === 0) return Array.from(dataTransfer.files)
  return (await Promise.all(entries.map(readEntry))).flat()
}
