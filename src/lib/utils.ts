export function walkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 80));
}

export function navigationUrl(lat: number, lng: number): string {
  if (typeof window !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
    return `https://maps.apple.com/?daddr=${lat},${lng}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
