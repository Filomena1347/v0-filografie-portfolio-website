import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // "videos web" key (unrestricted: upload + delete). Falls back to the
  // original CLOUDINARY_* vars if the newer ones are not present.
  api_key: process.env.API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.API_KEY_2 || process.env.CLOUDINARY_API_SECRET,
});

export interface GalleryImage {
  id: string;
  publicId: string;
  url: string;
  width: number;
  height: number;
  order: number;
  category: string;
}

const FOLDER_PREFIX = "filografie";

export function getCategoryFolder(category: string): string {
  return `${FOLDER_PREFIX}/${category}`;
}

export async function getImagesByCategory(category: string): Promise<GalleryImage[]> {
  const folder = getCategoryFolder(category);
  
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder,
      max_results: 500,
      context: true,
      metadata: true,
    });

    const images: GalleryImage[] = result.resources.map((resource: {
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
      context?: { custom?: { order?: string } };
    }) => ({
      id: resource.public_id,
      publicId: resource.public_id,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      order: resource.context?.custom?.order 
        ? parseInt(resource.context.custom.order, 10) 
        : 999,
      category,
    }));

    // Sort by order
    return images.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error fetching images from Cloudinary:", error);
    return [];
  }
}

export async function uploadImage(
  file: Buffer,
  category: string,
  filename: string
): Promise<GalleryImage | null> {
  const folder = getCategoryFolder(category);
  
  try {
    // Get current max order
    const existingImages = await getImagesByCategory(category);
    const maxOrder = existingImages.length > 0 
      ? Math.max(...existingImages.map(img => img.order)) 
      : 0;
    const newOrder = maxOrder + 1;

    const result = await new Promise<{
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
    }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: filename.replace(/\.[^/.]+$/, ""), // Remove extension
          context: `order=${newOrder}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as {
            public_id: string;
            secure_url: string;
            width: number;
            height: number;
          });
        }
      ).end(file);
    });

    return {
      id: result.public_id,
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      order: newOrder,
      category,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

export async function updateImageOrder(
  publicId: string,
  order: number
): Promise<boolean> {
  try {
    await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      context: `order=${order}`,
    });
    return true;
  } catch (error) {
    console.error("Error updating image order:", error);
    return false;
  }
}

export async function reorderImages(
  images: { publicId: string; order: number }[]
): Promise<boolean> {
  try {
    await Promise.all(
      images.map(img => updateImageOrder(img.publicId, img.order))
    );
    return true;
  } catch (error) {
    console.error("Error reordering images:", error);
    return false;
  }
}

// ── Video (Reels) helpers ───────────────────────────────────────────────────

export interface VideoItem {
  id: string;
  publicId: string;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  platform: "instagram" | "tiktok";
  order: number;
}

const VIDEO_FOLDER = `${FOLDER_PREFIX}/videos`;

function buildVideoContext(title: string, platform: string, order: number): string {
  // Sanitize to keep the pipe-delimited context format safe
  const safeTitle = title.replace(/[|=]/g, " ").slice(0, 200);
  return `title=${safeTitle}|platform=${platform}|order=${order}`;
}

export async function getVideos(): Promise<VideoItem[]> {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "video",
      prefix: VIDEO_FOLDER,
      max_results: 100,
      context: true,
    });

    const videos: VideoItem[] = result.resources.map((resource: {
      public_id: string;
      secure_url: string;
      context?: { custom?: { title?: string; platform?: string; order?: string } };
    }) => ({
      id: resource.public_id,
      publicId: resource.public_id,
      thumbnailUrl: cloudinary.url(resource.public_id, {
        resource_type: "video",
        format: "jpg",
      }),
      videoUrl: resource.secure_url,
      title: resource.context?.custom?.title || "Untitled",
      platform: (resource.context?.custom?.platform as "instagram" | "tiktok") || "instagram",
      order: resource.context?.custom?.order
        ? parseInt(resource.context.custom.order, 10)
        : 999,
    }));

    return videos.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error fetching videos from Cloudinary:", error);
    return [];
  }
}

export async function uploadVideo(
  file: Buffer,
  filename: string,
  title: string,
  platform: string,
  order: number
): Promise<VideoItem | null> {
  try {
    const result = await new Promise<{ public_id: string; secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: VIDEO_FOLDER,
              public_id: filename.replace(/\.[^/.]+$/, ""),
              resource_type: "video",
              context: buildVideoContext(title, platform, order),
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { public_id: string; secure_url: string });
            }
          )
          .end(file);
      }
    );

    return {
      id: result.public_id,
      publicId: result.public_id,
      thumbnailUrl: cloudinary.url(result.public_id, {
        resource_type: "video",
        format: "jpg",
      }),
      videoUrl: result.secure_url,
      title,
      platform: platform as "instagram" | "tiktok",
      order,
    };
  } catch (error) {
    console.error("Error uploading video:", error);
    return null;
  }
}

export async function updateVideoMeta(
  publicId: string,
  title: string,
  platform: string,
  order: number
): Promise<boolean> {
  try {
    await cloudinary.uploader.explicit(publicId, {
      type: "upload",
      resource_type: "video",
      context: buildVideoContext(title, platform, order),
    });
    return true;
  } catch (error) {
    console.error("Error updating video:", error);
    return false;
  }
}

export async function deleteVideo(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    return true;
  } catch (error) {
    console.error("Error deleting video:", error);
    return false;
  }
}

export default cloudinary;
