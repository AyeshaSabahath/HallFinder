"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  ClipboardList,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DashboardStats } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => r.json())
      .then((json) => setStats(json.data))
      .catch(() => {});
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Platform overview and management</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Building2} label="Total Halls" value={stats?.totalHalls ?? "—"} />
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? "—"} />
        <StatCard icon={Users} label="Hall Owners" value={stats?.totalOwners ?? "—"} />
        <StatCard icon={Clock} label="Pending Halls" value={stats?.pendingHalls ?? "—"} />
        <StatCard icon={CheckCircle} label="Pending Bookings" value={stats?.pendingBookings ?? "—"} />
        <StatCard icon={ClipboardList} label="Total Bookings" value={stats?.totalBookings ?? "—"} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminLinkCard title="Manage Users" description="View and manage user roles" href="/admin/users" />
        <AdminLinkCard title="Manage Listings" description="Approve or reject hall listings" href="/admin/halls" />
        <AdminLinkCard title="Booking Requests" description="View all platform bookings" href="/admin/bookings" />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminLinkCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button variant="luxury" size="sm" asChild>
          <Link href={href}>Manage</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
