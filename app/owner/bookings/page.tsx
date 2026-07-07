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
  phone: string;
  customerName: string;
  status: string;
  hall: { name: string; area: string };
  customer: { fullName: string; email: string };
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    fetch("/api/booking")
      .then((r) => r.json())
      .then((json) => {
        setBookings(json.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/booking/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchBookings();
    } else {
      const json = await res.json();
      toast.error(json.error ?? "Failed to update booking");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Booking Requests</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : bookings.length === 0 ? (
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
                  <Badge variant={b.status === "PENDING" ? "warning" : b.status === "APPROVED" ? "success" : "destructive"}>
                    {b.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div><span className="text-muted-foreground">Customer:</span> {b.customerName || b.customer.fullName}</div>
                  <div><span className="text-muted-foreground">Email:</span> {b.customer.email}</div>
                  <div><span className="text-muted-foreground">Date:</span> {new Date(b.eventDate).toLocaleDateString("en-IN")}</div>
                  <div><span className="text-muted-foreground">Guests:</span> {b.guestCount}</div>
                  <div><span className="text-muted-foreground">Event:</span> {b.eventType}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {b.phone}</div>
                </div>
                {b.status === "PENDING" && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="luxury" onClick={() => updateStatus(b.id, "APPROVED")}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "REJECTED")}>
                      Reject
                    </Button>
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
