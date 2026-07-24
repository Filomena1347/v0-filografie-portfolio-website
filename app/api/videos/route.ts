import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface VideoItem {
  id: string;
  publicId: string;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  platform: "instagram" | "tiktok";
  order: number;
}

const FOLDER = "filografie/videos";

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: FOLDER,
      max_results: 100,
      context: true,
    });

    const videos: VideoItem[] = result.resources
      .map((resource: {
        public_id: string;
        secure_url: string;
        context?: { custom?: { video_url?: string; title?: string; platform?: string; order?: string } };
      }) => ({
        id: resource.public_id,
        publicId: resource.public_id,
        thumbnailUrl: resource.secure_url,
        videoUrl: resource.context?.custom?.video_url || "",
        title: resource.context?.custom?.title || "Untitled",
        platform: (resource.context?.custom?.platform as "instagram" | "tiktok") || "instagram",
        order: resource.context?.custom?.order
          ? parseInt(resource.context.custom.order, 10)
          : 999,
      }))
      .sort((a: VideoItem, b: VideoItem) => a.order - b.order);

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ videos: [] });
  }
}
