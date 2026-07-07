"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SessionUser } from "@/types";

interface ProfilePageClientProps {
  user: SessionUser;
}

export function ProfilePageClient({ user }: ProfilePageClientProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Array<{
    id: string;
    eventDate: string;
    status: string;
    hall: { name: string; area: string };
  }>>([]);

  useEffect(() => {
    fetch("/api/booking")
      .then((r) => r.json())
      .then((json) => setBookings(json.data ?? []))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">My Profile</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{user.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium capitalize">{user.role.toLowerCase()}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>My Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">No booking requests yet.</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="flex justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">{b.hall.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(b.eventDate).toLocaleDateString("en-IN")} · {b.hall.area}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-emerald-600">{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        Log Out
      </Button>
    </div>
  );
}
