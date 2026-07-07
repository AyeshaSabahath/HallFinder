import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/api/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?redirect=/admin");
  if (user.role !== "ADMIN") redirect("/");

  return <>{children}</>;
}
