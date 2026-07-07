import { notFound, redirect } from "next/navigation";
import { HallForm } from "@/components/owner/hall-form";
import { getHallById } from "@/services/hall-service";
import { getAuthenticatedUser } from "@/lib/api/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHallPage({ params }: PageProps) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?redirect=/owner");

  const { id } = await params;
  const hall = await getHallById(id);

  if (!hall) notFound();
  if (user.role === "OWNER" && hall.ownerId !== user.id) redirect("/owner");

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Edit Hall</h1>
      <HallForm mode="edit" hallId={id} initialData={hall} />
    </div>
  );
}
