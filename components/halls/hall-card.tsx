"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Users, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { HallWithDetails } from "@/types";

interface HallCardProps {
  hall: HallWithDetails;
  showAvailability?: boolean;
  index?: number;
}

export function HallCard({ hall, showAvailability = true, index = 0 }: HallCardProps) {
  const coverImage =
    hall.images[0]?.imageUrl ??
    "https://placehold.co/800x600/emerald/white?text=Hall";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={coverImage}
            alt={hall.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {hall.featured && (
            <Badge variant="gold" className="absolute left-3 top-3">
              Featured
            </Badge>
          )}
          {showAvailability && (
            <Badge variant="success" className="absolute right-3 top-3">
              Available
            </Badge>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-sm text-white backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
            {hall.rating.toFixed(1)}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-display text-lg font-semibold line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {hall.name}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            {hall.area}, {hall.city}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Up to {hall.maxCapacity}
            </div>
            <div className="flex items-center gap-0.5 font-semibold text-emerald-700 dark:text-emerald-400">
              <IndianRupee className="h-4 w-4" />
              {formatPrice(hall.pricePerDay).replace("₹", "")}
            </div>
          </div>
          <Button variant="luxury" className="mt-4 w-full" asChild>
            <Link href={`/halls/${hall.id}`}>View Details</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
