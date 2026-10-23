import { revalidatePath } from "next/cache"
import { cloudinary } from "@/lib/cloudinary"

export type EventsMediaType = "photo" | "video"

export type AdminEventItem = {
  id: string
  type: EventsMediaType
  cloudinary_public_id: string
  url: string
  poster_url: string | null
  width: number | null
  height: number | null
  sort_order: number
  created_at: string
}

export const EVENTS_FOLDER = "events"
export const EVENTS_POSTERS_FOLDER = "events/posters"

export const PHOTO_FORMATS = ["jpg", "jpeg", "png", "webp", "heic"]
export const VIDEO_FORMATS = ["mp4", "mov"]

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isMediaType(value: unknown): value is EventsMediaType {
  return value === "photo" || value === "video"
}

export function getCloudName() {
  return process.env.CLOUDINARY_CLOUD_NAME
}

export function toResourceType(type: EventsMediaType) {
  return type === "video" ? "video" : "image"
}

/** A delivery URL on our own Cloudinary account for the given resource type. */
export function isOwnCloudinaryUrl(value: unknown, resourceType: "image" | "video") {
  const cloud = getCloudName()
  if (!cloud || typeof value !== "string") return false
  return value.startsWith(`https://res.cloudinary.com/${cloud}/${resourceType}/upload/`)
}

/** "https://res.cloudinary.com/c/image/upload/v123/events/posters/abc.jpg" -> "events/posters/abc" */
export function publicIdFromUrl(url: string) {
  const match = url.match(/\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?([^/]+(?:\/[^/]+)*)$/)
  if (!match) return null
  return match[1].replace(/\.[^./]+$/, "")
}

export function isPosterPublicId(publicId: string) {
  return publicId.startsWith(`${EVENTS_POSTERS_FOLDER}/`)
}

export function isItemPublicId(publicId: string) {
  return publicId.startsWith(`${EVENTS_FOLDER}/`) && !isPosterPublicId(publicId)
}

/** Returns true when the asset is gone from Cloudinary (deleted now or already missing). */
export async function destroyCloudinaryAsset(publicId: string, resourceType: "image" | "video") {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true })
    return result?.result === "ok" || result?.result === "not found"
  } catch (error) {
    console.log("[v0] events destroy failed:", (error as Error).message)
    return false
  }
}

export function revalidateEvents() {
  revalidatePath("/events")
}
