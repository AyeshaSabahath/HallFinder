"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Priya & Rajesh",
    event: "Wedding Reception",
    hall: "Royal Emerald Banquet Hall",
    text: "HallFinder made our wedding planning so easy! We found the perfect hall in Gandhi Gunj within minutes. The booking process was seamless.",
    rating: 5,
  },
  {
    name: "Mohammed Asif",
    event: "Engagement Ceremony",
    hall: "Shah Gunj Convention Center",
    text: "Excellent platform for finding halls in Bidar. The availability calendar saved us from visiting halls that were already booked.",
    rating: 5,
  },
  {
    name: "Lakshmi Devi",
    event: "50th Anniversary",
    hall: "Golden Palace Function Hall",
    text: "As a hall owner, HallFinder has brought us many genuine customers. The dashboard makes managing bookings very convenient.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Trusted by families and hall owners across Bidar
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-0 shadow-md">
                <CardContent className="p-6">
                  <Quote className="mb-4 h-8 w-8 text-gold-400 opacity-50" />
                  <p className="text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-gold-400 text-gold-400"
                      />
                    ))}
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {t.event} at {t.hall}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
