'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Bot, Sparkles, Brain, Zap, ChartBar, Calendar, Lock, Infinity, Wallet, Lightbulb } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI Financial Assistant',
    description: 'Get personalized financial advice and insights powered by advanced AI',
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-purple-500/20'
  },
  {
    icon: Brain,
    title: 'Smart Budget Planning',
    description: 'AI-powered budget recommendations based on your spending patterns',
    color: 'text-purple-500',
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: ChartBar,
    title: 'Advanced Analytics',
    description: 'Deep insights into your spending habits with predictive analysis',
    color: 'text-green-500',
    gradient: 'from-green-500/20 to-emerald-500/20'
  },
  {
    icon: Calendar,
    title: 'Recurring Expense Tracking',
    description: 'Automatic tracking and management of recurring bills and subscriptions',
    color: 'text-orange-500',
    gradient: 'from-orange-500/20 to-red-500/20'
  },
  {
    icon: Wallet,
    title: 'Multi-Currency Support',
    description: 'Track expenses in multiple currencies with real-time conversion',
    color: 'text-teal-500',
    gradient: 'from-teal-500/20 to-cyan-500/20'
  },
  {
    icon: Lightbulb,
    title: 'Smart Saving Suggestions',
    description: 'Get actionable suggestions to optimize your spending and save more',
    color: 'text-yellow-500',
    gradient: 'from-yellow-500/20 to-amber-500/20'
  }
]

export function PremiumFeatures() {
  const router = useRouter()

  useEffect(() => {
    // Add shimmer effect to cards
    const cards = document.querySelectorAll('.premium-feature-card')
    let currentIndex = 0

    const addShimmer = () => {
      cards.forEach((card, index) => {
        if (index === currentIndex) {
          card.classList.add('shimmer')
        } else {
          card.classList.remove('shimmer')
        }
      })
      currentIndex = (currentIndex + 1) % cards.length
    }

    const interval = setInterval(addShimmer, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <Card className="p-6 overflow-hidden relative bg-gradient-to-r from-black to-gray-900 border-0">
        <div className="absolute inset-0 bg-grid-white/5 mask-gradient" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-500">Premium Features</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to Pro
          </h2>
          <p className="text-gray-400 mb-6">
            Get access to premium features and take control of your finances
          </p>
          <Button 
            onClick={() => router.push('/dashboard/settings')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            Upgrade Now
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/30 to-pink-500/30 blur-2xl" />
      </Card>

      {/* Features Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card 
            key={index}
            className={`premium-feature-card p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r ${feature.gradient}`}
          >
            <div className="relative z-10">
              <div className={`p-2 w-fit rounded-lg bg-white/10 mb-4 ${feature.color}`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </Card>
        ))}
      </div>

      {/* Pro Badge */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>Available for Pro users</span>
        </div>
      </div>
    </div>
  )
} 