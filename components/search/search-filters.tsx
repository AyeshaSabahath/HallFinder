"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [ac, setAc] = useState(searchParams.get("ac") === "true");
  const [parking, setParking] = useState(searchParams.get("parking") === "true");

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    if (ac) params.set("ac", "true");
    else params.delete("ac");
    if (parking) params.set("parking", "true");
    else params.delete("parking");
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setAc(false);
    setParking(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("ac");
    params.delete("parking");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Budget (₹)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="ac"
              checked={ac}
              onCheckedChange={(v) => setAc(v === true)}
            />
            <Label htmlFor="ac" className="cursor-pointer">
              Air Conditioned
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="parking"
              checked={parking}
              onCheckedChange={(v) => setParking(v === true)}
            />
            <Label htmlFor="parking" className="cursor-pointer">
              Parking Available
            </Label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="luxury" className="flex-1" onClick={applyFilters}>
            Apply
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
