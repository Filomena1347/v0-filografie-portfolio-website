import { NextResponse } from "next/server"

// Always evaluate env vars at request time; never serve a cached/prerendered
// "not configured" response.
export const dynamic = "force-dynamic"

// Returns the public Cloudinary values needed for direct (unsigned) browser
// uploads. Cloud name and preset name are not secrets — the cloud name appears
// in every delivery URL and the preset is meant for unsigned client uploads.
// We read the server-side CLOUDINARY_CLOUD_NAME here because it is the source
// of truth (the NEXT_PUBLIC_* value may be misconfigured).
export async function GET() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    ""
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""

  return NextResponse.json({
    cloudName,
    uploadPreset,
    configured: Boolean(cloudName && uploadPreset),
  })
}
