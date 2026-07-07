import type {
  Role,
  AvailabilityStatus,
  BookingStatus,
} from "@prisma/client";

export type { Role, AvailabilityStatus, BookingStatus };

export interface SessionUser {
  id: string;
  supabaseId: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: Role;
}

export interface HallImageDto {
  id: string;
  imageUrl: string;
  displayOrder: number;
}

export interface HallWithDetails {
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
  images: HallImageDto[];
  availability?: { id: string; date: Date; status: AvailabilityStatus }[];
  owner?: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  };
  _count?: { favorites: number; reviews: number };
}

export interface SearchFilters {
  date?: string;
  area?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  ac?: boolean;
  parking?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DashboardStats {
  totalHalls: number;
  totalUsers: number;
  pendingHalls: number;
  pendingBookings: number;
  totalBookings: number;
  totalOwners: number;
}

export interface BookingWithDetails {
  id: string;
  hallId: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  eventType: string;
  guestCount: number;
  eventDate: Date;
  message: string | null;
  status: BookingStatus;
  createdAt: Date;
  hall: { id: string; name: string; area: string };
  customer: { id: string; fullName: string; email: string };
}

export interface ReviewWithDetails {
  id: string;
  hallId: string;
  customerId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  customer: { id: string; fullName: string };
}
