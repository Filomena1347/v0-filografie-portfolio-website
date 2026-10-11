import { NextResponse } from "next/server";
import { updateVideoMeta } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const password = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { publicId, title, platform, order } = await request.json();

    if (!publicId || !title || !platform || order === undefined) {
      return NextResponse.json(
        { error: "publicId, title, platform, and order are required" },
        { status: 400 }
      );
    }

    const success = await updateVideoMeta(publicId, title, platform, order);

    if (!success) {
      return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
