"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, Play } from "lucide-react"

const galleryImages = [
  // Column 1
  { id: 1, src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147847/Snímek_obrazovky_2026-05-29_v_12.34.41_f4alzi.png", alt: "Portrait photography", category: "Portrait", position: "col1-top" },
  { id: 2, src: "/placeholder.svg?height=300&width=300", alt: "Food photography - Ramen", category: "Food", position: "col1-bottom" },
  // Column 2
  { id: 3, src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147898/Snímek_obrazovky_2026-05-30_v_15.31.19_ob3aun.png", alt: "Lifestyle photography", category: "Lifestyle", position: "col2-top" },
  { id: 4, src: "/placeholder.svg?height=350&width=300", alt: "Food photography - Dumplings", category: "Food", position: "col2-bottom" },
  // Column 3 - Full height
  { id: 5, src: "/placeholder.svg?height=600&width=350", alt: "Event photography - Performer", category: "Events", position: "col3-full" },
  // Column 4
  { id: 6, src: "/placeholder.svg?height=280&width=350", alt: "Food photography - Breakfast", category: "Food", position: "col4-top" },
  { id: 7, src: "/placeholder.svg?height=320&width=350", alt: "Behind the scenes - Makeup", category: "BTS", position: "col4-bottom" },
  // Column 5
  { id: 8, src: "/placeholder.svg?height=300&width=280", alt: "Product photography - Cocktail", category: "Product", position: "col5-top" },
  { id: 9, src: "/placeholder.svg?height=350&width=280", alt: "Portrait photography - Pageant", category: "Portrait", position: "col5-bottom" },
]

const videoReels = [
  { id: 1, src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", title: "Behind the Scenes", category: "BTS" },
  { id: 2, src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", title: "Wedding Highlights", category: "Wedding" },
  { id: 3, src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", title: "Fashion Week", category: "Fashion" },
  { id: 4, src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", title: "Brand Story", category: "Commercial" },
]

export function Hero() {
  const [activeVideo, setActiveVideo] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
      {/* Floating decorative elements */}
      <div className="hidden lg:block absolute top-32 right-[15%] animate-float">
        <div className="file-badge accent-pink text-base px-4 py-2 rounded-lg shadow-lg">.psd</div>
      </div>
      <div className="hidden lg:block absolute top-48 left-[5%] animate-float-reverse">
        <div className="file-badge accent-blue text-base px-4 py-2 rounded-lg shadow-lg">.raw</div>
      </div>
      <div className="hidden lg:block absolute bottom-32 left-[3%] animate-float">
        <div className="file-badge accent-orange text-base px-4 py-2 rounded-lg shadow-lg">.mov</div>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-[1600px] mx-auto px-6 lg:px-12 pt-28 pb-16">
        {/* Header text */}
        <div className="mb-12 lg:mb-16">
          <p className="label-text text-white/50 mb-4">Creative by Filomena</p>
          <h1 className="heading-editorial text-[clamp(2.5rem,6vw,5rem)] text-white mb-4">
            Capture light.<br />Tell stories.
          </h1>
          <p className="body-text text-white/50 text-base max-w-md">
            Premium photography, videography, and digital creative services.
          </p>
        </div>

        {/* Two-part layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left side - Photo Gallery (5-column masonry like reference) */}
          <div className="flex-1 lg:flex-[1.5]">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 h-auto md:h-[520px]">
              {/* Column 1 */}
              <div className="flex flex-col gap-2 md:gap-3">
                <GalleryImage image={galleryImages[0]} className="flex-[1.4]" />
                <GalleryImage image={galleryImages[1]} className="flex-[0.6]" />
              </div>
              
              {/* Column 2 */}
              <div className="flex flex-col gap-2 md:gap-3">
                <GalleryImage image={galleryImages[2]} className="flex-[0.6]" />
                <GalleryImage image={galleryImages[3]} className="flex-[1.4]" />
              </div>
              
              {/* Column 3 - Full height */}
              <div className="flex flex-col col-span-2 md:col-span-1">
                <GalleryImage image={galleryImages[4]} className="flex-1" />
              </div>
              
              {/* Column 4 */}
              <div className="hidden md:flex flex-col gap-2 md:gap-3">
                <GalleryImage image={galleryImages[5]} className="flex-[0.55]" />
                <GalleryImage image={galleryImages[6]} className="flex-[1.45]" />
              </div>
              
              {/* Column 5 */}
              <div className="hidden md:flex flex-col gap-2 md:gap-3">
                <GalleryImage image={galleryImages[7]} className="flex-[1.2]" />
                <GalleryImage image={galleryImages[8]} className="flex-[0.8]" />
              </div>
            </div>
          </div>

          {/* Right side - Vertical Video Reel (TikTok style) */}
          <div className="flex-1 lg:flex-[0.5] flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[260px]">
              <div className="relative bg-[#1a1a2e] rounded-[2.5rem] p-2 shadow-2xl">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-30" />
                
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="relative h-[480px] md:h-[520px] overflow-y-scroll snap-y snap-mandatory rounded-[2rem] bg-black scrollbar-hide"
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
              <p className="text-center text-white/30 text-xs mt-4 label-text">Scroll to explore reels</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom label - vertical */}
      <div className="absolute bottom-12 right-8 hidden lg:block">
        <p className="label-text text-white/30 tracking-wider" style={{ writingMode: "vertical-rl" }}>
          Scroll to explore
        </p>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

function GalleryImage({ image, className = "" }: { image: typeof galleryImages[0]; className?: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-lg cursor-pointer ${className}`}>
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <span className="text-[10px] font-medium text-white/90 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
          {image.category}
        </span>
      </div>
    </div>
  )
}
