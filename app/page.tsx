import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Portfolio } from "@/components/portfolio"
import { Photography } from "@/components/photography"
import { Video } from "@/components/video"
import { DigitalCreative } from "@/components/digital-creative"
import { Pricing } from "@/components/pricing"
import { Blog } from "@/components/blog"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <Hero />
      <Portfolio />
      <Photography />
      <Video />
      <DigitalCreative />
      <Pricing />
      <Blog />
      <Contact />
      <Footer />
    </main>
  )
}
