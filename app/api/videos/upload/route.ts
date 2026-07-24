import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = "filografie/videos";

export async function POST(request: Request) {
  const password = request.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("thumbnail") as File | null;
    const videoUrl = formData.get("videoUrl") as string;
    const title = formData.get("title") as string;
    const platform = formData.get("platform") as string;
    const order = formData.get("order") as string;

    if (!title || !platform) {
      return NextResponse.json({ error: "Title and platform are required" }, { status: 400 });
    }

    let thumbnailUrl = "";
    let publicId = "";

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now();
      const filename = `${timestamp}_thumbnail`;

      const uploaded = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: FOLDER,
                public_id: filename,
                context: `title=${title}|platform=${platform}|video_url=${videoUrl}|order=${order || "999"}`,
              },
              (error, result) => {
                if (error || !result) reject(error);
                else resolve(result as { secure_url: string; public_id: string });
              }
            )
            .end(buffer);
        }
      );

      thumbnailUrl = uploaded.secure_url;
      publicId = uploaded.public_id;
    } else {
      // No thumbnail — store as a minimal resource using a 1x1 placeholder approach
      // We still need a Cloudinary resource to hold metadata, so use a tiny data URI
      const placeholderBuffer = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64"
      );
      const timestamp = Date.now();
      const filename = `${timestamp}_placeholder`;

      const uploaded = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: FOLDER,
                public_id: filename,
                context: `title=${title}|platform=${platform}|video_url=${videoUrl}|order=${order || "999"}`,
              },
              (error, result) => {
                if (error || !result) reject(error);
                else resolve(result as { secure_url: string; public_id: string });
              }
            )
            .end(placeholderBuffer);
        }
      );

      thumbnailUrl = uploaded.secure_url;
      publicId = uploaded.public_id;
    }

    const video = {
      id: publicId,
      publicId,
      thumbnailUrl,
      videoUrl,
      title,
      platform,
      order: parseInt(order || "999", 10),
    };

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
