"use client";

import type { Place } from "@/types/place";
import { walkingMinutes } from "@/lib/utils";

interface ToiletListItemProps {
  place: Place;
  onSelect: (place: Place) => void;
}

export function ToiletListItem({ place, onSelect }: ToiletListItemProps) {
  const distance = place.distance ?? 0;
  const walkMin = walkingMinutes(distance);

  return (
    <button
      type="button"
      onClick={() => onSelect(place)}
      className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:border-zinc-300 hover:shadow dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
    >
      <div className="font-medium text-zinc-900 dark:text-zinc-100">
        {place.displayName}
      </div>
      <div className="mt-1 flex gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <span>距離: {distance}m</span>
        <span>徒歩約{walkMin}分</span>
      </div>
      {place.formattedAddress && (
        <div className="mt-1 truncate text-xs text-zinc-400 dark:text-zinc-500">
          {place.formattedAddress}
        </div>
      )}
    </button>
  );
}
