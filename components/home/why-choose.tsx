"use client";

import { motion } from "framer-motion";
import { Shield, Clock, MapPin, Star } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description:
      "Every hall is verified by our team to ensure accurate information and quality standards.",
  },
  {
    icon: Clock,
    title: "Real-Time Availability",
    description:
      "See up-to-date availability calendars so you never waste time on booked venues.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    description:
      "Specialized in Bidar with deep knowledge of every area from Gandhi Gunj to Naubad.",
  },
  {
    icon: Star,
    title: "Premium Selection",
    description:
      "Curated collection of the finest function halls for weddings and celebrations.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="bg-gradient-to-br from-emerald-900 to-emerald-800 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Why Choose <span className="text-gold-400">HallFinder</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-emerald-100">
            The trusted platform for finding function halls in Bidar
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <feature.icon className="mb-4 h-10 w-10 text-gold-400" />
              <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-emerald-100">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
