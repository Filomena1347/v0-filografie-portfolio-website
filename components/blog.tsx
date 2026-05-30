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
      {/* Light leak */}
      <div 
        className="aurora-light-leak absolute -right-64 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(210, 100, 182, 0.1) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20">
          <div>
            <p className="label-text text-[#9D4EDD] mb-6">Journal</p>
            <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl">
              Latest <span className="gradient-text">Insights</span>
            </h2>
          </div>
          <a 
            href="#"
            className="inline-flex items-center gap-2 text-[13px] tracking-wide text-[#a1a1aa] hover:text-[#9D4EDD] transition-colors mt-8 md:mt-0 group"
          >
            View All Articles
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <article 
              key={post.title}
              className="group bg-[#111118] border border-[#9D4EDD]/8 overflow-hidden cursor-pointer hover:border-[#9D4EDD]/20 transition-all duration-500"
            >
              {/* Gradient top accent */}
              <div 
                className="h-px"
                style={{
                  background: `linear-gradient(90deg, 
                    transparent 0%,
                    ${index === 0 ? "#7B2FBE" : index === 1 ? "#9D4EDD" : "#2EC4B6"} 50%, 
                    transparent 100%)`
                }}
              />
              
              {/* Image placeholder - larger */}
              <div className="aspect-[16/10] relative">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${135 + index * 30}deg, 
                      rgba(123, 47, 190, ${0.08 + index * 0.02}) 0%, 
                      rgba(10, 10, 15, 0.98) 100%)`
                  }}
                />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-5">
                  <span className="label-text text-[#9D4EDD]">{post.category}</span>
                  <span className="text-[12px] text-[#71717a] tracking-wider">{post.date}</span>
                </div>
                
                <h3 className="font-serif text-xl font-light mb-4 group-hover:text-[#9D4EDD] transition-colors">
                  {post.title}
                </h3>
                <p className="body-text text-[14px] text-[#71717a]">
                  {post.excerpt}
                </p>

                <div className="mt-8 flex items-center gap-2 text-[13px] text-[#a1a1aa] group-hover:text-[#2EC4B6] transition-colors">
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
