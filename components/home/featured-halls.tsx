import Link from "next/link";
import { HallCard } from "@/components/halls/hall-card";
import { Button } from "@/components/ui/button";
import { getFeaturedHalls } from "@/services/hall-service";
import { ArrowRight } from "lucide-react";

export async function FeaturedHallsSection() {
  const halls = await getFeaturedHalls();

  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Featured <span className="text-gradient">Venues</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Handpicked premium halls with exceptional amenities and service
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {halls.map((hall, i) => (
            <HallCard key={hall.id} hall={hall} index={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="luxury" size="lg" asChild>
            <Link href="/search">
              Explore All Halls
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
