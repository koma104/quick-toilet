/** 直線距離を歩行距離に換算する係数（道のりは直線の約1.2〜1.5倍になる想定） */
const WALKING_PATH_FACTOR = 1.35;

/** 徒歩分数を算出。引数は直線距離(m)。歩行速度は約80m/分。 */
export function walkingMinutes(meters: number): number {
  const walkingMeters = meters * WALKING_PATH_FACTOR;
  return Math.max(1, Math.round(walkingMeters / 80));
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
