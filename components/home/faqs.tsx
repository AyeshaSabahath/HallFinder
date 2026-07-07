"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I search for available halls in Bidar?",
    a: "Simply enter your event date, preferred area, and number of guests on our homepage search bar. We'll show you all halls available on that date with filters for budget, capacity, AC, and parking.",
  },
  {
    q: "Is HallFinder free to use for customers?",
    a: "Yes! Searching halls, viewing details, and submitting booking requests is completely free for customers. You only pay the hall owner directly for your booking.",
  },
  {
    q: "How can I list my function hall on HallFinder?",
    a: "Register as a Hall Owner, complete your profile, and add your hall details with photos. Once approved by our admin team, your listing will be visible to customers.",
  },
  {
    q: "What areas in Bidar do you cover?",
    a: "We cover all major areas including Gandhi Gunj, Station Road, Shah Gunj, Naubad, Mailoor Road, Humnabad Road, Chidri Road, Old City, Cantonment, and Udgir Road.",
  },
  {
    q: "How does the booking process work?",
    a: "After finding a hall you like, submit a booking request with your event details. The hall owner will review and contact you to confirm availability and discuss pricing.",
  },
  {
    q: "Can I contact hall owners directly?",
    a: "Yes! Each hall detail page includes the owner's contact number and a WhatsApp button for instant communication.",
  },
];

export function FAQSection() {
  return (
    <section id="faqs" className="bg-muted/30 py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
