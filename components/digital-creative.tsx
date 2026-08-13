import { Palette, Share2, Layers, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const serviceIcons = [
  { icon: Palette, color: "bg-indigo-500" },
  { icon: Share2, color: "bg-[#FF6B5B]" },
];

const graphicDesignVisuals = [
  { color: "from-violet-500 to-indigo-600" },
  { color: "from-indigo-500 to-blue-600" },
  { color: "from-purple-500 to-violet-600" },
  { color: "from-fuchsia-500 to-pink-600" },
  { color: "from-pink-500 to-rose-600" },
  { color: "from-rose-500 to-orange-500" },
];

const featureIcons = [
  { icon: Layers, color: "bg-sky-400" },
  { icon: Sparkles, color: "bg-amber-400" },
  { icon: Palette, color: "bg-violet-400" },
  { icon: Share2, color: "bg-emerald-400" },
];

export function DigitalCreative() {
  const { t } = useLanguage();
  const services = t.digital.services.map((service, i) => ({ ...service, ...serviceIcons[i] }));
  const graphicDesignItems = t.digital.graphicDesignItems.map((item, i) => ({
    ...item,
    ...graphicDesignVisuals[i],
  }));
  const features = t.digital.features.map((feature, i) => ({ ...feature, ...featureIcons[i] }));

  return (
    <>
      {/* Graphic Design Section */}
      <section id="graphic-design" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-violet-500/20 rounded-full blur-2xl" />
        <div className="absolute bottom-32 right-20 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-violet-400 font-sans text-sm tracking-wider uppercase mb-4">
              {t.digital.graphicDesignEyebrow}
            </p>
            <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
              {t.digital.graphicDesignHeadingLine1}<br />
              <span className="text-violet-400">{t.digital.graphicDesignHeadingLine2}</span>
            </h2>
            <p className="mt-8 font-sans text-gray-400 max-w-2xl mx-auto text-lg font-light">
              {t.digital.graphicDesignDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {graphicDesignItems.map((item) => (
              <div
                key={item.title}
                className="group cursor-pointer"
              >
                <div className={`aspect-[4/3] bg-gradient-to-br ${item.color} rounded-3xl overflow-hidden relative transition-all duration-500 group-hover:scale-[1.02]`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <p className="text-white/60 text-sm font-sans mb-1">{item.description}</p>
                    <h3 className="font-serif text-2xl text-white">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Creative Section */}
      <section id="digital" className="py-32 px-6 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-40 right-20 w-12 h-12 bg-pink-200 rounded-xl rotate-12 opacity-60" />
      <div className="absolute bottom-20 left-16 w-20 h-20 bg-violet-400 rounded-3xl -rotate-6 opacity-40" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
            {t.digital.creativeEyebrow}
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
            {t.digital.creativeHeadingLine1}<br />
            <span className="text-pink-300">{t.digital.creativeHeadingLine2}</span>
          </h2>
          <p className="mt-8 font-sans text-gray-400 max-w-2xl mx-auto text-lg font-light">
            {t.digital.creativeDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.category}
              className="bg-white rounded-3xl p-10 shadow-xl"
            >
              <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-8`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="font-serif text-2xl text-gray-900 mb-6">{service.category}</h3>

              <ul className="space-y-4">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-4 font-sans text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {features.map((feature) => (
            <div
              key={feature.label}
              className={`${feature.color} rounded-2xl p-6 text-center group hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}
            >
              <feature.icon className="w-6 h-6 text-white mx-auto mb-4" />
              <p className="text-white font-sans text-sm font-medium">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
