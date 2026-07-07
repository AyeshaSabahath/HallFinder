import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HallDetailsClient } from "@/components/halls/hall-details-client";
import { getHallById, getRelatedHalls } from "@/services/hall-service";
import { getAuthenticatedUser } from "@/lib/api/auth";
import { isFavorited } from "@/services/favorite-service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const hall = await getHallById(id);
  if (!hall) return { title: "Hall Not Found" };

  return {
    title: hall.name,
    description: hall.description.slice(0, 160),
    openGraph: {
      title: hall.name,
      description: hall.description.slice(0, 160),
      images: hall.images[0]?.imageUrl ? [hall.images[0].imageUrl] : [],
    },
  };
}

export default async function HallDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const hall = await getHallById(id);

  if (!hall) notFound();

  const [relatedHalls, user] = await Promise.all([
    getRelatedHalls(hall.id, hall.area),
    getAuthenticatedUser(),
  ]);

  let favorited = false;
  if (user) {
    favorited = await isFavorited(user.id, hall.id);
  }

  return (
    <HallDetailsClient
      hall={hall}
      relatedHalls={relatedHalls}
      isFavorited={favorited}
      userId={user?.id}
      userName={user?.fullName}
      userEmail={user?.email}
    />
  );
}
