"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: "CUSTOMER" | "OWNER" | "ADMIN";
  _count: { halls: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    fetch("/api/admin?type=users")
      .then((r) => r.json())
      .then((json) => setUsers(json.data ?? []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id: string, role: "CUSTOMER" | "OWNER" | "ADMIN") => {
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id, role }),
    });

    if (res.ok) {
      toast.success(`User role updated to ${role}`);
      fetchUsers();
    } else {
      const json = await res.json();
      toast.error(json.error ?? "Failed to update user");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Manage Users</h1>

      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No users found. Run the seed script to populate data.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <Card key={u.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{u.fullName}</CardTitle>
                  <Badge>{u.role}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{u.email}</p>
                <p className="text-sm">Halls: {u._count.halls}</p>
                {u.role !== "ADMIN" && (
                  <div className="mt-4 flex gap-2">
                    {u.role !== "OWNER" && (
                      <Button size="sm" variant="luxury" onClick={() => updateRole(u.id, "OWNER")}>
                        Make Owner
                      </Button>
                    )}
                    {u.role !== "CUSTOMER" && (
                      <Button size="sm" variant="outline" onClick={() => updateRole(u.id, "CUSTOMER")}>
                        Make Customer
                      </Button>
                    )}
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
