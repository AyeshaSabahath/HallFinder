import Link from "next/link";
import { HallCard } from "@/components/halls/hall-card";
import { Button } from "@/components/ui/button";
import { getPopularHalls } from "@/services/hall-service";
import { ArrowRight } from "lucide-react";

export async function PopularHallsSection() {
  const halls = await getPopularHalls();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Popular <span className="text-gradient">Venues</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Top-rated function halls loved by families in Bidar
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/search">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {halls.map((hall, i) => (
            <HallCard key={hall.id} hall={hall} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
