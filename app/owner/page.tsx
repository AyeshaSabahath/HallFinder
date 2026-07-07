import Link from "next/link";
import {
  Building2,
  Calendar,
  ClipboardList,
  Plus,
  Settings,
} from "lucide-react";
import { getAuthenticatedUser } from "@/lib/api/auth";
import { getOwnerHalls } from "@/services/hall-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export default async function OwnerDashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const halls = await getOwnerHalls(user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your halls and bookings</p>
        </div>
        <Button variant="luxury" asChild>
          <Link href="/owner/halls/new">
            <Plus className="h-4 w-4" />
            Add Hall
          </Link>
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Building2} label="Total Halls" value={halls.length} />
        <StatCard icon={ClipboardList} label="Active Listings" value={halls.filter((h) => h.approved).length} />
        <StatCard icon={Calendar} label="Manage Calendar" value="—" href="/owner/bookings" />
        <StatCard icon={Settings} label="Bookings" value="View" href="/owner/bookings" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Halls</CardTitle>
        </CardHeader>
        <CardContent>
          {halls.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No halls listed yet.</p>
              <Button variant="luxury" className="mt-4" asChild>
                <Link href="/owner/halls/new">Add Your First Hall</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {halls.map((hall) => (
                <div
                  key={hall.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{hall.name}</h3>
                      <Badge variant={hall.approved ? "success" : "warning"}>
                        {hall.approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {hall.area} · {hall.maxCapacity} guests · {formatPrice(hall.pricePerDay)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/owner/halls/${hall.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/owner/halls/${hall.id}/calendar`}>Calendar</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  href?: string;
}) {
  const content = (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
