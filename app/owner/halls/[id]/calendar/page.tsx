"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HallCalendarPage() {
  const params = useParams();
  const hallId = params.id as string;
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [availability, setAvailability] = useState<Array<{ id: string; date: string; status: string }>>([]);

  const fetchAvailability = useCallback(() => {
    fetch(`/api/availability?hallId=${hallId}`)
      .then((r) => r.json())
      .then((json) => setAvailability(json.data ?? []))
      .catch(() => {});
  }, [hallId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hallId, date, status }),
    });

    const json = await res.json();
    if (res.ok) {
      toast.success("Availability updated");
      setDate("");
      fetchAvailability();
    } else {
      toast.error(json.error ?? "Failed to update availability");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Manage Calendar</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Update Date Status</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="BOOKED">Booked</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="luxury">Update</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Dates</CardTitle>
        </CardHeader>
        <CardContent>
          {availability.length === 0 ? (
            <p className="text-muted-foreground text-sm">No dates scheduled yet.</p>
          ) : (
            <div className="space-y-2">
              {availability.map((a) => (
                <div key={a.id} className="flex justify-between rounded-lg border p-3 text-sm">
                  <span>{new Date(a.date).toLocaleDateString("en-IN")}</span>
                  <span className="font-medium text-emerald-600">{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
