"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BIDAR_AREAS } from "@/lib/utils";

interface SearchBarProps {
  defaultDate?: string;
  defaultArea?: string;
  defaultGuests?: string;
  variant?: "hero" | "compact";
}

export function SearchBar({
  defaultDate = "",
  defaultArea = "",
  defaultGuests = "",
  variant = "hero",
}: SearchBarProps) {
  const router = useRouter();
  const [date, setDate] = useState(defaultDate);
  const [area, setArea] = useState(defaultArea);
  const [guests, setGuests] = useState(defaultGuests);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (area) params.set("area", area);
    if (guests) params.set("guests", guests);
    router.push(`/search?${params.toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSearch}
      className={
        isHero
          ? "glass rounded-2xl p-4 shadow-2xl md:p-6"
          : "rounded-xl border bg-card p-4 shadow-sm"
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Calendar className="h-4 w-4 text-emerald-600" />
            Event Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Area
          </label>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              {BIDAR_AREAS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4 text-emerald-600" />
            Guests
          </label>
          <Input
            type="number"
            placeholder="e.g. 500"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min={50}
            max={5000}
            className="h-12"
          />
        </div>

        <div className="flex items-end">
          <Button
            type="submit"
            variant={isHero ? "gold" : "luxury"}
            size="lg"
            className="h-12 w-full text-base"
          >
            <Search className="h-5 w-5" />
            Search Halls
          </Button>
        </div>
      </div>
    </form>
  );
}
