import { ContactSection } from '@/components/landing/contact-section'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
        <ContactSection />
      </main>
    </div>
  )
}

