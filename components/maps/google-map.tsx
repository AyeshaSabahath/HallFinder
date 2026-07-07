"use client";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export function GoogleMap({ latitude, longitude, name }: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl bg-muted">
        <div className="text-center text-muted-foreground">
          <p className="font-medium">{name}</p>
          <p className="text-sm mt-1">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-emerald-600 hover:underline"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    );
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`;

  return (
    <iframe
      title={`Map showing location of ${name}`}
      src={src}
      className="h-[300px] w-full rounded-xl border-0"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
