import { NextRequest, NextResponse } from "next/server";
import type { Place } from "@/types/place";

const PLACES_API_NEARBY = "https://places.googleapis.com/v1/places:searchNearby";
const PLACES_API_SEARCH_TEXT = "https://places.googleapis.com/v1/places:searchText";
const PLACES_API_DETAILS = "https://places.googleapis.com/v1/places";

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
  const maxResults = Math.min(Number(searchParams.get("max") ?? "20") || 20, 20);

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

  type RawPlace = {
    id?: string;
    displayName?: { text?: string };
    location?: { latitude?: number; longitude?: number };
    formattedAddress?: string;
  };

  function normalizeId(id: string): string {
    return id.startsWith("places/") ? id.slice(7) : id;
  }

  function rawToPlace(list: RawPlace[]): Place[] {
    return list
      .filter(
        (p) =>
          p.id &&
          (p.displayName?.text ?? p.formattedAddress) &&
          p.location?.latitude != null &&
          p.location?.longitude != null
      )
      .map((p) => ({
        id: normalizeId(p.id!),
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
      }));
  }

  try {
    const [nearbyRes, textRes] = await Promise.all([
      fetch(PLACES_API_NEARBY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": fieldMask,
        },
        body: JSON.stringify(body),
      }),
      fetch(PLACES_API_SEARCH_TEXT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": fieldMask,
        },
        body: JSON.stringify({
          textQuery: "公衆トイレ",
          languageCode: "ja",
          pageSize: 20,
          rankPreference: "DISTANCE",
          locationBias: {
            circle: {
              center: { latitude, longitude },
              radius: radiusMeters,
            },
          },
        }),
      }),
    ]);

    if (!nearbyRes.ok) {
      const text = await nearbyRes.text();
      console.error("Places API searchNearby error:", nearbyRes.status, text);
      return NextResponse.json(
        { error: "Places API request failed", details: text },
        { status: nearbyRes.status === 400 ? 400 : 502 }
      );
    }

    const nearbyData = (await nearbyRes.json()) as { places?: RawPlace[] };
    const nearbyPlaces = rawToPlace(nearbyData.places ?? []);

    let textPlaces: Place[] = [];
    if (textRes.ok) {
      const textData = (await textRes.json()) as { places?: RawPlace[] };
      textPlaces = rawToPlace(textData.places ?? []);
    }

    const byId = new Map<string, Place>();
    for (const p of nearbyPlaces) byId.set(p.id, p);
    for (const p of textPlaces) {
      if (!byId.has(p.id)) byId.set(p.id, p);
    }

    let places = Array.from(byId.values())
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
      .slice(0, maxResults);

    const detailsFieldMask = [
      "regularOpeningHours",
      "accessibilityOptions",
      "goodForChildren",
    ].join(",");

    const top3 = places.slice(0, 3);
    const detailsResults = await Promise.all(
      top3.map((place) =>
        fetch(
          `${PLACES_API_DETAILS}/${encodeURIComponent(place.id)}?languageCode=ja`,
          {
            headers: {
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask": detailsFieldMask,
            },
          }
        )
      )
    );

    type OpeningPeriod = {
      open?: { day?: number; hour?: number; minute?: number };
      close?: { day?: number; hour?: number; minute?: number };
    };
    type DetailsResponse = {
      regularOpeningHours?: { periods?: OpeningPeriod[] };
      accessibilityOptions?: {
        wheelchairAccessibleEntrance?: string | boolean;
      };
      goodForChildren?: boolean;
    };

    function is24h(details: DetailsResponse): boolean {
      const periods = details.regularOpeningHours?.periods;
      if (!periods?.length) return false;
      const has24hPeriod = periods.some(
        (p) =>
          p.open?.day === 0 &&
          p.open?.hour === 0 &&
          p.open?.minute === 0 &&
          p.close == null
      );
      return has24hPeriod;
    }

    function isWheelchairAccessible(details: DetailsResponse): boolean {
      const v = details.accessibilityOptions?.wheelchairAccessibleEntrance;
      if (v === true || v === "TRUE") return true;
      return false;
    }

    const detailsList = await Promise.all(
      detailsResults.map(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as DetailsResponse;
      })
    );

    places = places.map((p, i) => {
      if (i >= 3) return p;
      const details = detailsList[i];
      if (!details) return p;
      return {
        ...p,
        is24h: is24h(details),
        wheelchairAccessibleEntrance: isWheelchairAccessible(details),
        goodForChildren: details.goodForChildren === true,
      };
    });

    return NextResponse.json({ places });
  } catch (e) {
    console.error("Nearby API error:", e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
