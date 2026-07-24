"use client";

import { Play, Film } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function Video() {
  const { t } = useLanguage();

  const videoThumbnails = [
    { titleKey: t.video_wedding, duration: "2:30", color: "bg-pink-200" },
    { titleKey: t.video_event, duration: "1:45", color: "bg-amber-300" },
    { titleKey: t.video_brand, duration: "4:12", color: "bg-sky-400" },
  ];

  return (
    <section id="video" className="py-32 px-6 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 right-16 w-24 h-24 bg-indigo-500 rounded-3xl rotate-12 opacity-40" />
      <div className="absolute bottom-32 left-10 w-16 h-16 bg-[#FF6B5B] rounded-2xl -rotate-6 opacity-50" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
            {t.video_label}
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
            {t.video_line1}<br />
            <span className="text-indigo-400">{t.video_line2}</span>
          </h2>
        </div>

        {/* Main video showcase */}
        <div className="relative max-w-5xl mx-auto">
          <div className="aspect-video bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl overflow-hidden group cursor-pointer relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Play className="w-10 h-10 text-indigo-600 ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 flex items-center gap-3">
              <Film className="w-4 h-4 text-indigo-500" />
              <span className="text-gray-800 font-sans text-sm font-medium">{t.video_showreel}</span>
            </div>
          </div>

          {/* Video thumbnails */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {videoThumbnails.map((video) => (
              <div key={video.titleKey} className="group cursor-pointer">
                <div className={`aspect-video ${video.color} rounded-2xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-gray-800 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-white font-serif text-lg">{video.titleKey}</h3>
                  <p className="text-gray-400 font-sans text-sm mt-1">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
