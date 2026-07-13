"use client"

import { Camera, Film, Palette } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="relative py-32 lg:py-40 overflow-hidden bg-[#0a0a14]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image area with floating elements */}
          <div className="relative">
            {/* Main portrait card */}
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-[#12121c] to-[#1a1a2e] relative">
              <img
                src="https://res.cloudinary.com/duntvai9w/image/upload/v1780150406/Snímek_obrazovky_2026-05-30_v_16.13.01_ril9vz.png"
                alt="Filomena portrait"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14]/50 to-transparent" />
            </div>

            {/* Floating accent card */}
            <div className="absolute -bottom-6 -right-6 lg:-right-12 w-32 h-32 rounded-2xl bg-[#5046e5] animate-float flex items-center justify-center shadow-2xl">
              <span className="text-white/90 text-sm font-medium">4+ years</span>
            </div>

            {/* File badge */}
            <div className="absolute top-6 left-6">
              <span className="file-badge bg-white/90 text-[#0a0a14]">portrait.raw</span>
            </div>
          </div>

          {/* Text content */}
          <div className="lg:pl-8">
            <p className="label-text text-[#5046e5] mb-4 uppercase tracking-wider">{t.about_label}</p>

            <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-8 text-white">
              {t.about_heading1}<br />
              <span className="text-[#5046e5]">{t.about_heading2}</span>
            </h2>

            <div className="space-y-6 body-text text-white/60">
              <p className="text-lg">{t.about_p1}</p>
              <p>{t.about_p2}</p>
            </div>

            {/* Services icons */}
            <div className="mt-12 flex gap-8 lg:gap-12">
              {[
                { icon: Camera, label: t.about_photography },
                { icon: Film, label: t.about_videography },
                { icon: Palette, label: t.about_digital_art },
              ].map((service) => (
                <div key={service.label} className="group text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#5046e5]/20 transition-colors duration-300">
                    <service.icon className="w-6 h-6 text-white/40 group-hover:text-[#5046e5] transition-colors duration-300" />
                  </div>
                  <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
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
