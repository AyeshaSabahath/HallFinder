import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search/search-page-client";

export const metadata: Metadata = {
  title: "Search Function Halls",
  description: "Search available function halls in Bidar by date, area, and capacity.",
};

export default function SearchPage() {
  return <SearchPageClient />;
}
