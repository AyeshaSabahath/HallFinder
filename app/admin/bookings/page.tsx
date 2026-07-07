"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  eventDate: string;
  guestCount: number;
  eventType: string;
  status: string;
  customerName: string;
  hall: { name: string };
  customer: { fullName: string; email: string };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/booking")
      .then((r) => r.json())
      .then((json) => setBookings(json.data ?? []))
      .catch(() => {});
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/booking/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast.success(`Booking ${status.toLowerCase()}`);
      const updated = await fetch("/api/booking").then((r) => r.json());
      setBookings(updated.data ?? []);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">All Booking Requests</h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No booking requests yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{b.hall.name}</CardTitle>
                  <Badge>{b.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-1 text-sm sm:grid-cols-2">
                  <div>Customer: {b.customerName || b.customer.fullName}</div>
                  <div>Email: {b.customer.email}</div>
                  <div>Date: {new Date(b.eventDate).toLocaleDateString("en-IN")}</div>
                  <div>Guests: {b.guestCount} · {b.eventType}</div>
                </div>
                {b.status === "PENDING" && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="luxury" onClick={() => updateStatus(b.id, "APPROVED")}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "REJECTED")}>Reject</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
