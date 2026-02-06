"use client";

import type { Place } from "@/types/place";
import { ToiletListItem } from "./ToiletListItem";

interface ToiletListProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  loading?: boolean;
  error?: string | null;
}

export function ToiletList({
  places,
  onSelectPlace,
  loading,
  error,
}: ToiletListProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700"
          />
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400">
        近くにトイレが見つかりませんでした。範囲を広げるか、別の場所でお試しください。
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {places.slice(0, 3).map((place) => (
        <ToiletListItem
          key={place.id}
          place={place}
          onSelect={onSelectPlace}
        />
      ))}
    </div>
  );
}
