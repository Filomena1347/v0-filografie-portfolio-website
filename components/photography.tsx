"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown, Loader2, Lock } from "lucide-react";
import { SortableGallery } from "./sortable-gallery";
import { useAdmin } from "@/contexts/admin-context";
import type { GalleryImage } from "@/lib/cloudinary";

const PREVIEW_COUNT = 6;

export function Photography() {
  const { isAdmin, openLoginModal } = useAdmin();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch all images from the single "photography" category on mount
  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery?category=photography");
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Listen for the expand event dispatched by Hero "View all" and Navbar
  useEffect(() => {
    const handleExpand = () => {
      setIsExpanded(true);
      // Small delay so the expand animation starts before scrolling
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    };
    window.addEventListener("photography:expand", handleExpand);
    return () => window.removeEventListener("photography:expand", handleExpand);
  }, []);

  const handleImagesChange = useCallback((newImages: GalleryImage[]) => {
    setImages(newImages);
  }, []);

  const visibleImages = isExpanded ? images : images.slice(0, PREVIEW_COUNT);

  return (
    <section id="photography" ref={sectionRef} className="py-32 px-6 relative overflow-hidden">
      {/* Subtle decorative blurs */}
      <div className="absolute top-32 left-10 w-24 h-24 bg-gradient-to-br from-violet-500/20 to-indigo-600/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
            Photography
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
            Capture life.<br />
            <span className="text-[#FF6B5B]">Keep forever.</span>
          </h2>
        </div>

        {/* Gallery */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-white/60 font-sans">Loading images...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-white/60 font-sans mb-2">No images yet.</p>
            {!isAdmin ? (
              <button
                onClick={openLoginModal}
                className="mt-4 flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium transition-colors duration-200 font-sans"
              >
                <Lock className="w-4 h-4" />
                <span>Login to upload images</span>
              </button>
            ) : (
              <p className="text-white/40 font-sans text-sm">Use the upload button to add images.</p>
            )}
          </div>
        ) : (
          <>
            <SortableGallery
              images={visibleImages}
              category="photography"
              onImagesChange={handleImagesChange}
              isModalOpen={true}
            />

            {/* Expand / Collapse toggle — only show when there are more images than preview count */}
            {images.length > PREVIEW_COUNT && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setIsExpanded((v) => !v)}
                  className="flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all duration-300 font-sans text-sm"
                >
                  <span>{isExpanded ? "Show less" : `View all photos (${images.length})`}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
