'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TrendingUp, Users, Clock, Award } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    value: '$2.5M+',
    label: 'Expenses Tracked',
    color: 'from-blue-600 to-cyan-500'
  },
  {
    icon: Users,
    value: '50K+',
    label: 'Active Users',
    color: 'from-purple-600 to-pink-500'
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Support Available',
    color: 'from-orange-600 to-red-500'
  },
  {
    icon: Award,
    value: '99.9%',
    label: 'Uptime',
    color: 'from-green-600 to-emerald-500'
  }
]

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10])

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* 3D Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          style={{ y, rotateX: rotate }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-xl overflow-hidden">
                {/* Gradient Orb */}
                <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`} />

                <div className="relative">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} p-2.5 mb-4`}>
                    <stat.icon className="w-full h-full text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-3xl font-bold text-white">{stat.value}</h4>
                    <p className="text-gray-400">{stat.label}</p>
                  </div>
                </div>

                {/* Bottom Shine Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 