import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'John Doe',
    role: 'Small Business Owner',
    content: 'ExpenseTracker has revolutionized how I manage my business finances. It\'s intuitive and powerful!',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'Jane Smith',
    role: 'Freelancer',
    content: 'As a freelancer, keeping track of expenses was a nightmare. ExpenseTracker made it a breeze!',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'Mike Johnson',
    role: 'CFO',
    content: 'The insights we\'ve gained from ExpenseTracker have helped us optimize our company\'s spending significantly.',
    avatar: '/placeholder.svg?height=40&width=40',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic">&ldquo;{testimonial.content}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

