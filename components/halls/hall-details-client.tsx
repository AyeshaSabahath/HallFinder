"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Users,
  Star,
  Phone,
  Car,
  Wind,
  Utensils,
  Bed,
  Zap,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HallCard } from "@/components/halls/hall-card";
import { AvailabilityCalendar } from "@/components/halls/availability-calendar";
import { BookingDialog } from "@/components/halls/booking-dialog";
import { FavoriteButton } from "@/components/halls/favorite-button";
import { GoogleMap } from "@/components/maps/google-map";
import { formatPrice, getWhatsAppLink } from "@/lib/utils";
import type { HallWithDetails } from "@/types";

interface HallDetailsClientProps {
  hall: HallWithDetails;
  relatedHalls: HallWithDetails[];
  isFavorited?: boolean;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export function HallDetailsClient({
  hall,
  relatedHalls,
  isFavorited = false,
  userId,
  userName,
  userEmail,
}: HallDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  const images = hall.images.length > 0 ? hall.images : [{ imageUrl: "https://placehold.co/800x600", id: "0", displayOrder: 0 }];

  const whatsappMessage = `Hi, I'm interested in booking ${hall.name} for an event. Could you please share more details?`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={images[selectedImage]?.imageUrl ?? images[0].imageUrl}
                alt={hall.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === i
                        ? "border-emerald-600 ring-2 ring-emerald-600/30"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={`${hall.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold md:text-4xl">
                  {hall.name}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {hall.address}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FavoriteButton
                  hallId={hall.id}
                  initialFavorited={isFavorited}
                  userId={userId}
                />
                <Badge variant="gold" className="text-sm">
                  <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                  {hall.rating.toFixed(1)}
                </Badge>
              </div>
            </div>

            <p className="mt-6 text-muted-foreground leading-relaxed">
              {hall.description}
            </p>
          </div>

          {/* Amenities */}
          <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <AmenityItem icon={Users} label="Capacity" value={`${hall.maxCapacity} guests`} />
                  <AmenityItem icon={Car} label="Parking" value={hall.parking ? "Available" : "Not Available"} active={hall.parking} />
                  <AmenityItem icon={Wind} label="AC" value={hall.ac ? "Available" : "Not Available"} active={hall.ac} />
                  <AmenityItem icon={Utensils} label="Kitchen" value={hall.kitchen ? "Available" : "Not Available"} active={hall.kitchen} />
                  <AmenityItem icon={Bed} label="Rooms" value={`${hall.rooms} rooms`} active={hall.rooms > 0} />
                  <AmenityItem icon={Building} label="Dining Hall" value={hall.diningHall ? "Available" : "Not Available"} active={hall.diningHall} />
                  <AmenityItem icon={Zap} label="Generator" value={hall.generator ? "Available" : "Not Available"} active={hall.generator} />
                </div>
              </CardContent>
            </Card>

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <GoogleMap
                latitude={hall.latitude}
                longitude={hall.longitude}
                name={hall.name}
              />
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <AvailabilityCalendar availability={hall.availability ?? []} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-20 border-emerald-100 shadow-lg dark:border-emerald-900">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Starting from</div>
                <div className="font-display text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                  {formatPrice(hall.pricePerDay)}
                </div>
                <div className="text-sm text-muted-foreground">per event</div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  variant="luxury"
                  size="lg"
                  className="w-full"
                  onClick={() => setBookingOpen(true)}
                >
                  Book Now
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href={`tel:+91${hall.contactPhone}`}>
                    <Phone className="h-4 w-4" />
                    {hall.contactPhone}
                  </a>
                </Button>
                <Button
                  variant="gold"
                  className="w-full"
                  asChild
                >
                  <a
                    href={getWhatsAppLink(hall.contactPhone, whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related */}
      {relatedHalls.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-6">
            Related Halls in {hall.area}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedHalls.map((h, i) => (
              <HallCard key={h.id} hall={h} index={i} />
            ))}
          </div>
        </section>
      )}

      <BookingDialog
        hall={hall}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        userId={userId}
        userName={userName}
        userEmail={userEmail}
      />
    </div>
  );
}

function AmenityItem({
  icon: Icon,
  label,
  value,
  active = true,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-lg p-3 ${active ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-muted/50"}`}>
      <Icon className={`h-5 w-5 ${active ? "text-emerald-600" : "text-muted-foreground"}`} />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
