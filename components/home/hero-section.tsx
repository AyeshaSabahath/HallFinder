"use client";

import { motion } from "framer-motion";
import { SearchBar } from "@/components/search/search-bar";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519165217289-ffe2bdcd1a0a?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="container relative mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-gold-400" />
            Premium Venues in Bidar, Karnataka
          </motion.div>

          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            Find Your Perfect
            <span className="block text-gold-400">Function Hall</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            Discover elegant banquet halls and convention centers for weddings,
            receptions, and celebrations. Search by date, area, and guest count.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10"
          >
            <SearchBar variant="hero" />
          </motion.div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/70">
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-400">16+</div>
              <div className="text-sm">Premium Halls</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-400">10</div>
              <div className="text-sm">Areas Covered</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-400">500+</div>
              <div className="text-sm">Events Hosted</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
