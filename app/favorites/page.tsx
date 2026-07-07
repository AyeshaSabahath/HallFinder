"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { HallCard } from "@/components/halls/hall-card";
import { HallGridSkeleton } from "@/components/halls/hall-card-skeleton";
import { Button } from "@/components/ui/button";
import type { HallWithDetails } from "@/types";

export default function FavoritesPage() {
  const [halls, setHalls] = useState<HallWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/login";
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setHalls(d.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-2">
        My <span className="text-gradient">Favorites</span>
      </h1>
      <p className="text-muted-foreground mb-8">Halls you&apos;ve saved for later</p>

      {loading ? (
        <HallGridSkeleton />
      ) : halls.length === 0 ? (
        <div className="rounded-xl border bg-muted/30 p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-display text-xl font-semibold">No favorites yet</h3>
          <p className="mt-2 text-muted-foreground mb-6">
            Browse halls and save your favorites for easy access.
          </p>
          <Button variant="luxury" asChild>
            <Link href="/search">Browse Halls</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {halls.map((hall, i) => (
            <HallCard key={hall.id} hall={hall} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
