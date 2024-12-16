import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { ProcessSection } from '@/components/landing/process-section'
import { DemoSection } from '@/components/landing/demo-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { SocialProofSection } from '@/components/landing/social-proof-section'
import { FAQSection } from '@/components/landing/faq-section'
import { BlogSection } from '@/components/landing/blog-section'
import { Footer } from '@/components/landing/footer'
import { ProductTour } from '@/components/product-tour'
import { LiveChat } from '@/components/live-chat'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <DemoSection />
        <TestimonialsSection />
        <SocialProofSection />
        <FAQSection />
        <BlogSection />
      </main>
      <Footer />
      <ProductTour />
      <LiveChat />
    </div>
  )
}

