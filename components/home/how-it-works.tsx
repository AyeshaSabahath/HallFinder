"use client";

import { motion } from "framer-motion";
import { Search, Calendar, Phone, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Filter",
    description:
      "Enter your event date, preferred area in Bidar, and guest count to find available halls instantly.",
  },
  {
    icon: Calendar,
    title: "Check Availability",
    description:
      "View real-time calendar availability, amenities, photos, and pricing for each venue.",
  },
  {
    icon: Phone,
    title: "Contact & Book",
    description:
      "Submit a booking request or contact the hall owner directly via phone or WhatsApp.",
  },
  {
    icon: CheckCircle,
    title: "Celebrate",
    description:
      "Confirm your booking and celebrate your special day at a stunning venue in Bidar.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Finding your dream venue in Bidar is just four simple steps away
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-lg">
                <step.icon className="h-7 w-7" />
              </div>
              <div className="mb-2 text-sm font-semibold text-gold-500">
                Step {i + 1}
              </div>
              <h3 className="font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
