"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HallWithDetails } from "@/types";

export default function AdminHallsPage() {
  const [halls, setHalls] = useState<HallWithDetails[]>([]);

  const fetchHalls = () => {
    fetch("/api/admin?type=halls")
      .then((r) => r.json())
      .then((json) => setHalls(json.data ?? []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const updateHall = async (id: string, approved: boolean) => {
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hallId: id, approved }),
    });

    if (res.ok) {
      toast.success(approved ? "Hall approved" : "Hall rejected");
      fetchHalls();
    } else {
      const json = await res.json();
      toast.error(json.error ?? "Failed to update hall");
    }
  };

  const deleteHall = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hall?")) return;

    const res = await fetch(`/api/halls/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Hall deleted");
      fetchHalls();
    } else {
      const json = await res.json();
      toast.error(json.error ?? "Failed to delete hall");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Manage Listings</h1>

      {halls.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No halls found. Run the seed script to populate data.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {halls.map((h) => (
            <Card key={h.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{h.name}</CardTitle>
                  <Badge variant={h.approved ? "success" : "warning"}>
                    {h.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {h.area} · {h.maxCapacity} guests · Owner: {h.owner?.fullName}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {!h.approved && (
                    <Button size="sm" variant="luxury" onClick={() => updateHall(h.id, true)}>
                      Approve
                    </Button>
                  )}
                  {h.approved && (
                    <Button size="sm" variant="outline" onClick={() => updateHall(h.id, false)}>
                      Unapprove
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => deleteHall(h.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
