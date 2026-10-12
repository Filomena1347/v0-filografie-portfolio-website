import { NextResponse } from "next/server"
import { isAuthed } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  // The server cloud name is the verified working account; the public one is only a fallback.
  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "duntvai9w",
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "videos",
  })
}
