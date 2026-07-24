"use client"

import { useState, useEffect, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Portfolio } from "@/components/portfolio"
import { Video } from "@/components/video"
import { DigitalCreative } from "@/components/digital-creative"
import { Pricing } from "@/components/pricing"
import { Blog } from "@/components/blog"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { CosmicElements } from "@/components/cosmic-elements"
import type { GalleryImage } from "@/lib/cloudinary"

// How many photos the Hero grid shows (8 slots across 4 columns)
const HERO_PHOTO_COUNT = 8

// Hardcoded fallbacks shown while live data loads or if gallery is empty
const FALLBACK_IMAGES: GalleryImage[] = [
  { id: "f1", publicId: "f1", url: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147847/Snímek_obrazovky_2026-05-29_v_12.34.41_f4alzi.png", width: 800, height: 600, order: 1, category: "photography" },
  { id: "f2", publicId: "f2", url: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147898/Snímek_obrazovky_2026-05-30_v_15.31.19_ob3aun.png", width: 800, height: 600, order: 2, category: "photography" },
  { id: "f3", publicId: "f3", url: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154203/Sni%CC%81mek_obrazovky_2026-05-30_v_17.16.18_xfoggt.png", width: 800, height: 600, order: 3, category: "photography" },
  { id: "f4", publicId: "f4", url: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154159/Sni%CC%81mek_obrazovky_2026-05-30_v_17.15.41_wfowzq.png", width: 800, height: 600, order: 4, category: "photography" },
  { id: "f5", publicId: "f5", url: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147813/Sni%CC%81mek_obrazovky_2026-05-29_v_12.33.50_d3lite.png", width: 800, height: 600, order: 5, category: "photography" },
  { id: "f6", publicId: "f6", url: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154527/Sni%CC%81mek_obrazovky_2026-05-30_v_17.21.54_uhziv7.png", width: 800, height: 600, order: 6, category: "photography" },
  { id: "f7", publicId: "f7", url: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154249/Sni%CC%81mek_obrazovky_2026-05-30_v_17.17.06_smki1b.png", width: 800, height: 600, order: 7, category: "photography" },
  { id: "f8", publicId: "f8", url: "https://res.cloudinary.com/duntvai9w/image/upload/v1780155677/Sni%CC%81mek_obrazovky_2026-05-30_v_17.41.00_symplk.png", width: 800, height: 600, order: 8, category: "photography" },
]

export default function Home() {
  // ── Single source of truth for photography images ──
  const [photos, setPhotos] = useState<GalleryImage[]>(FALLBACK_IMAGES)
  const [photosLoaded, setPhotosLoaded] = useState(false)

  // ── Photography section expanded state ──
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false)

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery?category=photography")
      if (res.ok) {
        const data = await res.json()
        if (data.images && data.images.length > 0) {
          setPhotos(data.images)
        }
      }
    } catch {
      // keep fallbacks
    } finally {
      setPhotosLoaded(true)
    }
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  // Listen for the expand event dispatched by Navbar and Hero "View all" links
  useEffect(() => {
    const handleExpand = () => setIsPhotoExpanded(true)
    window.addEventListener("photography:expand", handleExpand)
    return () => window.removeEventListener("photography:expand", handleExpand)
  }, [])

  // Hero uses the first HERO_PHOTO_COUNT images; pad with fallbacks if needed
  const heroPhotos = photosLoaded
    ? [...photos, ...FALLBACK_IMAGES].slice(0, HERO_PHOTO_COUNT)
    : FALLBACK_IMAGES

  return (
    <main className="min-h-screen bg-[#0a0a0f] relative">
      <CosmicElements />
      <Navbar />
      <Hero
        photos={heroPhotos}
        onPhotosChange={setPhotos}
        isExpanded={isPhotoExpanded}
        onExpandChange={setIsPhotoExpanded}
      />
      <About />
      <Portfolio />
      <Video />
      <DigitalCreative />
      <Pricing />
      <Blog />
      <Contact />
      <Footer />
    </main>
  )
}
