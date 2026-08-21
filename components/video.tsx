"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Upload,
  Loader2,
  Trash2,
  GripVertical,
} from "lucide-react";
import { useAdmin } from "@/contexts/admin-context";
import { useLanguage } from "@/contexts/language-context";

// ── Platform SVG icons ──────────────────────────────────────────────────────

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-label="Instagram"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-label="TikTok"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}

// ── Types ───────────────────────────────────────────────────────────────────

interface VideoItem {
  id: string;
  publicId: string;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  platform: "instagram" | "tiktok";
  order: number;
}

// ── Demo data (shown while Cloudinary loads or when empty) ─────────────────

const DEMO_VIDEOS: VideoItem[] = [
  {
    id: "demo-1",
    publicId: "demo-1",
    thumbnailUrl: "/placeholder.svg?height=640&width=360",
    videoUrl: "",
    title: "Golden Hour Reel",
    platform: "instagram",
    order: 1,
  },
  {
    id: "demo-2",
    publicId: "demo-2",
    thumbnailUrl: "/placeholder.svg?height=640&width=360",
    videoUrl: "",
    title: "Urban Stories",
    platform: "tiktok",
    order: 2,
  },
  {
    id: "demo-3",
    publicId: "demo-3",
    thumbnailUrl: "/placeholder.svg?height=640&width=360",
    videoUrl: "",
    title: "Wedding Moments",
    platform: "instagram",
    order: 3,
  },
  {
    id: "demo-4",
    publicId: "demo-4",
    thumbnailUrl: "/placeholder.svg?height=640&width=360",
    videoUrl: "",
    title: "Event Highlight",
    platform: "tiktok",
    order: 4,
  },
  {
    id: "demo-5",
    publicId: "demo-5",
    thumbnailUrl: "/placeholder.svg?height=640&width=360",
    videoUrl: "",
    title: "Brand Campaign",
    platform: "instagram",
    order: 5,
  },
];

// ── CoverFlow Card ──────────────────────────────────────────────────────────

interface CardProps {
  video: VideoItem;
  position: number; // relative to active: -2,-1,0,1,2
  onClick: () => void;
  onDelete?: () => void;
  onTitleSave?: (title: string) => void;
  onPlatformToggle?: () => void;
  isAdmin: boolean;
  isDeleting: boolean;
}

function CoverFlowCard({
  video,
  position,
  onClick,
  onDelete,
  onTitleSave,
  onPlatformToggle,
  isAdmin,
  isDeleting,
}: CardProps) {
  const abs = Math.abs(position);
  const isDemo = video.id.startsWith("demo");

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(video.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform: dndTransform,
    transition: dndTransition,
    isDragging,
  } = useSortable({ id: video.id, disabled: !isAdmin || isDemo });

  // Only render up to 2 cards away
  if (abs > 2) return null;

  const isActive = position === 0;

  // Coverflow transform values
  const translateX = position * 62; // % offset
  const rotateY = position * -35; // degrees
  const scale = isActive ? 1 : abs === 1 ? 0.78 : 0.6;
  const opacity = isActive ? 1 : abs === 1 ? 0.65 : 0.35;
  const zIndex = isDragging ? 20 : isActive ? 10 : abs === 1 ? 6 : 2;
  const brightness = isActive ? 1 : abs === 1 ? 0.6 : 0.35;

  // Compose the drag offset (screen-space) on top of the coverflow position
  const dragOffset = dndTransform
    ? `translate3d(${dndTransform.x}px, ${dndTransform.y}px, 0) `
    : "";

  const commitTitle = () => {
    setIsEditingTitle(false);
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== video.title) {
      onTitleSave?.(trimmed);
    } else {
      setTitleDraft(video.title);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="absolute top-1/2 left-1/2 cursor-pointer select-none"
      style={{
        transform: `
          ${dragOffset}
          translateX(-50%)
          translateY(-50%)
          translateX(${translateX}%)
          rotateY(${rotateY}deg)
          scale(${scale})
        `,
        opacity: isDragging ? 0.85 : opacity,
        zIndex,
        filter: `brightness(${brightness})`,
        transition: dndTransition || "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transformStyle: "preserve-3d",
        width: "min(240px, 42vw)",
      }}
      onClick={() => {
        if (!isEditingTitle) onClick();
      }}
      role="button"
      aria-label={isActive ? `Play ${video.title}` : `Go to ${video.title}`}
    >
      {/* Card */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl group"
        style={{ aspectRatio: "9/16" }}
      >
        {/* Thumbnail */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Platform badge / selector */}
        <div className="absolute top-3 right-3 z-20">
          {isAdmin && !isDemo ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlatformToggle?.();
              }}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
              aria-label="Toggle platform"
            >
              {video.platform === "instagram" ? (
                <InstagramIcon className="w-4 h-4 text-white/90" />
              ) : (
                <TikTokIcon className="w-4 h-4 text-white/90" />
              )}
            </button>
          ) : video.platform === "instagram" ? (
            <InstagramIcon className="w-5 h-5 text-white/90 drop-shadow-lg" />
          ) : (
            <TikTokIcon className="w-5 h-5 text-white/90 drop-shadow-lg" />
          )}
        </div>

        {/* Admin delete button */}
        {isAdmin && onDelete && !isDemo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            className="absolute top-3 left-3 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors z-20"
            aria-label="Delete video"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <X className="w-4 h-4 text-white" />
            )}
          </button>
        )}

        {/* Admin drag handle */}
        {isAdmin && !isDemo && (
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Play button overlay on active */}
        {isActive && !isEditingTitle && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-xl transition-transform duration-300 group-hover:scale-110">
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pr-14">
          {isAdmin && !isDemo && isEditingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTitle();
                if (e.key === "Escape") {
                  setTitleDraft(video.title);
                  setIsEditingTitle(false);
                }
              }}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-2 py-1 text-white font-serif text-sm focus:outline-none focus:border-primary/60"
            />
          ) : (
            <p
              className={`text-white font-serif text-base leading-tight line-clamp-2 ${
                isAdmin && !isDemo ? "cursor-text hover:underline" : ""
              }`}
              onClick={(e) => {
                if (isAdmin && !isDemo) {
                  e.stopPropagation();
                  setTitleDraft(video.title);
                  setIsEditingTitle(true);
                }
              }}
            >
              {video.title}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Video Player Modal ──────────────────────────────────────────────────────

interface PlayerModalProps {
  video: VideoItem;
  onClose: () => void;
}

function VideoPlayerModal({ video, onClose }: PlayerModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Try to detect embed type
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    return url;
  };

  const embedUrl = getEmbedUrl(video.videoUrl);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div
        className="relative z-10 w-full max-w-sm mx-4"
        style={{ aspectRatio: "9/16", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-3xl overflow-hidden w-full h-full bg-black">
          {embedUrl && embedUrl !== video.videoUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={video.title}
            />
          ) : video.videoUrl ? (
            <video
              src={video.videoUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="relative z-10 bg-black/60 rounded-2xl p-6 backdrop-blur-sm">
                <p className="text-white font-serif text-xl mb-2">{video.title}</p>
                <p className="text-white/60 font-sans text-sm">
                  No video URL configured yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Upload Modal (drag & drop or click-to-browse video file) ───────────────

interface UploadModalProps {
  onClose: () => void;
  onUploaded: (video: VideoItem) => void;
  nextOrder: number;
  password: string;
}

function UploadModal({ onClose, onUploaded, nextOrder, password }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  const acceptFile = (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file.");
      return;
    }
    setError("");
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!videoFile) {
      setError("Please select a video file to upload.");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError("");

    // Resolve the correct cloud name + preset from the server (source of truth),
    // since the public env var may be misconfigured.
    let cloudName = "";
    let uploadPreset = "";
    try {
      const cfgRes = await fetch("/api/videos/config", { cache: "no-store" });
      const cfg = await cfgRes.json();
      cloudName = cfg.cloudName;
      uploadPreset = cfg.uploadPreset;
      if (!cfg.configured) {
        const missing = [
          !cloudName && "cloud name",
          !uploadPreset && "upload preset",
        ]
          .filter(Boolean)
          .join(" and ");
        setError(`Cloudinary is missing its ${missing}. Please check the server configuration.`);
        setIsUploading(false);
        return;
      }
    } catch {
      setError("Could not load Cloudinary configuration.");
      setIsUploading(false);
      return;
    }

    const trimmedTitle = title.trim();
    // Match the server-side context format so getVideos() reads it back correctly
    const safeTitle = trimmedTitle.replace(/[|=]/g, " ").slice(0, 200);
    const context = `title=${safeTitle}|platform=${platform}|order=${nextOrder}`;

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "filografie/videos");
    formData.append("context", context);

    // Upload directly to Cloudinary as a video resource. Using XHR so we can
    // report progress and allow a long timeout for large video files.
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

    try {
      const result = await new Promise<{
        public_id: string;
        secure_url: string;
      }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);
        xhr.timeout = 10 * 60 * 1000; // 10 minutes for large files

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch {
              reject(new Error("Received an invalid response from Cloudinary."));
            }
          } else {
            // Surface Cloudinary's specific error message
            let message = `Upload failed (HTTP ${xhr.status}).`;
            try {
              const body = JSON.parse(xhr.responseText);
              if (body?.error?.message) message = body.error.message;
            } catch {
              /* keep default message */
            }
            reject(new Error(message));
          }
        };

        xhr.onerror = () =>
          reject(
            new Error(
              "Network error reaching Cloudinary. Check your connection and that the upload preset allows unsigned video uploads."
            )
          );
        xhr.ontimeout = () =>
          reject(new Error("Upload timed out. The video file may be too large."));

        xhr.send(formData);
      });

      const thumbnailUrl = result.secure_url.replace(/\.[^/.]+$/, ".jpg");

      onUploaded({
        id: result.public_id,
        publicId: result.public_id,
        thumbnailUrl,
        videoUrl: result.secure_url,
        title: trimmedTitle,
        platform,
        order: nextOrder,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-md mx-4 bg-[#12121c] rounded-2xl p-6 border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-serif text-2xl text-white mb-6">Upload Video</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-white/60 text-sm font-sans mb-1">
              Title <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Golden Hour Reel"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 font-sans"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-white/60 text-sm font-sans mb-1">
              Platform
            </label>
            <div className="flex gap-3">
              {(["instagram", "tiktok"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-colors font-sans text-sm capitalize ${
                    platform === p
                      ? "border-primary/70 bg-primary/20 text-white"
                      : "border-white/10 bg-white/5 text-white/50 hover:text-white/80"
                  }`}
                >
                  {p === "instagram" ? (
                    <InstagramIcon className="w-4 h-4" />
                  ) : (
                    <TikTokIcon className="w-4 h-4" />
                  )}
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Video dropzone / file picker */}
          <div>
            <label className="block text-white/60 text-sm font-sans mb-1">
              Video File <span className="text-accent">*</span>
            </label>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-40 border rounded-xl cursor-pointer transition-colors relative overflow-hidden ${
                isDraggingOver
                  ? "border-primary bg-primary/10"
                  : "border-dashed border-white/20 hover:border-primary/50"
              }`}
            >
              {videoPreview ? (
                <video
                  src={videoPreview}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/40 px-4 text-center">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm font-sans">
                    Drag & drop a video, or click to browse
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>
            {videoFile && (
              <p className="text-white/40 text-xs font-sans mt-1 truncate">
                {videoFile.name}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm font-sans">{error}</p>
          )}

          <button
            type="submit"
            disabled={isUploading || !title.trim() || !videoFile}
            className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors duration-200 font-sans flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress > 0 ? `Uploading... ${progress}%` : "Uploading..."}
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Video
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Video Section ──────────────────────────────────────────────────────

export function Video() {
  const { isAdmin, password } = useAdmin();
  const { t } = useLanguage();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Drag/swipe state (navigation)
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch videos
  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch("/api/videos");
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos?.length > 0 ? data.videos : DEMO_VIDEOS);
      } else {
        setVideos(DEMO_VIDEOS);
      }
    } catch {
      setVideos(DEMO_VIDEOS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const displayVideos = videos.length > 0 ? videos : DEMO_VIDEOS;

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(displayVideos.length - 1, index));
      setActiveIndex(clamped);
    },
    [displayVideos.length]
  );

  const goLeft = () => goTo(activeIndex - 1);
  const goRight = () => goTo(activeIndex + 1);

  const handleCardClick = (index: number) => {
    if (index === activeIndex) {
      // Play the active video
      setPlayingVideo(displayVideos[activeIndex]);
    } else {
      goTo(index);
    }
  };

  const handleDelete = async (video: VideoItem) => {
    if (!confirm(`Delete "${video.title}"?`) || !password) return;
    setDeletingId(video.publicId);
    try {
      const response = await fetch("/api/videos/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ publicId: video.publicId }),
      });

      if (response.ok) {
        const newVideos = videos.filter((v) => v.publicId !== video.publicId);
        setVideos(newVideos.length > 0 ? newVideos : DEMO_VIDEOS);
        setActiveIndex((prev) =>
          Math.min(prev, Math.max(0, newVideos.length - 1))
        );
      }
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  const persistMeta = useCallback(
    async (updated: VideoItem) => {
      if (!password) return;
      try {
        await fetch("/api/videos/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": password,
          },
          body: JSON.stringify({
            publicId: updated.publicId,
            title: updated.title,
            platform: updated.platform,
            order: updated.order,
          }),
        });
      } catch (error) {
        console.error("Failed to save video:", error);
      }
    },
    [password]
  );

  const handleTitleSave = (video: VideoItem, newTitle: string) => {
    const updated = { ...video, title: newTitle };
    setVideos((prev) =>
      prev.map((v) => (v.publicId === video.publicId ? updated : v))
    );
    persistMeta(updated);
  };

  const handlePlatformToggle = (video: VideoItem) => {
    const updated = {
      ...video,
      platform:
        video.platform === "instagram"
          ? ("tiktok" as const)
          : ("instagram" as const),
    };
    setVideos((prev) =>
      prev.map((v) => (v.publicId === video.publicId ? updated : v))
    );
    persistMeta(updated);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !password) return;

    const oldIndex = displayVideos.findIndex((v) => v.id === active.id);
    const newIndex = displayVideos.findIndex((v) => v.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(displayVideos, oldIndex, newIndex).map(
      (v, index) => ({ ...v, order: index + 1 })
    );
    setVideos(reordered);

    // Keep the same video active after reordering
    const activeVideoId = displayVideos[activeIndex]?.id;
    const newActiveIndex = reordered.findIndex((v) => v.id === activeVideoId);
    if (newActiveIndex !== -1) setActiveIndex(newActiveIndex);

    setIsSavingOrder(true);
    try {
      await fetch("/api/videos/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          videos: reordered
            .filter((v) => !v.id.startsWith("demo"))
            .map((v) => ({
              publicId: v.publicId,
              title: v.title,
              platform: v.platform,
              order: v.order,
            })),
        }),
      });
    } catch (error) {
      console.error("Failed to save order:", error);
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (playingVideo || showUploadModal) return;
      if (e.key === "ArrowLeft") goLeft();
      if (e.key === "ArrowRight") goRight();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, displayVideos.length, playingVideo, showUploadModal]);

  // Drag/swipe handlers (navigation via stage background)
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 8) {
      isDragging.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    if (isDragging.current && Math.abs(diff) > 50) {
      if (diff < 0) goRight();
      else goLeft();
    }
    dragStartX.current = null;
    isDragging.current = false;
  };

  return (
    <>
      <section
        id="video"
        className="py-32 px-6 relative overflow-hidden"
        aria-label="Video section"
      >
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-16 w-24 h-24 bg-accent/20 rounded-3xl rotate-12 opacity-40 pointer-events-none" />
        <div className="absolute bottom-32 left-10 w-16 h-16 bg-primary/30 rounded-2xl -rotate-6 opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-primary font-sans text-sm tracking-wider uppercase mb-4">
              {t.video.eyebrow}
            </p>
            <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
              Reels
            </h2>
          </div>

          {/* Admin: Upload Video button */}
          {isAdmin && (
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium transition-colors duration-200 font-sans"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Video</span>
              </button>
              {isSavingOrder && (
                <div className="ml-4 flex items-center gap-2 text-white/60 text-sm self-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving order...</span>
                </div>
              )}
            </div>
          )}

          {/* CoverFlow Carousel */}
          {isLoading ? (
            <div className="flex items-center justify-center h-[420px]">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <>
              {/* 3D Stage */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={displayVideos.map((v) => v.id)}
                  strategy={horizontalListSortingStrategy}
                  disabled={!isAdmin}
                >
                  <div
                    className="relative mx-auto overflow-visible"
                    style={{
                      perspective: "1200px",
                      perspectiveOrigin: "50% 50%",
                      height: "min(420px, 72vw)",
                      maxWidth: "700px",
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={() => {
                      dragStartX.current = null;
                      isDragging.current = false;
                    }}
                  >
                    {displayVideos.map((video, index) => {
                      const position = index - activeIndex;
                      return (
                        <CoverFlowCard
                          key={video.id}
                          video={video}
                          position={position}
                          onClick={() => {
                            if (!isDragging.current) handleCardClick(index);
                          }}
                          onDelete={
                            isAdmin && !video.id.startsWith("demo")
                              ? () => handleDelete(video)
                              : undefined
                          }
                          onTitleSave={(newTitle) => handleTitleSave(video, newTitle)}
                          onPlatformToggle={() => handlePlatformToggle(video)}
                          isAdmin={isAdmin}
                          isDeleting={deletingId === video.publicId}
                        />
                      );
                    })}

                    {/* Admin: Add video card at the end */}
                    {isAdmin && (() => {
                      const addPosition = displayVideos.length - activeIndex;
                      const abs = Math.abs(addPosition);
                      if (abs > 2) return null;
                      const translateX = addPosition * 62;
                      const rotateY = addPosition * -35;
                      const scale = addPosition === 0 ? 1 : abs === 1 ? 0.78 : 0.6;
                      const opacity = addPosition === 0 ? 1 : abs === 1 ? 0.65 : 0.35;
                      const zIndex = addPosition === 0 ? 10 : abs === 1 ? 6 : 2;
                      const brightness = addPosition === 0 ? 1 : abs === 1 ? 0.6 : 0.35;

                      return (
                        <button
                          key="add-card"
                          className="absolute top-1/2 left-1/2 cursor-pointer select-none"
                          style={{
                            transform: `
                              translateX(-50%)
                              translateY(-50%)
                              translateX(${translateX}%)
                              rotateY(${rotateY}deg)
                              scale(${scale})
                            `,
                            opacity,
                            zIndex,
                            filter: `brightness(${brightness})`,
                            transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                            transformStyle: "preserve-3d",
                            width: "min(240px, 42vw)",
                            border: "none",
                            background: "none",
                            padding: 0,
                          }}
                          onClick={() => {
                            if (addPosition !== 0) {
                              goTo(displayVideos.length);
                            } else {
                              setShowUploadModal(true);
                            }
                          }}
                          aria-label="Add new video"
                        >
                          <div
                            className="relative rounded-3xl overflow-hidden border-2 border-dashed border-white/20 hover:border-primary/60 transition-colors flex flex-col items-center justify-center gap-3 bg-white/5"
                            style={{ aspectRatio: "9/16" }}
                          >
                            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                              <Plus className="w-7 h-7 text-primary" />
                            </div>
                            <p className="text-white/60 font-sans text-sm text-center px-4">
                              Add Video
                            </p>
                          </div>
                        </button>
                      );
                    })()}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Navigation arrows */}
              <div className="flex items-center justify-center gap-6 mt-12">
                <button
                  onClick={goLeft}
                  disabled={activeIndex === 0}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Previous video"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                {/* Dot indicators */}
                <div className="flex items-center gap-2" role="tablist">
                  {[...displayVideos, ...(isAdmin ? [{ id: "add" }] : [])].map(
                    (v, i) => (
                      <button
                        key={v.id}
                        role="tab"
                        aria-selected={i === activeIndex}
                        onClick={() => goTo(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === activeIndex
                            ? "bg-primary w-6 h-2"
                            : "bg-white/25 hover:bg-white/50 w-2 h-2"
                        }`}
                        aria-label={`Go to video ${i + 1}`}
                      />
                    )
                  )}
                </div>

                <button
                  onClick={goRight}
                  disabled={
                    activeIndex >=
                    displayVideos.length - 1 + (isAdmin ? 1 : 0)
                  }
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Next video"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Active video title below */}
              <div className="text-center mt-6 h-8">
                <p className="text-white/70 font-sans text-sm tracking-wide transition-all duration-300">
                  {activeIndex < displayVideos.length
                    ? displayVideos[activeIndex].title
                    : "Add new video"}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Video Player Modal */}
      {playingVideo && (
        <VideoPlayerModal
          video={playingVideo}
          onClose={() => setPlayingVideo(null)}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && password && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploaded={(video) => {
            setVideos((prev) => {
              const filtered = prev.filter((v) => !v.id.startsWith("demo"));
              return [...filtered, video];
            });
            setActiveIndex(
              videos.filter((v) => !v.id.startsWith("demo")).length
            );
          }}
          nextOrder={videos.filter((v) => !v.id.startsWith("demo")).length + 1}
          password={password}
        />
      )}
    </>
  );
}
