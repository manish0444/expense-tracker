import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { ProcessSection } from '@/components/landing/process-section'

import { Footer } from '@/components/landing/footer'

import { LiveChat } from '@/components/live-chat'
import { IntegrationSection } from '@/components/landing/integration-section'
import { WorkflowSection } from '@/components/landing/workflow-section'
import { StatsSection } from '@/components/landing/stats-section'
import { ShowcaseSection } from '@/components/landing/showcase-section'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <IntegrationSection />
        <WorkflowSection />
        <StatsSection />
        <ShowcaseSection />
      </main>
      <Footer />
      <LiveChat />
    </div>
  )
}

