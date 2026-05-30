import { ArrowUpRight, Calendar } from "lucide-react"

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
    <section id="blog" className="relative py-32 overflow-hidden">
      {/* Aurora accent */}
      <div 
        className="absolute -right-64 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #D264B6 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <p className="text-[#9D4EDD] text-xs tracking-[0.3em] uppercase mb-4">Blog</p>
            <h2 className="text-4xl md:text-5xl font-extralight">
              Latest <span className="gradient-text">Insights</span>
            </h2>
          </div>
          <a 
            href="#"
            className="inline-flex items-center gap-2 text-sm tracking-wider text-[#a1a1aa] hover:text-[#9D4EDD] transition-colors mt-6 md:mt-0 group"
          >
            View All Articles
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article 
              key={post.title}
              className="group glass-card rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Gradient top border */}
              <div 
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, 
                    ${index === 0 ? "#7B2FBE" : index === 1 ? "#9D4EDD" : "#2EC4B6"} 0%, 
                    ${index === 0 ? "#9D4EDD" : index === 1 ? "#2EC4B6" : "#D264B6"} 100%)`
                }}
              />
              
              {/* Image placeholder */}
              <div className="aspect-[16/10] relative">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${135 + index * 30}deg, 
                      rgba(123, 47, 190, ${0.2 + index * 0.05}) 0%, 
                      rgba(10, 10, 15, 0.9) 100%)`
                  }}
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs tracking-wider text-[#9D4EDD]">{post.category}</span>
                  <span className="flex items-center gap-1 text-xs text-[#71717a]">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                </div>
                
                <h3 className="text-lg font-light mb-3 group-hover:text-[#9D4EDD] transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-[#71717a] font-light leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm text-[#a1a1aa] group-hover:text-[#2EC4B6] transition-colors">
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
