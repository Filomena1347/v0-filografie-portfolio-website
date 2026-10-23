import { NextResponse } from "next/server"
import { cloudinary } from "@/lib/cloudinary"
import { isAuthed } from "@/lib/auth"
import { EVENTS_FOLDER, EVENTS_POSTERS_FOLDER, PHOTO_FORMATS, VIDEO_FORMATS, getCloudName } from "@/lib/events-admin"

export const dynamic = "force-dynamic"

const KINDS = {
  photo: { resourceType: "image", folder: EVENTS_FOLDER, formats: PHOTO_FORMATS },
  video: { resourceType: "video", folder: EVENTS_FOLDER, formats: VIDEO_FORMATS },
  poster: { resourceType: "image", folder: EVENTS_POSTERS_FOLDER, formats: ["jpg", "jpeg", "png", "webp"] },
} as const

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as { kind?: string }
  const kind = body.kind && body.kind in KINDS ? KINDS[body.kind as keyof typeof KINDS] : null
  if (!kind) {
    return NextResponse.json({ error: "kind must be photo, video or poster" }, { status: 400 })
  }

  const cloudName = getCloudName()
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 })
  }

  // Everything in this object is covered by the signature, so the browser cannot
  // change the folder or the allowed formats.
  const timestamp = Math.round(Date.now() / 1000)
  const allowedFormats = kind.formats.join(",")
  const signature = cloudinary.utils.api_sign_request(
    { allowed_formats: allowedFormats, folder: kind.folder, timestamp },
    apiSecret,
  )

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder: kind.folder,
    allowedFormats,
    resourceType: kind.resourceType,
  })
}
