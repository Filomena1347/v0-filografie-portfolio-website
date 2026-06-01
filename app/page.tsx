import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Portfolio } from "@/components/portfolio"
import { Photography } from "@/components/photography"
import { Video } from "@/components/video"
import { DigitalCreative } from "@/components/digital-creative"
import { Pricing } from "@/components/pricing"
import { Blog } from "@/components/blog"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { CosmicElements } from "@/components/cosmic-elements"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] relative">
      <CosmicElements />
      <Navbar />
      <Hero />
      <About />
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
