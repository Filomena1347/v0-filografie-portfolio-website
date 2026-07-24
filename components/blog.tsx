import { ArrowUpRight } from "lucide-react";

const blogPosts = [
  {
    title: "The Art of Golden Hour Photography",
    excerpt: "Discover the secrets to capturing stunning photos during the magical golden hour.",
    category: "Photography Tips",
    date: "Dec 15, 2024",
    color: "bg-amber-300",
  },
  {
    title: "Wedding Trends for 2025",
    excerpt: "Exploring the latest wedding photography and videography trends for the upcoming year.",
    category: "Weddings",
    date: "Dec 10, 2024",
    color: "bg-pink-200",
  },
  {
    title: "Building Your Brand Visual Identity",
    excerpt: "A comprehensive guide to creating a cohesive visual identity for your business.",
    category: "Branding",
    date: "Dec 5, 2024",
    color: "bg-indigo-500",
  },
];

export function Blog() {
  return (
    <section id="blog" className="py-32 px-6 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-24 right-10 w-14 h-14 bg-[#FF6B5B] rounded-xl rotate-12 opacity-50" />
      <div className="absolute bottom-32 left-20 w-18 h-18 bg-sky-400 rounded-2xl -rotate-6 opacity-40" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
              Journal
            </p>
            <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
              Latest<br />
              <span className="text-[#FF6B5B]">insights.</span>
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-sans text-sm transition-colors mt-8 md:mt-0"
          >
            View All Articles
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.title}
              className="group bg-white rounded-3xl overflow-hidden shadow-xl cursor-pointer hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image placeholder */}
              <div className={`aspect-[16/10] ${post.color} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/40 font-serif text-4xl">IMG</span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-sans text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-400 font-sans text-xs">{post.date}</span>
                </div>

                <h3 className="font-serif text-xl text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="font-sans text-gray-500 text-sm leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-6 flex items-center gap-2 text-indigo-500 font-sans text-sm font-medium group-hover:gap-3 transition-all duration-300">
                  Read More
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
