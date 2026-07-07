import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/api/auth";
import { ProfilePageClient } from "@/components/profile/profile-page-client";

export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  return <ProfilePageClient user={user} />;
}
