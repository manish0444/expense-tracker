import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList, BarChart, Lightbulb } from 'lucide-react'

const steps = [
  {
    title: 'Log Your Expenses',
    description: 'Quickly and easily input your daily expenses.',
    icon: ClipboardList,
  },
  {
    title: 'Analyze Your Spending',
    description: 'View detailed reports and visualizations of your spending habits.',
    icon: BarChart,
  },
  {
    title: 'Optimize Your Budget',
    description: 'Get personalized recommendations to improve your financial health.',
    icon: Lightbulb,
  },
]

export function ProcessSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

