import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { NotFoundError, ForbiddenError } from "@/lib/api/errors";
import type { HallWithDetails, SearchFilters, PaginatedResult } from "@/types";
import type { HallCreateInput, HallUpdateInput } from "@/lib/validations/hall";
import { Role, AvailabilityStatus } from "@prisma/client";

const hallInclude = {
  images: { orderBy: { displayOrder: "asc" as const } },
  owner: {
    select: { id: true, fullName: true, email: true, phone: true },
  },
};

type HallRecord = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  pricePerDay: number;
  maxCapacity: number;
  minCapacity: number;
  parking: boolean;
  ac: boolean;
  diningHall: boolean;
  rooms: number;
  kitchen: boolean;
  generator: boolean;
  contactPhone: string;
  featured: boolean;
  approved: boolean;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
  images: { id: string; imageUrl: string; displayOrder: number }[];
  owner?: { id: string; fullName: string; email: string; phone: string | null };
  availability?: { id: string; date: Date; status: AvailabilityStatus }[];
};

function mapHall(hall: HallRecord): HallWithDetails {
  return { ...hall };
}

async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.hall.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${counter++}`;
  }

  return slug;
}

export async function searchHalls(
  filters: SearchFilters
): Promise<PaginatedResult<HallWithDetails>> {
  try {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;

  const where: Record<string, unknown> = { approved: true };

  if (filters.area) where.area = filters.area;
  if (filters.guests) where.maxCapacity = { gte: filters.guests };
  if (filters.minCapacity) where.maxCapacity = { gte: filters.minCapacity };
  if (filters.minPrice || filters.maxPrice) {
    where.pricePerDay = {
      ...(filters.minPrice ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.ac) where.ac = true;
  if (filters.parking) where.parking = true;

  if (filters.date) {
    const unavailable = await prisma.availability.findMany({
      where: {
        date: new Date(filters.date),
        status: {
          in: [AvailabilityStatus.BOOKED, AvailabilityStatus.MAINTENANCE],
        },
      },
      select: { hallId: true },
    });
    const excludeIds = unavailable.map((a) => a.hallId);
    if (excludeIds.length > 0) {
      where.id = { notIn: excludeIds };
    }
  }

  const [halls, total] = await Promise.all([
    prisma.hall.findMany({
      where,
      include: hallInclude,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { rating: "desc" },
    }),
    prisma.hall.count({ where }),
  ]);

  return {
    data: halls.map(mapHall),
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
  } catch {
    return { data: [], total: 0, page: 1, totalPages: 1 };
  }
}

export async function getHallById(id: string): Promise<HallWithDetails | null> {
  try {
  const hall = await prisma.hall.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      ...hallInclude,
      availability: {
        where: {
          date: {
            gte: new Date(),
            lte: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { date: "asc" },
      },
    },
  });

  return hall ? mapHall(hall) : null;
  } catch {
    return null;
  }
}

export async function getFeaturedHalls(): Promise<HallWithDetails[]> {
  try {
  const halls = await prisma.hall.findMany({
    where: { approved: true, featured: true },
    include: hallInclude,
    take: 6,
    orderBy: { rating: "desc" },
  });
  return halls.map(mapHall);
  } catch {
    return [];
  }
}

export async function getPopularHalls(): Promise<HallWithDetails[]> {
  try {
  const halls = await prisma.hall.findMany({
    where: { approved: true },
    include: hallInclude,
    take: 6,
    orderBy: { rating: "desc" },
  });
  return halls.map(mapHall);
  } catch {
    return [];
  }
}

export async function getRelatedHalls(
  hallId: string,
  area: string
): Promise<HallWithDetails[]> {
  try {
    const halls = await prisma.hall.findMany({
      where: { approved: true, area, id: { not: hallId } },
      include: hallInclude,
      take: 3,
      orderBy: { rating: "desc" },
    });
    return halls.map(mapHall);
  } catch {
    return [];
  }
}

export async function createHall(
  ownerId: string,
  data: HallCreateInput,
  isAdmin = false
) {
  const slug = await generateUniqueSlug(data.name);

  return prisma.hall.create({
    data: {
      ownerId,
      slug,
      name: data.name,
      description: data.description,
      address: data.address,
      area: data.area,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      latitude: data.latitude,
      longitude: data.longitude,
      pricePerDay: data.pricePerDay,
      maxCapacity: data.maxCapacity,
      minCapacity: data.minCapacity,
      parking: data.parking,
      ac: data.ac,
      diningHall: data.diningHall,
      rooms: data.rooms,
      kitchen: data.kitchen,
      generator: data.generator,
      contactPhone: data.contactPhone,
      featured: data.featured ?? false,
      approved: isAdmin ? (data.approved ?? true) : false,
      images: {
        create: (data.images ?? []).map((url, i) => ({
          imageUrl: url,
          displayOrder: i,
        })),
      },
    },
    include: hallInclude,
  });
}

export async function updateHall(
  hallId: string,
  userId: string,
  userRole: Role,
  data: HallUpdateInput
) {
  const hall = await prisma.hall.findUnique({ where: { id: hallId } });
  if (!hall) throw new NotFoundError("Hall not found");

  if (userRole !== Role.ADMIN && hall.ownerId !== userId) {
    throw new ForbiddenError("You can only edit your own halls");
  }

  const { images, ...updateData } = data;
  const slug = data.name ? await generateUniqueSlug(data.name, hallId) : undefined;

  const updated = await prisma.hall.update({
    where: { id: hallId },
    data: {
      ...updateData,
      ...(slug ? { slug } : {}),
      ...(images
        ? {
            images: {
              deleteMany: {},
              create: images.map((url, i) => ({
                imageUrl: url,
                displayOrder: i,
              })),
            },
          }
        : {}),
    },
    include: hallInclude,
  });

  return mapHall(updated);
}

export async function deleteHall(
  hallId: string,
  userId: string,
  userRole: Role
) {
  const hall = await prisma.hall.findUnique({ where: { id: hallId } });
  if (!hall) throw new NotFoundError("Hall not found");

  if (userRole !== Role.ADMIN && hall.ownerId !== userId) {
    throw new ForbiddenError("You can only delete your own halls");
  }

  await prisma.hall.delete({ where: { id: hallId } });
}

export async function getOwnerHalls(ownerId: string): Promise<HallWithDetails[]> {
  try {
  const halls = await prisma.hall.findMany({
    where: { ownerId },
    include: hallInclude,
    orderBy: { createdAt: "desc" },
  });
  return halls.map(mapHall);
  } catch {
    return [];
  }
}

export async function getAllHalls(): Promise<HallWithDetails[]> {
  try {
    const halls = await prisma.hall.findMany({
      include: hallInclude,
      orderBy: { createdAt: "desc" },
    });
    return halls.map(mapHall);
  } catch {
    return [];
  }
}

export async function verifyHallOwnership(
  hallId: string,
  userId: string,
  userRole: Role
) {
  const hall = await prisma.hall.findUnique({ where: { id: hallId } });
  if (!hall) throw new NotFoundError("Hall not found");
  if (userRole !== Role.ADMIN && hall.ownerId !== userId) {
    throw new ForbiddenError("You can only manage your own halls");
  }
  return hall;
}
