import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="hero-section py-20 md:py-32 bg-gradient-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          Simplify Your Finances with ExpenseTracker
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in animation-delay-200">
          Track, analyze, and optimize your expenses with ease.
        </p>
        <Button asChild size="lg" className="animate-fade-in animation-delay-400 cta-button bg-white text-primary hover:bg-gray-100">
          <Link href="/signup">Start Your Free Trial</Link>
        </Button>
      </div>
    </section>
  )
}

