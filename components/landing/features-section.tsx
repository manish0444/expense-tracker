"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, PieChart, Wallet, FileText } from 'lucide-react'

const features = [
  {
    id: 'expense-tracking',
    title: 'Expense Tracking',
    description: 'Easily log and categorize your expenses in real-time.',
    icon: Wallet,
    stat: { value: 10000, label: 'Active Users' }
  },
  {
    id: 'analytics',
    title: 'Visual Analytics',
    description: 'Get insights with beautiful charts and graphs.',
    icon: PieChart,
    stat: { value: 5000000, label: 'Transactions Processed' }
  },
  {
    id: 'budgeting',
    title: 'Budget Planning',
    description: 'Set and manage budgets to reach your financial goals.',
    icon: BarChart3,
    stat: { value: 500, label: 'Companies Trust Us' }
  },
  {
    id: 'reports',
    title: 'Detailed Reports',
    description: 'Generate comprehensive financial reports.',
    icon: FileText,
    stat: { value: 98, label: 'Customer Satisfaction' }
  },
]

function AnimatedCounter({ value, label }: { value: number, label: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-primary">
        {count.toLocaleString()}
        {label === 'Customer Satisfaction' && '%'}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Powerful Features for Your Finances
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} id={feature.id} className="transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{feature.description}</CardDescription>
                <AnimatedCounter value={feature.stat.value} label={feature.stat.label} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

