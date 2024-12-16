import { Button } from '@/components/ui/button'

export function DemoSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-foreground text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          See ExpenseTracker in Action
        </h2>
        <div className="max-w-4xl mx-auto bg-black/50 rounded-lg overflow-hidden">
          <div className="aspect-w-16 aspect-h-9">
            <iframe 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
        <div className="text-center mt-8">
          <Button size="lg" variant="secondary">
            Schedule a Live Demo
          </Button>
        </div>
      </div>
    </section>
  )
}

