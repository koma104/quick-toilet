export function walkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 80));
}

/** 住所を「区」以降に短縮（日本、郵便番号、東京都を除去） */
export function shortAddress(formattedAddress: string | undefined): string {
  if (!formattedAddress) return "";
  return formattedAddress
    .replace(/^日本、?\s*/, "")
    .replace(/〒\d{3}-?\d{4}\s*/, "")
    .replace(/^東京都\s*/, "")
    .trim();
}

/** ナビ開始リンク（Google Maps 優先、未設定時は Google） */
export function navigationUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
