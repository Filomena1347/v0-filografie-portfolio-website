"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";

// ─── Data ────────────────────────────────────────────────────────────────────
// Replace / extend this array to connect to a CMS later.
const VIDEO_DATA = [
  {
    id: 1,
    src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780147800/sample_video_1.mp4",
    poster: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147847/Snímek_obrazovky_2026-05-29_v_12.34.41_f4alzi.png",
    category: "Wedding",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780147800/sample_video_2.mp4",
    poster: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147898/Snímek_obrazovky_2026-05-30_v_15.31.19_ob3aun.png",
    category: "Event",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780147800/sample_video_3.mp4",
    poster: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154203/Sni%CC%81mek_obrazovky_2026-05-30_v_17.16.18_xfoggt.png",
    category: "Corporate",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780147800/sample_video_4.mp4",
    poster: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154159/Sni%CC%81mek_obrazovky_2026-05-30_v_17.15.41_wfowzq.png",
    category: "Brand Film",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780147800/sample_video_5.mp4",
    poster: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147813/Sni%CC%81mek_obrazovky_2026-05-29_v_12.33.50_d3lite.png",
    category: "Reel",
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────
type VideoItem = (typeof VIDEO_DATA)[number];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getCardStyle(offset: number): React.CSSProperties {
  const absOffset = Math.abs(offset);

  if (absOffset > 2) {
    return { opacity: 0, pointerEvents: "none", transform: "scale(0.7) rotateY(0deg)", zIndex: 0 };
  }

  const scale   = offset === 0 ? 1 : absOffset === 1 ? 0.82 : 0.68;
  const rotateY = offset === 0 ? 0 : offset > 0 ? -28 * absOffset : 28 * absOffset;
  const translateX = offset === 0 ? 0 : offset > 0 ? 14 * absOffset : -14 * absOffset;
  const opacity = offset === 0 ? 1 : absOffset === 1 ? 0.72 : 0.45;
  const zIndex  = 10 - absOffset * 3;

  return {
    transform: `perspective(1100px) translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
    opacity,
    zIndex,
    transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.55s ease",
  };
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({
  videos,
  startIndex,
  onClose,
}: {
  videos: VideoItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const videoRef = useRef<HTMLVideoElement>(null);

  const prev = useCallback(() => setIndex((i) => (i - 1 + videos.length) % videos.length), [videos.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % videos.length), [videos.length]);

  // keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  // auto-play when index changes
  useEffect(() => {
    videoRef.current?.load();
    videoRef.current?.play().catch(() => {});
  }, [index]);

  const current = videos[index];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Video */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-[9/16] max-h-[78vh] mx-auto w-fit">
          <video
            ref={videoRef}
            key={current.id}
            src={current.src}
            poster={current.poster}
            className="h-full w-auto max-w-full"
            controls
            autoPlay
            playsInline
          />
        </div>

        {/* Prev / Next */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to video ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function VideoCard({
  video,
  offset,
  isActive,
  onClick,
}: {
  video: VideoItem;
  offset: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  // autoplay center card muted
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const cardStyle = getCardStyle(offset);
  const hoverScale = hovered && offset === 0 ? "scale-[1.03]" : "";

  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 cursor-pointer select-none"
      style={{ ...cardStyle, width: "min(280px, 52vw)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div
        className={`relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 transition-transform duration-300 ${hoverScale}`}
        style={{ aspectRatio: "9/16" }}
      >
        {/* Poster always visible */}
        <img
          src={video.poster}
          alt={video.category}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Muted autoplay video on top when active */}
        {isActive && (
          <video
            ref={videoRef}
            src={video.src}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Carousel ────────────────────────────────────────────────────────────────
function VideoCarousel({
  videos,
  onOpenLightbox,
}: {
  videos: VideoItem[];
  onOpenLightbox: (index: number) => void;
}) {
  const [active, setActive] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const prev = () => setActive((i) => (i - 1 + videos.length) % videos.length);
  const next = () => setActive((i) => (i + 1) % videos.length);

  // drag / swipe
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
    dragStartX.current = null;
  };

  // keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="w-full flex flex-col items-center gap-10">
      {/* Track */}
      <div
        ref={trackRef}
        className="relative w-full"
        style={{ height: "min(520px, 78vw)" }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {videos.map((video, i) => {
          const offset = i - active;
          // wrap-around offset for seamless looping
          const wrappedOffset =
            offset > videos.length / 2
              ? offset - videos.length
              : offset < -videos.length / 2
              ? offset + videos.length
              : offset;

          return (
            <VideoCard
              key={video.id}
              video={video}
              offset={wrappedOffset}
              isActive={i === active}
              onClick={() => {
                if (i === active) {
                  onOpenLightbox(i);
                } else {
                  setActive(i);
                }
              }}
            />
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-200"
          aria-label="Previous video"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active ? "w-6 h-2 bg-indigo-400" : "w-2 h-2 bg-white/25 hover:bg-white/45"
              }`}
              aria-label={`Go to video ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-200"
          aria-label="Next video"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export function Video() {
  const { t } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="video" className="py-20 px-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-16 right-12 w-24 h-24 bg-indigo-500 rounded-3xl rotate-12 opacity-30 pointer-events-none animate-levitate" />
      <div className="absolute bottom-24 left-8 w-14 h-14 bg-[#FF6B5B] rounded-2xl -rotate-6 opacity-40 pointer-events-none animate-levitate-slow" />

      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
            {t.video_label}
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
            {t.video_line1}
            <br />
            <span className="text-indigo-400">{t.video_line2}</span>
          </h2>
        </div>

        {/* 3D Carousel */}
        <VideoCarousel
          videos={VIDEO_DATA}
          onOpenLightbox={(i) => setLightboxIndex(i)}
        />
      </div>

      {/* Fullscreen Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          videos={VIDEO_DATA}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
