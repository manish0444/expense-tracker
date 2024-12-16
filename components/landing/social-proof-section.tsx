import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

const clients = [
  { name: 'TechCorp', logo: '/placeholder.svg?height=50&width=120' },
  { name: 'FinanceHub', logo: '/placeholder.svg?height=50&width=120' },
  { name: 'GlobalTrade', logo: '/placeholder.svg?height=50&width=120' },
  { name: 'InnovateCo', logo: '/placeholder.svg?height=50&width=120' },
  { name: 'FutureTech', logo: '/placeholder.svg?height=50&width=120' },
]

const awards = [
  { name: 'Best FinTech Solution 2023', organization: 'Tech Awards' },
  { name: 'Top 10 Startups to Watch', organization: 'Finance Monthly' },
  { name: 'Innovation in Personal Finance', organization: 'Global Banking Awards' },
]

export function SocialProofSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Trusted by Industry Leaders
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
          {clients.map((client, index) => (
            <div key={index} className="w-40 h-20 flex items-center justify-center">
              <Image 
                src={client.logo} 
                alt={client.name} 
                width={120} 
                height={50} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Award-Winning Solution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {awards.map((award, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">{award.name}</h4>
                <p className="text-sm text-muted-foreground">{award.organization}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

