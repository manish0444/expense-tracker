import { PricingSection } from '@/components/landing/pricing-section'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12">Our Pricing Plans</h1>
        <PricingSection />
      </main>
    </div>
  )
}

