import { NextResponse } from "next/server";
import { updateVideoMeta } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const password = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { videos } = await request.json();

    if (!videos || !Array.isArray(videos)) {
      return NextResponse.json({ error: "videos array is required" }, { status: 400 });
    }

    const success = await Promise.all(
      videos.map((v: { publicId: string; title: string; platform: string; order: number }) =>
        updateVideoMeta(v.publicId, v.title, v.platform, v.order)
      )
    );

    if (success.some((ok) => !ok)) {
      return NextResponse.json({ error: "Failed to reorder some videos" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
