import { NextResponse } from "next/server";
import { getVideos } from "@/lib/cloudinary";

export async function GET() {
  const videos = await getVideos();
  return NextResponse.json({ videos });
}
