"use client"

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bot, Brain, ChartBar, Calendar, Wallet, Sparkles, 
  ArrowRight, Zap, Shield, Globe, PieChart, Bell
} from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Get personalized insights and recommendations powered by advanced AI',
    gradient: 'from-blue-500 to-indigo-500',
    details: [
      'Smart expense categorization',
      'Personalized budget recommendations',
      'Spending pattern analysis',
      'Natural language processing'
    ]
  },
  {
    icon: Brain,
    title: 'Smart Analytics',
    description: 'Understand your spending patterns with intelligent data analysis',
    gradient: 'from-purple-500 to-pink-500',
    details: [
      'Real-time data visualization',
      'Custom report generation',
      'Trend analysis',
      'Predictive insights'
    ]
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your financial data is protected with enterprise-level security',
    gradient: 'from-green-500 to-emerald-500',
    details: [
      'End-to-end encryption',
      'Two-factor authentication',
      'Regular security audits',
      'GDPR compliance'
    ]
  },
  {
    icon: Globe,
    title: 'Multi-Currency',
    description: 'Track expenses across different currencies with real-time conversion',
    gradient: 'from-orange-500 to-red-500',
    details: [
      'Real-time exchange rates',
      'Automatic currency conversion',
      'Multi-currency reports',
      'Local tax handling'
    ]
  },
  {
    icon: PieChart,
    title: 'Budget Planning',
    description: 'Set and track budgets with smart alerts and reminders',
    gradient: 'from-cyan-500 to-blue-500',
    details: [
      'Custom budget categories',
      'Flexible time periods',
      'Goal tracking',
      'Smart notifications'
    ]
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Stay on top of your finances with intelligent notifications',
    gradient: 'from-yellow-500 to-orange-500',
    details: [
      'Customizable alerts',
      'Threshold notifications',
      'Anomaly detection',
      'Scheduled reports'
    ]
  }
]

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0])

  return (
    <section ref={ref} id="features" className="py-32 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/5 mask-gradient" />
        <motion.div 
          className="absolute top-0 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"
          style={{ y }}
        />
        <motion.div 
          className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"
          style={{ y }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
          >
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Powerful Features</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
          >
            Everything You Need
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Advanced features powered by cutting-edge technology to help you manage your finances better
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onHoverStart={() => setActiveFeature(index)}
              onHoverEnd={() => setActiveFeature(null)}
            >
              <Card className="relative group h-full hover:shadow-lg transition-all duration-300 overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10 p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} p-2.5 mb-4`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>

                  <AnimatePresence>
                    {activeFeature === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        {feature.details.map((detail, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2 text-sm text-gray-400"
                          >
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <span>{detail}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Corner gradient */}
                <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl rounded-full transform translate-x-16 translate-y-16`} />
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button size="lg" className="group">
            Explore All Features
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

