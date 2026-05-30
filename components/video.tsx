import { Play, Film } from "lucide-react"

export function Video() {
  return (
    <section id="video" className="relative py-32 overflow-hidden bg-[#07070a]">
      {/* Aurora accents */}
      <div 
        className="absolute -left-32 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, #7B2FBE 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div 
        className="absolute -right-32 bottom-0 w-[300px] h-[300px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #2EC4B6 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#9D4EDD] text-xs tracking-[0.3em] uppercase mb-4">Videography</p>
          <h2 className="text-4xl md:text-5xl font-extralight">
            Stories in <span className="gradient-text">Motion</span>
          </h2>
        </div>

        {/* Main video showcase */}
        <div className="relative max-w-5xl mx-auto">
          <div className="aspect-video glass-card rounded-2xl overflow-hidden gradient-border group cursor-pointer">
            {/* Video thumbnail placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7B2FBE]/30 via-[#0a0a0f] to-[#2EC4B6]/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Play button */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#7B2FBE] to-[#9D4EDD] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow-pulse">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                  {/* Outer ring */}
                  <div className="absolute inset-0 -m-4 rounded-full border border-white/20 group-hover:scale-125 transition-transform duration-500" />
                </div>
              </div>
            </div>
            
            {/* Video info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0a0a0f] to-transparent">
              <div className="flex items-center gap-3 text-[#a1a1aa]">
                <Film className="w-5 h-5 text-[#9D4EDD]" />
                <span className="text-sm tracking-wider">Showreel 2024 — 3:42</span>
              </div>
            </div>
          </div>

          {/* Video thumbnails */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { title: "Wedding Films", duration: "2:30" },
              { title: "Event Highlights", duration: "1:45" },
              { title: "Brand Stories", duration: "4:12" },
            ].map((video, index) => (
              <div 
                key={video.title}
                className="glass-card rounded-xl overflow-hidden cursor-pointer group"
              >
                <div className="aspect-video relative">
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(${135 + index * 45}deg, 
                        rgba(123, 47, 190, 0.3) 0%, 
                        rgba(10, 10, 15, 0.8) 100%)`
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-light">{video.title}</p>
                  <p className="text-xs text-[#71717a] mt-1">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
