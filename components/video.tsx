import { Play, Film } from "lucide-react"

export function Video() {
  return (
    <section id="video" className="relative py-40 overflow-hidden bg-[#07070a]">
      {/* Light leaks */}
      <div 
        className="aurora-light-leak absolute -left-32 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(123, 47, 190, 0.15) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />
      <div 
        className="aurora-breathe absolute -right-32 bottom-0 w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(46, 196, 182, 0.12) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-20">
          <p className="label-text text-[#9D4EDD] mb-6">Videography</p>
          <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl">
            Stories in <span className="gradient-text">Motion</span>
          </h2>
        </div>

        {/* Main video showcase - full width feel */}
        <div className="relative max-w-5xl mx-auto">
          <div className="aspect-video bg-[#111118] border border-[#9D4EDD]/10 overflow-hidden group cursor-pointer hover:border-[#9D4EDD]/25 transition-all duration-500">
            {/* Video thumbnail placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7B2FBE]/15 via-transparent to-[#2EC4B6]/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Play button - minimal */}
                  <div className="w-20 h-20 rounded-full border border-[#9D4EDD]/30 flex items-center justify-center group-hover:border-[#9D4EDD]/60 group-hover:scale-110 transition-all duration-500">
                    <Play className="w-8 h-8 text-[#9D4EDD] ml-1" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#07070a] to-transparent">
              <div className="flex items-center gap-3 text-[#a1a1aa]">
                <Film className="w-4 h-4 text-[#9D4EDD]/60" />
                <span className="text-[13px] tracking-wider font-light">Showreel 2024 — 3:42</span>
              </div>
            </div>
          </div>

          {/* Video thumbnails */}
          <div className="grid grid-cols-3 gap-4 mt-5">
            {[
              { title: "Wedding Films", duration: "2:30" },
              { title: "Event Highlights", duration: "1:45" },
              { title: "Brand Stories", duration: "4:12" },
            ].map((video, index) => (
              <div 
                key={video.title}
                className="bg-[#111118] border border-[#9D4EDD]/8 overflow-hidden cursor-pointer group hover:border-[#9D4EDD]/20 transition-all duration-500"
              >
                <div className="aspect-video relative">
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(${135 + index * 45}deg, 
                        rgba(123, 47, 190, 0.1) 0%, 
                        rgba(10, 10, 15, 0.95) 100%)`
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[14px] font-light">{video.title}</p>
                  <p className="text-xs text-[#71717a] mt-1 tracking-wider">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
