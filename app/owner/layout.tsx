import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/api/auth";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?redirect=/owner");
  if (user.role !== "OWNER" && user.role !== "ADMIN") redirect("/");

  return <>{children}</>;
}
