import { PrismaClient, Role, AvailabilityStatus } from "@prisma/client";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();

const unsplash = (id: number) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80`;

interface HallSeedData {
  name: string;
  area: string;
  maxCapacity: number;
  pricePerDay: number;
  rating: number;
  description: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  imageIds: number[];
  parking: boolean;
  ac: boolean;
  kitchen: boolean;
  rooms: number;
  diningHall: boolean;
  generator: boolean;
  featured?: boolean;
}

const HALLS: HallSeedData[] = [
  { name: "Royal Emerald Banquet Hall", area: "Gandhi Gunj", maxCapacity: 800, pricePerDay: 85000, rating: 4.8, description: "A premium banquet hall in the heart of Bidar featuring crystal chandeliers, marble flooring, and state-of-the-art sound systems.", address: "Near Gandhi Gunj Circle, Bidar 585401", lat: 17.9134, lng: 77.5301, phone: "9876543210", imageIds: [1519165217289, 1464366986405, 1519225427798], parking: true, ac: true, kitchen: true, rooms: 4, diningHall: true, generator: true, featured: true },
  { name: "Golden Palace Function Hall", area: "Station Road", maxCapacity: 600, pricePerDay: 65000, rating: 4.6, description: "Elegant function hall with golden-themed interiors and spacious dining area near Bidar Railway Station.", address: "Station Road, Bidar 585401", lat: 17.9189, lng: 77.5245, phone: "9876543211", imageIds: [1519741649411, 1470225627, 1465497421174], parking: true, ac: true, kitchen: true, rooms: 2, diningHall: true, generator: true, featured: true },
  { name: "Shah Gunj Convention Center", area: "Shah Gunj", maxCapacity: 1200, pricePerDay: 120000, rating: 4.9, description: "The largest convention center in Bidar with modular seating and professional stage lighting.", address: "Shah Gunj Main Road, Bidar 585401", lat: 17.9102, lng: 77.5318, phone: "9876543212", imageIds: [1540575466447, 1511795409207, 1469376288102], parking: true, ac: true, kitchen: true, rooms: 6, diningHall: true, generator: true, featured: true },
  { name: "Naubad Garden Hall", area: "Naubad", maxCapacity: 500, pricePerDay: 45000, rating: 4.4, description: "Beautiful garden-themed hall with outdoor lawn space for ceremonies.", address: "Naubad Colony, Bidar 585402", lat: 17.9056, lng: 77.5189, phone: "9876543213", imageIds: [1464366986405, 1519225427798, 1519165217289], parking: true, ac: false, kitchen: true, rooms: 1, diningHall: true, generator: true },
  { name: "Mailoor Heritage Hall", area: "Mailoor Road", maxCapacity: 700, pricePerDay: 75000, rating: 4.7, description: "Heritage-style architecture blending traditional Bidar craftsmanship with modern amenities.", address: "Mailoor Road, Bidar 585403", lat: 17.9201, lng: 77.5423, phone: "9876543214", imageIds: [1470225627, 1519741649411, 1465497421174], parking: true, ac: true, kitchen: true, rooms: 3, diningHall: true, generator: false },
  { name: "Cantonment Elite Hall", area: "Cantonment", maxCapacity: 400, pricePerDay: 55000, rating: 4.5, description: "Upscale hall in the Cantonment area with military heritage charm.", address: "Cantonment Area, Bidar 585401", lat: 17.9289, lng: 77.5156, phone: "9876543215", imageIds: [1511795409207, 1540575466447, 1469376288102], parking: true, ac: true, kitchen: false, rooms: 2, diningHall: true, generator: true },
  { name: "Humnabad Road Grand Hall", area: "Humnabad Road", maxCapacity: 900, pricePerDay: 95000, rating: 4.6, description: "Spacious grand hall with high ceilings and panoramic windows.", address: "Humnabad Road, Bidar 585401", lat: 17.8987, lng: 77.5267, phone: "9876543216", imageIds: [1465497421174, 1519165217289, 1519225427798], parking: true, ac: true, kitchen: true, rooms: 4, diningHall: true, generator: true },
  { name: "Chidri Road Celebration Hall", area: "Chidri Road", maxCapacity: 550, pricePerDay: 50000, rating: 4.3, description: "Affordable yet elegant celebration hall popular among local families.", address: "Chidri Road, Bidar 585401", lat: 17.9123, lng: 77.5089, phone: "9876543217", imageIds: [1519225427798, 1464366986405, 1470225627], parking: true, ac: true, kitchen: true, rooms: 1, diningHall: true, generator: false },
  { name: "Old City Royal Mandap", area: "Old City", maxCapacity: 650, pricePerDay: 70000, rating: 4.7, description: "Traditional mandap setup in Bidar's historic Old City.", address: "Old City Market, Bidar 585401", lat: 17.9156, lng: 77.5334, phone: "9876543218", imageIds: [1469376288102, 1511795409207, 1540575466447], parking: false, ac: true, kitchen: true, rooms: 2, diningHall: true, generator: true },
  { name: "Udgir Road Paradise Hall", area: "Udgir Road", maxCapacity: 750, pricePerDay: 80000, rating: 4.5, description: "Modern paradise-themed hall with LED backdrop walls and premium AV equipment.", address: "Udgir Road, Bidar 585401", lat: 17.9012, lng: 77.5512, phone: "9876543219", imageIds: [1519741649411, 1465497421174, 1519165217289], parking: true, ac: true, kitchen: true, rooms: 3, diningHall: true, generator: true },
  { name: "Gandhi Gunj Crystal Hall", area: "Gandhi Gunj", maxCapacity: 450, pricePerDay: 48000, rating: 4.2, description: "Crystal-themed intimate hall ideal for engagement parties and birthdays.", address: "Gandhi Gunj Extension, Bidar 585401", lat: 17.9145, lng: 77.5298, phone: "9876543220", imageIds: [1470225627, 1519225427798, 1464366986405], parking: true, ac: true, kitchen: true, rooms: 1, diningHall: false, generator: false },
  { name: "Station Road Platinum Hall", area: "Station Road", maxCapacity: 1000, pricePerDay: 110000, rating: 4.8, description: "Platinum-tier venue with international standard facilities.", address: "Near Bidar Railway Station, Bidar 585401", lat: 17.9195, lng: 77.5234, phone: "9876543221", imageIds: [1540575466447, 1469376288102, 1511795409207], parking: true, ac: true, kitchen: true, rooms: 5, diningHall: true, generator: true, featured: true },
  { name: "Naubad Community Hall", area: "Naubad", maxCapacity: 350, pricePerDay: 35000, rating: 4.1, description: "Community-focused hall perfect for small gatherings and religious functions.", address: "Naubad Main Street, Bidar 585402", lat: 17.9045, lng: 77.5178, phone: "9876543222", imageIds: [1464366986405, 1519741649411, 1465497421174], parking: true, ac: false, kitchen: true, rooms: 0, diningHall: true, generator: false },
  { name: "Shah Gunj Pearl Banquet", area: "Shah Gunj", maxCapacity: 850, pricePerDay: 90000, rating: 4.6, description: "Pearl-white themed banquet with luxurious drapes and floral arrangements.", address: "Shah Gunj Commercial Complex, Bidar 585401", lat: 17.9112, lng: 77.5325, phone: "9876543223", imageIds: [1519165217289, 1540575466447, 1519225427798], parking: true, ac: true, kitchen: true, rooms: 4, diningHall: true, generator: true },
  { name: "Mailoor Road Sapphire Hall", area: "Mailoor Road", maxCapacity: 600, pricePerDay: 62000, rating: 4.4, description: "Sapphire blue themed contemporary hall with smart climate control.", address: "Mailoor Industrial Area, Bidar 585403", lat: 17.9215, lng: 77.5445, phone: "9876543224", imageIds: [1511795409207, 1470225627, 1469376288102], parking: true, ac: true, kitchen: true, rooms: 2, diningHall: true, generator: true },
];

function generateAvailability(hallIndex: number) {
  const records: { date: Date; status: AvailabilityStatus }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 180; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;

    let status: AvailabilityStatus = AvailabilityStatus.AVAILABLE;
    if (isWeekend && (hallIndex + i) % 3 !== 0) {
      status = AvailabilityStatus.BOOKED;
    } else if (i % 17 === 0) {
      status = AvailabilityStatus.MAINTENANCE;
    } else if ((hallIndex + i) % 7 === 0) {
      status = AvailabilityStatus.BOOKED;
    }

    records.push({ date, status });
  }

  return records;
}

async function main() {
  console.log("Seeding HallFinder database...\n");

  await prisma.review.deleteMany();
  await prisma.bookingRequest.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.hallImage.deleteMany();
  await prisma.hall.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      supabaseId: "seed-admin-001",
      fullName: "Admin User",
      email: "admin@hallfinder.in",
      phone: "9876500000",
      role: Role.ADMIN,
    },
  });
  console.log(`Admin: ${admin.email}`);

  const owners = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.user.create({
        data: {
          supabaseId: `seed-owner-00${i + 1}`,
          fullName: `Hall Owner ${i + 1}`,
          email: `owner${i + 1}@hallfinder.in`,
          phone: `987654322${i}`,
          role: Role.OWNER,
        },
      })
    )
  );
  owners.forEach((o) => console.log(`Owner: ${o.email}`));

  const customer = await prisma.user.create({
    data: {
      supabaseId: "seed-customer-001",
      fullName: "Demo Customer",
      email: "customer@hallfinder.in",
      phone: "9876543299",
      role: Role.CUSTOMER,
    },
  });
  console.log(`Customer: ${customer.email}\n`);

  for (let i = 0; i < HALLS.length; i++) {
    const h = HALLS[i];
    const owner = owners[i % owners.length];
    const slug = slugify(h.name);

    const hall = await prisma.hall.create({
      data: {
        ownerId: owner.id,
        name: h.name,
        slug,
        description: h.description,
        address: h.address,
        area: h.area,
        latitude: h.lat,
        longitude: h.lng,
        pricePerDay: h.pricePerDay,
        maxCapacity: h.maxCapacity,
        minCapacity: 50,
        parking: h.parking,
        ac: h.ac,
        kitchen: h.kitchen,
        rooms: h.rooms,
        diningHall: h.diningHall,
        generator: h.generator,
        contactPhone: h.phone,
        featured: h.featured ?? false,
        approved: true,
        rating: h.rating,
        totalReviews: Math.floor(Math.random() * 50) + 10,
        images: {
          create: h.imageIds.map((imgId, idx) => ({
            imageUrl: unsplash(imgId),
            displayOrder: idx,
          })),
        },
        availability: {
          create: generateAvailability(i),
        },
      },
    });

    console.log(`  Hall: ${hall.name}`);
  }

  console.log(`\nSeeded ${HALLS.length} halls, ${owners.length} owners, 1 admin, 1 customer`);
  console.log("Availability calendars generated for 6 months with realistic booked dates.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
