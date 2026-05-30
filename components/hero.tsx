import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a14]">
      {/* Floating elements - like WeTransfer */}
      
      {/* Top right image card */}
      <div className="hidden lg:block absolute top-24 right-[8%] w-48 h-64 floating-card animate-float-slow z-10">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-end p-3">
          <span className="file-badge bg-black/60 text-white">.jpg</span>
        </div>
      </div>

      {/* Pastel file badges floating */}
      <div className="hidden lg:block absolute top-32 right-[30%] animate-float">
        <div className="file-badge accent-pink text-base px-4 py-2 rounded-lg shadow-lg">.psd</div>
      </div>
      
      <div className="hidden lg:block absolute top-48 right-[22%] animate-float-reverse">
        <div className="file-badge accent-blue text-base px-4 py-2 rounded-lg shadow-lg">.tif</div>
      </div>

      {/* Bottom left folder */}
      <div className="hidden lg:block absolute bottom-32 left-[10%] animate-float z-10">
        <div className="w-28 h-24 bg-[#5046e5] rounded-2xl flex items-center justify-center shadow-2xl">
          <div className="text-white/90 text-xs font-medium">Filografie_v01</div>
        </div>
      </div>

      {/* Bottom center image with .mov badge */}
      <div className="hidden lg:block absolute bottom-24 left-[35%] w-72 h-44 floating-card animate-float-slow z-10">
        <div className="w-full h-full bg-gradient-to-br from-orange-400 via-pink-400 to-blue-400 relative">
          <span className="file-badge bg-blue-100 text-[#5046e5] absolute top-3 left-3">.mov</span>
        </div>
      </div>

      {/* Right side colorful blocks */}
      <div className="hidden lg:block absolute bottom-40 right-[5%] w-40 h-56 floating-card animate-float-reverse">
        <div className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-200 flex items-start justify-end p-3">
          <div className="w-8 h-8 rounded-lg bg-blue-400 flex items-center justify-center">
            <span className="text-white text-xs">*</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <div className="w-12 h-12 rounded-lg bg-[#ff7849]" />
          <div className="w-12 h-12 rounded-lg bg-[#5046e5]" />
        </div>
      </div>

      {/* Comment bubble */}
      <div className="hidden lg:block absolute bottom-56 right-[25%] animate-float">
        <div className="px-4 py-2.5 bg-[#1a1a2e] rounded-full flex items-center gap-2 shadow-xl">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-[10px] text-white">4</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Label */}
          <p className="label-text text-white/50 mb-6">
            Creative by Filomena
          </p>
          
          {/* Main heading - bold italic serif */}
          <h1 className="heading-editorial text-[clamp(3.5rem,10vw,8rem)] text-white mb-8">
            Capture light.<br />
            Tell stories.
          </h1>
          
          {/* Subheading */}
          <p className="body-text text-white/60 text-lg md:text-xl max-w-xl mb-12">
            Premium photography, videography, and digital creative services 
            for those who value artistry and intention.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a 
              href="#work"
              className="btn-outline inline-flex items-center gap-3 text-sm"
            >
              View the work
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom label - vertical */}
      <div className="absolute bottom-12 right-8 hidden lg:block">
        <p 
          className="label-text text-white/30 tracking-wider"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll to explore
        </p>
      </div>
    </section>
  )
}
