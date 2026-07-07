"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { SlidersHorizontal } from "lucide-react";
import { HallCard } from "@/components/halls/hall-card";
import { HallGridSkeleton } from "@/components/halls/hall-card-skeleton";
import { SearchBar } from "@/components/search/search-bar";
import { SearchFilters } from "@/components/search/search-filters";
import { Button } from "@/components/ui/button";
import type { HallWithDetails } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const [halls, setHalls] = useState<HallWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const date = searchParams.get("date") ?? "";
  const area = searchParams.get("area") ?? "";
  const guests = searchParams.get("guests") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const ac = searchParams.get("ac") === "true";
  const parking = searchParams.get("parking") === "true";

  const fetchHalls = useCallback(async (pageNum: number) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (area) params.set("area", area);
    if (guests) params.set("guests", guests);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (ac) params.set("ac", "true");
    if (parking) params.set("parking", "true");
    params.set("page", String(pageNum));

    const res = await fetch(`/api/halls?${params.toString()}`);
    const json = await res.json();
    setHalls(json.data ?? []);
    setTotal(json.pagination?.total ?? 0);
    setTotalPages(json.pagination?.totalPages ?? 1);
    setPage(json.pagination?.page ?? pageNum);
    setLoading(false);
  }, [date, area, guests, minPrice, maxPrice, ac, parking]);

  useEffect(() => {
    fetchHalls(1);
  }, [fetchHalls]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">
          Search <span className="text-gradient">Results</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          {loading ? "Searching..." : `${total} halls found in Bidar`}
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          defaultDate={date}
          defaultArea={area}
          defaultGuests={guests}
          variant="compact"
        />
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <SearchFilters />
        </aside>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mb-6 lg:hidden">
              <SearchFilters />
            </div>
          )}

          {loading ? (
            <HallGridSkeleton />
          ) : halls.length === 0 ? (
            <div className="rounded-xl border bg-muted/30 p-12 text-center">
              <h3 className="font-display text-xl font-semibold">No halls found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your filters or selecting a different date.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {halls.map((hall, i) => (
                  <HallCard key={hall.id} hall={hall} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => fetchHalls(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="px-4 text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => fetchHalls(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function SearchPageClient() {
  return (
    <Suspense fallback={<HallGridSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
