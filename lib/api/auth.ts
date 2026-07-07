import { Role } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { UnauthorizedError, ForbiddenError } from "@/lib/api/errors";
import type { SessionUser } from "@/types";

export async function syncUserFromSupabase(
  supabaseId: string,
  email: string,
  fullName: string,
  role: Role = Role.CUSTOMER,
  phone?: string
): Promise<SessionUser> {
  const user = await prisma.user.upsert({
    where: { email },
    update: { supabaseId, fullName, phone },
    create: { supabaseId, email, fullName, role, phone },
  });

  return {
    id: user.id,
    supabaseId: user.supabaseId ?? supabaseId,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

function sessionFromMetadata(user: {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
}): SessionUser {
  const role = (user.user_metadata?.role as Role) ?? Role.CUSTOMER;
  return {
    id: user.id,
    supabaseId: user.id,
    fullName:
      (user.user_metadata?.fullName as string) ??
      (user.user_metadata?.name as string) ??
      user.email.split("@")[0],
    email: user.email,
    phone: (user.user_metadata?.phone as string) ?? null,
    role,
  };
}

export async function getAuthenticatedUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  if (!process.env.DATABASE_URL) {
    return sessionFromMetadata({ id: user.id, email: user.email, user_metadata: user.user_metadata });
  }

  try {
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
    }

    if (!dbUser) {
      const role = (user.user_metadata?.role as Role) ?? Role.CUSTOMER;
      const fullName =
        (user.user_metadata?.fullName as string) ??
        (user.user_metadata?.name as string) ??
        user.email.split("@")[0];

      dbUser = await prisma.user.create({
        data: {
          supabaseId: user.id,
          email: user.email,
          fullName,
          role,
          phone: (user.user_metadata?.phone as string) ?? null,
        },
      });
    } else if (!dbUser.supabaseId) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { supabaseId: user.id },
      });
    }

    return {
      id: dbUser.id,
      supabaseId: dbUser.supabaseId ?? user.id,
      fullName: dbUser.fullName,
      email: dbUser.email,
      phone: dbUser.phone,
      role: dbUser.role,
    };
  } catch {
    return sessionFromMetadata({ id: user.id, email: user.email, user_metadata: user.user_metadata });
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getAuthenticatedUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new ForbiddenError("You do not have permission to perform this action");
  }
  return user;
}

export async function requireOwnerOrAdmin(): Promise<SessionUser> {
  return requireRole(Role.OWNER, Role.ADMIN);
}

export async function requireAdmin(): Promise<SessionUser> {
  return requireRole(Role.ADMIN);
}
