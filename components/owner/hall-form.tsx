"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BIDAR_AREAS } from "@/lib/utils";
import type { HallWithDetails } from "@/types";

interface HallFormProps {
  mode: "create" | "edit";
  hallId?: string;
  initialData?: HallWithDetails;
}

export function HallForm({ mode, hallId, initialData }: HallFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    address: initialData?.address ?? "",
    area: initialData?.area ?? "",
    maxCapacity: initialData?.maxCapacity?.toString() ?? "",
    pricePerDay: initialData?.pricePerDay?.toString() ?? "",
    contactPhone: initialData?.contactPhone ?? "",
    latitude: initialData?.latitude?.toString() ?? "17.9134",
    longitude: initialData?.longitude?.toString() ?? "77.5301",
    parking: initialData?.parking ?? true,
    ac: initialData?.ac ?? true,
    kitchen: initialData?.kitchen ?? true,
    rooms: initialData?.rooms?.toString() ?? "2",
    diningHall: initialData?.diningHall ?? true,
    generator: initialData?.generator ?? false,
    imageUrl: initialData?.images[0]?.imageUrl ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      description: form.description,
      address: form.address,
      area: form.area,
      maxCapacity: Number(form.maxCapacity),
      pricePerDay: Number(form.pricePerDay),
      contactPhone: form.contactPhone,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      parking: form.parking,
      ac: form.ac,
      kitchen: form.kitchen,
      rooms: Number(form.rooms),
      diningHall: form.diningHall,
      generator: form.generator,
      images: form.imageUrl ? [form.imageUrl] : [],
    };

    try {
      const res = await fetch(
        mode === "create" ? "/api/halls" : `/api/halls/${hallId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save hall");

      toast.success(mode === "create" ? "Hall created successfully!" : "Hall updated successfully!");
      router.push("/owner");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!hallId || !confirm("Are you sure you want to delete this hall?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/halls/${hallId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to delete hall");

      toast.success("Hall deleted successfully");
      router.push("/owner");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Hall Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Area</Label>
              <Select value={form.area} onValueChange={(v) => setForm({ ...form, area: v })}>
                <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                <SelectContent>
                  {BIDAR_AREAS.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input id="contactPhone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Max Capacity</Label>
              <Input id="maxCapacity" type="number" value={form.maxCapacity} onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price per Day (₹)</Label>
              <Input id="pricePerDay" type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Cover Image URL</Label>
            <Input id="imageUrl" type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            { key: "parking" as const, label: "Parking" },
            { key: "ac" as const, label: "Air Conditioning" },
            { key: "kitchen" as const, label: "Kitchen" },
            { key: "diningHall" as const, label: "Dining Hall" },
            { key: "generator" as const, label: "Generator" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <Checkbox
                id={key}
                checked={form[key]}
                onCheckedChange={(v) => setForm({ ...form, [key]: v === true })}
              />
              <Label htmlFor={key}>{label}</Label>
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="rooms">Rooms</Label>
            <Input id="rooms" type="number" value={form.rooms} onChange={(e) => setForm({ ...form, rooms: e.target.value })} min={0} />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4">
        <Button type="submit" variant="luxury" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create Hall" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        {mode === "edit" && (
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Hall"}
          </Button>
        )}
      </div>
    </form>
  );
}
