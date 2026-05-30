import { Camera, Film, Palette } from "lucide-react"

export function About() {
  return (
    <section id="about" className="relative py-40 overflow-hidden">
      {/* Subtle light leak */}
      <div 
        className="aurora-breathe absolute -right-64 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(157, 78, 221, 0.12) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Image placeholder - full bleed feel */}
          <div className="relative">
            <div className="aspect-[3/4] bg-[#111118] border border-[#9D4EDD]/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7B2FBE]/10 via-transparent to-[#2EC4B6]/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-[#9D4EDD]/30 mx-auto mb-4" />
                  <p className="text-[#71717a] text-xs tracking-widest uppercase">Portrait</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text content - editorial feel */}
          <div className="lg:pl-8">
            <p className="label-text text-[#9D4EDD] mb-6">About</p>
            
            <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-10">
              Hello, I&apos;m{" "}
              <span className="gradient-text">Filoména</span>
            </h2>
            
            <div className="space-y-6 body-text text-[#a1a1aa]">
              <p>
                A visual storyteller based in the heart of creativity. With over a decade of experience, 
                I transform ordinary moments into extraordinary memories through the art of light and composition.
              </p>
              <p>
                From intimate weddings to corporate events, fashion editorials to brand campaigns — 
                each project is an opportunity to create something truly unique and meaningful.
              </p>
            </div>

            {/* Services - minimal */}
            <div className="mt-16 flex gap-12">
              {[
                { icon: Camera, label: "Photography" },
                { icon: Film, label: "Videography" },
                { icon: Palette, label: "Digital Art" },
              ].map((service) => (
                <div key={service.label} className="group">
                  <service.icon className="w-5 h-5 text-[#9D4EDD]/60 mb-3 group-hover:text-[#9D4EDD] transition-colors" />
                  <p className="text-xs tracking-wider text-[#71717a] group-hover:text-[#a1a1aa] transition-colors">
                    {service.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
