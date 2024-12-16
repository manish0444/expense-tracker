'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      'Up to 50 monthly expenses',
      'Basic expense tracking',
      'Monthly budget setting',
      'Simple analytics',
      'Email support',
      'Mobile app access',
      'CSV export'
    ],
    gradient: 'from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20'
  },
  {
    name: 'Pro',
    price: '$9.99',
    description: 'Everything in Free, plus:',
    features: [
      'Unlimited expenses',
      'AI-powered insights',
      'Advanced analytics',
      'Custom categories',
      'Priority support',
      'Real-time budget alerts',
      'Multi-currency support',
      'Receipt scanning',
      'Expense predictions',
      'Team collaboration'
    ],
    gradient: 'from-purple-500 to-indigo-500',
    recommended: true
  }
]

export function PricingSection() {
  const router = useRouter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-white/5 mask-gradient" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Simple, transparent pricing</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            Choose Your Plan
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Start with our free plan and upgrade anytime as your needs grow
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden group transition-all duration-300 hover:shadow-lg ${
                plan.recommended ? 'border-primary/50' : ''
              }`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${
                plan.recommended ? plan.gradient + ' opacity-10' : plan.gradient
              }`} />

              {/* Content */}
              <div className="relative z-10 p-8">
                {plan.recommended && (
                  <div className="absolute top-6 right-6">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Recommended</span>
                    </div>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <Button 
                  className={`w-full mb-8 ${
                    plan.recommended ? 'bg-primary hover:bg-primary/90' : ''
                  }`}
                  variant={plan.recommended ? 'default' : 'outline'}
                  onClick={() => router.push('/signup')}
                >
                  Get Started
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

