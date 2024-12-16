'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Sparkles, Zap, Link as LinkIcon, Globe } from 'lucide-react'

const integrations = [
  {
    name: 'Bank Sync',
    description: 'Automatically sync transactions from your bank accounts',
    icon: LinkIcon,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Real-time Updates',
    description: 'Get instant notifications for new transactions',
    icon: Zap,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Global Support',
    description: 'Support for multiple currencies and regions',
    icon: Globe,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    name: 'Smart Import',
    description: 'Import data from other financial tools seamlessly',
    icon: Sparkles,
    gradient: 'from-green-500 to-emerald-500'
  }
]

export function IntegrationSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/5 mask-gradient" />
        <motion.div 
          className="absolute top-0 -left-48 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ y }}
        />
        <motion.div 
          className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ y: y, rotate }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
          >
            <LinkIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Seamless Integrations</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Connect Your Financial World
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Integrate with your favorite tools and services for a seamless financial management experience
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative group h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${integration.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10 p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${integration.gradient} p-2.5 mb-4`}>
                    <integration.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
                  <p className="text-muted-foreground">{integration.description}</p>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 