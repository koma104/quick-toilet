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
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-white dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
        近くにトイレが見つかりませんでした。範囲を広げるか、別の場所でお試しください。
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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
