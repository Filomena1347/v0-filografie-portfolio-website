import { ArrowUpRight } from "lucide-react"

const blogPosts = [
  {
    title: "The Art of Golden Hour Photography",
    excerpt: "Discover the secrets to capturing stunning photos during the magical golden hour.",
    category: "Photography Tips",
    date: "Dec 15, 2024",
  },
  {
    title: "Wedding Trends for 2025",
    excerpt: "Exploring the latest wedding photography and videography trends for the upcoming year.",
    category: "Weddings",
    date: "Dec 10, 2024",
  },
  {
    title: "Building Your Brand Visual Identity",
    excerpt: "A comprehensive guide to creating a cohesive visual identity for your business.",
    category: "Branding",
    date: "Dec 5, 2024",
  },
]

export function Blog() {
  return (
    <section id="blog" className="relative py-40 overflow-hidden">
      {/* Aurora glow */}
      <div 
        className="aurora-glow absolute -right-[20%] top-1/2 -translate-y-1/2 w-[40%] h-[60%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(219, 39, 119, 0.1) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-24">
          <div>
            <p className="label-sm text-violet-400/80 mb-8">Journal</p>
            <h2 className="heading-display text-4xl md:text-5xl lg:text-7xl text-white">
              LATEST <span className="text-gradient">INSIGHTS</span>
            </h2>
          </div>
          <a 
            href="#"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-light text-white/40 hover:text-white transition-colors mt-8 md:mt-0 group"
          >
            View All Articles
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {blogPosts.map((post, index) => (
            <article 
              key={post.title}
              className="group card-dark overflow-hidden cursor-pointer"
            >
              {/* Gradient top accent */}
              <div 
                className="h-px"
                style={{
                  background: `linear-gradient(90deg, 
                    transparent 0%,
                    ${index === 0 ? "rgba(124, 58, 237, 0.5)" : index === 1 ? "rgba(192, 38, 211, 0.5)" : "rgba(219, 39, 119, 0.5)"} 50%, 
                    transparent 100%)`
                }}
              />
              
              {/* Image placeholder */}
              <div className="aspect-[16/10] relative">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${135 + index * 30}deg, 
                      rgba(124, 58, 237, ${0.06 + index * 0.02}) 0%, 
                      rgba(5, 5, 7, 0.98) 100%)`
                  }}
                />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="label-sm text-violet-400/80">{post.category}</span>
                  <span className="text-[10px] text-white/20 tracking-[0.1em] uppercase">{post.date}</span>
                </div>
                
                <h3 className="heading-light text-xl text-white mb-4 group-hover:text-violet-300 transition-colors duration-500">
                  {post.title}
                </h3>
                <p className="body-light text-[14px] text-white/30">
                  {post.excerpt}
                </p>

                <div className="mt-8 flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-white/30 group-hover:text-violet-400/80 transition-colors duration-500">
                  Read More
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
