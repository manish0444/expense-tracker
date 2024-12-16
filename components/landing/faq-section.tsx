import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: 'How secure is my financial data?',
    answer: 'We take security very seriously. All data is encrypted and stored securely. We use industry-standard security measures to protect your information.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes, you can export your data in various formats including CSV and PDF. This feature is available on all plans.',
  },
  {
    question: 'Is there a mobile app?',
    answer: 'Yes, we have mobile apps for both iOS and Android. You can download them from the respective app stores.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time from your account settings. If you cancel, you\'ll have access to the service until the end of your current billing period.',
  },
]

export function FAQSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

