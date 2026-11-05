/** Removes any Cloudinary transformation segment so the URL points at the untouched original upload. */
export function originalCloudinaryUrl(url: string): string {
  return url.replace(/\/upload\/(?:[^/]+\/)*?(v\d+\/)/, "/upload/$1")
}

function fileNameFor(publicId: string, url: string): string {
  const base = publicId.split("/").pop() || "photo"
  const extension = /\.([a-z0-9]{2,5})(?:\?|$)/i.exec(url)?.[1]
  return extension && !base.toLowerCase().endsWith(`.${extension.toLowerCase()}`) ? `${base}.${extension}` : base
}

/** Downloads the full-resolution original to the device; falls back to opening it if the fetch is blocked. */
export async function downloadOriginal(url: string, publicId: string): Promise<void> {
  const originalUrl = originalCloudinaryUrl(url)
  try {
    const response = await fetch(originalUrl)
    if (!response.ok) throw new Error(`Download failed (${response.status})`)
    const objectUrl = URL.createObjectURL(await response.blob())
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = fileNameFor(publicId, originalUrl)
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000)
  } catch {
    window.open(originalUrl, "_blank", "noopener,noreferrer")
  }
}
