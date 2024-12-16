'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Smartphone, BarChart3, Shield } from 'lucide-react'

const steps = [
  {
    icon: Smartphone,
    title: 'Track Expenses',
    description: 'Log your expenses on the go with our mobile app',
    color: 'bg-blue-500'
  },
  {
    icon: BarChart3,
    title: 'Analyze Data',
    description: 'Get insights from your spending patterns',
    color: 'bg-purple-500'
  },
  {
    icon: Shield,
    title: 'Stay Protected',
    description: 'Your financial data is always secure',
    color: 'bg-green-500'
  }
]

export function WorkflowSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1])

  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-black">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
      </div>

      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ scale, opacity }}
      >
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 text-white"
          >
            How It Works
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Start managing your expenses in three simple steps
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-gray-800 to-transparent">
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800" />
                </div>
              )}

              <div className="relative group">
                {/* Icon */}
                <div className={`w-24 h-24 ${step.color} rounded-2xl p-6 mx-auto mb-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <step.icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
} 