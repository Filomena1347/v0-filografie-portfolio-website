import { Camera, Film, Palette } from "lucide-react"

export function About() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Subtle aurora accent */}
      <div 
        className="absolute -right-64 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #9D4EDD 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] glass-card rounded-2xl overflow-hidden gradient-border">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7B2FBE]/20 via-transparent to-[#2EC4B6]/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-[#9D4EDD] mx-auto mb-4 opacity-50" />
                  <p className="text-[#71717a] text-sm tracking-wider">Portrait Photo</p>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 glass-card rounded-xl -z-10" />
          </div>

          {/* Text content */}
          <div>
            <p className="text-[#9D4EDD] text-xs tracking-[0.3em] uppercase mb-4">About</p>
            <h2 className="text-4xl md:text-5xl font-extralight mb-8 leading-tight">
              Hello, I&apos;m <span className="gradient-text">Filoména</span>
            </h2>
            <div className="space-y-6 text-[#a1a1aa] font-light leading-relaxed">
              <p>
                A visual storyteller based in the heart of creativity. With over a decade of experience, 
                I transform ordinary moments into extraordinary memories through the art of light and composition.
              </p>
              <p>
                From intimate weddings to corporate events, fashion editorials to brand campaigns — 
                each project is an opportunity to create something truly unique and meaningful.
              </p>
            </div>

            {/* Services icons */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { icon: Camera, label: "Photography" },
                { icon: Film, label: "Videography" },
                { icon: Palette, label: "Digital Art" },
              ].map((service) => (
                <div key={service.label} className="text-center">
                  <div className="w-14 h-14 mx-auto glass-card rounded-xl flex items-center justify-center mb-3 group hover:border-[#9D4EDD]/50 transition-colors">
                    <service.icon className="w-6 h-6 text-[#9D4EDD] group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs tracking-wider text-[#71717a]">{service.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
