import { NextResponse } from "next/server";
import { uploadVideo } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const password = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const platform = (formData.get("platform") as string) || "instagram";
    const order = formData.get("order") as string;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "A video file is required" }, { status: 400 });
    }
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;

    const video = await uploadVideo(
      buffer,
      filename,
      title.trim(),
      platform,
      parseInt(order || "999", 10)
    );

    if (!video) {
      return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
    }

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
