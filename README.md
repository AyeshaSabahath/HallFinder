# HallFinder

A production-ready function hall booking platform for **Bidar, Karnataka**.

## Phase 2 — Backend, Database, Auth & APIs

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind, shadcn/ui |
| Backend | Next.js API Routes, Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth with role-based access |
| Validation | Zod |

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 4. Seed the database

```bash
npx prisma db seed
```

This creates:
- 1 Admin (`admin@hallfinder.in`)
- 5 Hall Owners (`owner1@hallfinder.in` – `owner5@hallfinder.in`)
- 1 Demo Customer (`customer@hallfinder.in`)
- 15 function halls across Bidar with 6-month availability calendars

### 5. Start development server

```bash
npm run dev
```

---

## Database Schema

| Model | Key Fields |
|-------|-----------|
| **User** | fullName, email, phone, role (CUSTOMER/OWNER/ADMIN) |
| **Hall** | slug, amenities (flat), pricePerDay, maxCapacity, approved, rating |
| **HallImage** | imageUrl, displayOrder |
| **Availability** | date, status (AVAILABLE/BOOKED/MAINTENANCE) |
| **BookingRequest** | customerName, eventDate, guestCount, status |
| **Review** | rating, comment |
| **Favorite** | userId, hallId |

---

## API Routes

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Update password |

### Halls

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/halls` | Public | Search halls with filters |
| GET | `/api/halls/:id` | Public | Get hall by ID or slug |
| POST | `/api/halls` | Owner/Admin | Create hall |
| PUT | `/api/halls/:id` | Owner/Admin | Update hall (owner: own only) |
| DELETE | `/api/halls/:id` | Owner/Admin | Delete hall (owner: own only) |

### Availability

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/availability?hallId=` | Public | Get availability |
| POST | `/api/availability` | Owner/Admin | Set date status |
| PUT | `/api/availability` | Owner/Admin | Update status |
| DELETE | `/api/availability?id=` | Owner/Admin | Delete entry |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/booking` | Auth | List bookings (role-filtered) |
| POST | `/api/booking` | Customer | Submit booking request |
| PUT | `/api/booking/:id` | Owner/Admin | Update status (auto-updates availability) |
| DELETE | `/api/booking/:id` | Auth | Delete booking |

### Favorites & Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET/POST/DELETE | `/api/favorites` | Customer | Manage favorites |
| GET/POST | `/api/reviews` | Public/Customer | List and create reviews |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin` | Dashboard stats |
| GET | `/api/admin?type=users` | List users |
| GET | `/api/admin?type=halls` | List all halls |
| PATCH | `/api/admin` | Approve halls, update user roles |

---

## Architecture

```
lib/
├── api/
│   ├── auth.ts        # Auth helpers (requireAuth, requireRole)
│   ├── errors.ts      # ApiError classes
│   └── response.ts    # Centralized JSON responses
├── validations/       # Zod schemas per domain
└── supabase/          # Supabase SSR clients

services/
├── hall-service.ts
├── booking-service.ts
├── availability-service.ts
├── favorite-service.ts
├── review-service.ts
└── admin-service.ts
```

---

## Security

- **Middleware** protects `/owner`, `/admin`, `/profile`, `/favorites` routes
- **Role-based authorization** on all write APIs
- **Owners** can only manage their own halls
- **Customers** cannot access admin endpoints
- **Zod validation** on every request body
- **Consistent error responses**: `{ success, error, details }`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npx prisma migrate dev` | Run migrations |
| `npx prisma db seed` | Seed database |
| `npx prisma studio` | Database GUI |

## License

MIT
