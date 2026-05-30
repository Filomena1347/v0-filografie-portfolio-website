import { Palette, Share2, Layers, Sparkles } from "lucide-react";

const services = [
  {
    category: "Graphic Design",
    icon: Palette,
    color: "bg-indigo-500",
    items: [
      "Brand Identity Design",
      "Logo Creation",
      "Marketing Materials",
      "Print Design",
      "Packaging Design",
    ],
  },
  {
    category: "Social Media",
    icon: Share2,
    color: "bg-[#FF6B5B]",
    items: [
      "Content Strategy",
      "Visual Content Creation",
      "Post Scheduling",
      "Community Management",
      "Analytics & Reporting",
    ],
  },
];

export function DigitalCreative() {
  return (
    <section id="digital" className="py-32 px-6 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-40 right-20 w-12 h-12 bg-pink-200 rounded-xl rotate-12 opacity-60" />
      <div className="absolute bottom-20 left-16 w-20 h-20 bg-violet-400 rounded-3xl -rotate-6 opacity-40" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
            Digital Creative
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
            Beyond the<br />
            <span className="text-pink-300">lens.</span>
          </h2>
          <p className="mt-8 font-sans text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Comprehensive digital services to elevate your brand presence across all platforms.
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
          {[
            { icon: Layers, label: "Web Design", color: "bg-sky-400" },
            { icon: Sparkles, label: "Motion Graphics", color: "bg-amber-400" },
            { icon: Palette, label: "UI/UX Design", color: "bg-violet-400" },
            { icon: Share2, label: "Ad Campaigns", color: "bg-emerald-400" },
          ].map((feature) => (
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
  );
}
