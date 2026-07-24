"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, Play } from "lucide-react"

// Fallback images shown before live data loads or if gallery is empty
const FALLBACK_IMAGES = [
  { src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147847/Snímek_obrazovky_2026-05-29_v_12.34.41_f4alzi.png", alt: "Portrait photography" },
  { src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147898/Snímek_obrazovky_2026-05-30_v_15.31.19_ob3aun.png", alt: "Lifestyle photography" },
  { src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154203/Sni%CC%81mek_obrazovky_2026-05-30_v_17.16.18_xfoggt.png", alt: "Event photography" },
  { src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154159/Sni%CC%81mek_obrazovky_2026-05-30_v_17.15.41_wfowzq.png", alt: "Food photography" },
  { src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147813/Sni%CC%81mek_obrazovky_2026-05-29_v_12.33.50_d3lite.png", alt: "Wedding photography" },
  { src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154527/Sni%CC%81mek_obrazovky_2026-05-30_v_17.21.54_uhziv7.png", alt: "Product photography" },
  { src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154249/Sni%CC%81mek_obrazovky_2026-05-30_v_17.17.06_smki1b.png", alt: "Fashion photography" },
  { src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780155677/Sni%CC%81mek_obrazovky_2026-05-30_v_17.41.00_symplk.png", alt: "Commercial photography" },
]

const videoReels = [
  { id: 1, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1/Frapp%C3%A9_Matcha_Maracuja_rc9ti6.mp4", title: "Matcha Frappé", category: "Food" },
  { id: 2, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780151832/merge_DD2D2C17-0A98-4350-9B96-9379B6570DB9_qvniqt.mp4", title: "Behind the Scenes", category: "BTS" },
  { id: 3, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780153470/How_to_get_to_the_Prague_Old_Town_Tower_50_cheaper_If_you_re_heading_to_Prague_save_this_Re_gcyqm2.mp4", title: "Prague Travel", category: "Travel" },
  { id: 4, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780151825/Starbucks_video_copy_jdqqld.mp4", title: "Starbucks Story", category: "Commercial" },
]

export function Hero() {
  const [activeVideo, setActiveVideo] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hoveredImage, setHoveredImage] = useState<number | null>(null)
  const [galleryImages, setGalleryImages] = useState(FALLBACK_IMAGES)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Fetch live photography images; keep fallbacks if gallery is empty
  useEffect(() => {
    fetch("/api/gallery?category=photography")
      .then((r) => r.json())
      .then((data) => {
        if (data.images && data.images.length >= 1) {
          // Map to the same shape as FALLBACK_IMAGES
          const mapped = data.images.map((img: { url: string; alt?: string }) => ({
            src: img.url,
            alt: img.alt ?? "Photography",
          }))
          // Pad with fallbacks if fewer than 8 live images exist
          const padded = [...mapped, ...FALLBACK_IMAGES].slice(0, 8)
          setGalleryImages(padded)
        }
      })
      .catch(() => {/* keep fallbacks */})
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.muted = isMuted
        if (index === activeVideo) {
          if (isPlaying) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        } else {
          video.pause()
          video.currentTime = 0
        }
      }
    })
  }, [activeVideo, isMuted, isPlaying])

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollTop = container.scrollTop
      const itemHeight = container.clientHeight
      const newIndex = Math.round(scrollTop / itemHeight)
      if (newIndex !== activeVideo && newIndex >= 0 && newIndex < videoReels.length) {
        setActiveVideo(newIndex)
      }
    }
  }

  const toggleMute = () => setIsMuted(!isMuted)
  const togglePlay = () => setIsPlaying(!isPlaying)

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a14]">
      {/* Main content */}
      <div className="relative z-20 max-w-[1600px] mx-auto px-6 lg:px-12 pt-24 pb-12">
        {/* Header text - removed Filography label */}
        <div className="mb-10 lg:mb-14 pt-4">
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-none mb-4">
            I Create visuals.<br />
            <span className="text-indigo-400">Tell stories.</span>
          </h1>
          <p className="body-text text-white/50 text-sm max-w-lg">
            Event photography · Social media management · Video · Graphic design
          </p>
        </div>

        {/* Two-part layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left side - Dynamic Masonry Photo Gallery */}
          <div className="flex-1 lg:flex-[2] relative">
            {/* Masonry Grid */}
            <div className="grid grid-cols-4 gap-2 h-[420px] relative">
              {/* Column 1 */}
              <div className="flex flex-col gap-2">
                <div 
                  className="relative overflow-hidden group cursor-pointer flex-[1.4] animate-float-gallery-1"
                  onMouseEnter={() => setHoveredImage(1)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img
                    src={galleryImages[0].src}
                    alt={galleryImages[0].alt}
                    className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 1 ? 'scale-110 brightness-110' : 'scale-100'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div 
                  className="relative overflow-hidden group cursor-pointer flex-[0.6] animate-float-gallery-2"
                  onMouseEnter={() => setHoveredImage(4)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img
                    src={galleryImages[3].src}
                    alt={galleryImages[3].alt}
                    className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 4 ? 'scale-110 brightness-110' : 'scale-100'}`}
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-2">
                <div 
                  className="relative overflow-hidden group cursor-pointer flex-[0.8] animate-float-gallery-3"
                  onMouseEnter={() => setHoveredImage(2)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img
                    src={galleryImages[1].src}
                    alt={galleryImages[1].alt}
                    className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 2 ? 'scale-110 brightness-110' : 'scale-100'}`}
                  />
                </div>
                <div 
                  className="relative overflow-hidden group cursor-pointer flex-[1.2] animate-float-gallery-4"
                  onMouseEnter={() => setHoveredImage(5)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img
                    src={galleryImages[4].src}
                    alt={galleryImages[4].alt}
                    className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 5 ? 'scale-110 brightness-110' : 'scale-100'}`}
                  />
                </div>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-2">
                <div 
                  className="relative overflow-hidden group cursor-pointer flex-[1.3] animate-float-gallery-5"
                  onMouseEnter={() => setHoveredImage(3)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img
                    src={galleryImages[2].src}
                    alt={galleryImages[2].alt}
                    className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 3 ? 'scale-110 brightness-110' : 'scale-100'}`}
                  />
                </div>
                <div 
                  className="relative overflow-hidden group cursor-pointer flex-[0.7] animate-float-gallery-6"
                  onMouseEnter={() => setHoveredImage(6)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img
                    src={galleryImages[5].src}
                    alt={galleryImages[5].alt}
                    className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 6 ? 'scale-110 brightness-110' : 'scale-100'}`}
                  />
                </div>
              </div>

              {/* Column 4 */}
              <div className="flex flex-col gap-2">
                <div 
                  className="relative overflow-hidden group cursor-pointer flex-[0.5] animate-float-gallery-7"
                  onMouseEnter={() => setHoveredImage(7)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img
                    src={galleryImages[6].src}
                    alt={galleryImages[6].alt}
                    className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 7 ? 'scale-110 brightness-110' : 'scale-100'}`}
                  />
                </div>
                <div 
                  className="relative overflow-hidden group cursor-pointer flex-[1.5] animate-float-gallery-8"
                  onMouseEnter={() => setHoveredImage(8)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img
                    src={galleryImages[7].src}
                    alt={galleryImages[7].alt}
                    className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 8 ? 'scale-110 brightness-110' : 'scale-100'}`}
                  />
                </div>
              </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/60 to-transparent pointer-events-none z-10" />
          </div>

          {/* Right side - Vertical Video Reel (TikTok style) */}
          <div className="flex-1 lg:flex-[0.5] flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="relative w-full max-w-[260px]">
              <div className="relative bg-[#1a1a2e] rounded-[2.5rem] p-2 shadow-2xl">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-30" />
                
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="relative h-[380px] overflow-y-scroll snap-y snap-mandatory rounded-[2rem] bg-black scrollbar-hide"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {videoReels.map((video, index) => (
                    <div key={video.id} className="h-full w-full snap-start snap-always relative flex-shrink-0">
                      <video
                        ref={(el) => { videoRefs.current[index] = el }}
                        src={video.src}
                        className="w-full h-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        autoPlay={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
                      <div className="absolute bottom-6 left-4 right-4 z-20">
                        <span className="text-xs font-medium text-white/60 bg-white/10 px-2 py-1 rounded-full">
                          {video.category}
                        </span>
                        <h3 className="text-white font-medium text-sm mt-2">{video.title}</h3>
                      </div>
                      <div className="absolute top-12 left-4 z-20">
                        <span className="text-xs text-white/50">{index + 1}/{videoReels.length}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-20 right-4 z-30 flex flex-col gap-3">
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    {isPlaying ? (
                      <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-white rounded-full" />
                        <div className="w-1 h-3 bg-white rounded-full" />
                      </div>
                    ) : (
                      <Play className="w-4 h-4 fill-white" />
                    )}
                  </button>
                </div>

                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
                  {videoReels.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === activeVideo ? "bg-white h-4" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-center text-white/30 text-xs mt-3 label-text">Scroll to explore reels</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom label - vertical */}
      <div className="absolute bottom-8 right-8 hidden lg:block">
        <p className="label-text text-white/30 tracking-wider" style={{ writingMode: "vertical-rl" }}>
          Scroll to explore
        </p>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes floatGallery1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes floatGallery2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(5px); }
        }
        @keyframes floatGallery3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes floatGallery4 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(6px); }
        }
        @keyframes floatGallery5 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes floatGallery6 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(4px); }
        }
        @keyframes floatGallery7 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes floatGallery8 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(5px); }
        }
        .animate-float-gallery-1 { animation: floatGallery1 5s ease-in-out infinite; }
        .animate-float-gallery-2 { animation: floatGallery2 6s ease-in-out infinite 0.5s; }
        .animate-float-gallery-3 { animation: floatGallery3 5.5s ease-in-out infinite 0.3s; }
        .animate-float-gallery-4 { animation: floatGallery4 6.5s ease-in-out infinite 0.8s; }
        .animate-float-gallery-5 { animation: floatGallery5 5s ease-in-out infinite 0.2s; }
        .animate-float-gallery-6 { animation: floatGallery6 6s ease-in-out infinite 0.6s; }
        .animate-float-gallery-7 { animation: floatGallery7 5.5s ease-in-out infinite 0.4s; }
        .animate-float-gallery-8 { animation: floatGallery8 6s ease-in-out infinite 0.7s; }
      `}</style>
    </section>
  )
}
