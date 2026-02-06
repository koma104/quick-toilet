import { NextRequest, NextResponse } from "next/server";
import type { Place } from "@/types/place";

const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchNearby";

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_PLACES_API_KEY is not set" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") ?? "2000";
  const maxResults = Math.min(Number(searchParams.get("max") ?? "10") || 10, 20);

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "lat and lng are required" },
      { status: 400 }
    );
  }

  const latitude = Number(lat);
  const longitude = Number(lng);
  const radiusMeters = Math.min(Number(radius) || 2000, 50000);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { error: "Invalid lat or lng" },
      { status: 400 }
    );
  }

  const body = {
    includedTypes: ["public_bathroom"],
    locationRestriction: {
      circle: {
        center: { latitude, longitude },
        radius: radiusMeters,
      },
    },
    maxResultCount: maxResults,
    languageCode: "ja",
  };

  const fieldMask = [
    "places.id",
    "places.displayName",
    "places.location",
    "places.formattedAddress",
  ].join(",");

  try {
    const res = await fetch(PLACES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Places API error:", res.status, text);
      return NextResponse.json(
        { error: "Places API request failed", details: text },
        { status: res.status === 400 ? 400 : 502 }
      );
    }

    const data = (await res.json()) as {
      places?: Array<{
        id?: string;
        displayName?: { text?: string };
        location?: { latitude?: number; longitude?: number };
        formattedAddress?: string;
      }>;
    };

    const rawPlaces = data.places ?? [];
    const places: Place[] = rawPlaces
      .filter(
        (p) =>
          p.id &&
          (p.displayName?.text ?? p.formattedAddress) &&
          p.location?.latitude != null &&
          p.location?.longitude != null
      )
      .map((p) => {
        const place: Place = {
          id: p.id!,
          displayName: p.displayName?.text ?? p.formattedAddress ?? "不明",
          latitude: p.location!.latitude!,
          longitude: p.location!.longitude!,
          formattedAddress: p.formattedAddress,
          distance: haversineDistance(
            latitude,
            longitude,
            p.location!.latitude!,
            p.location!.longitude!
          ),
        };
        return place;
      })
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
      .slice(0, maxResults);

    return NextResponse.json({ places });
  } catch (e) {
    console.error("Nearby API error:", e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
