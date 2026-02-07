"use client";

import type { Place } from "@/types/place";
import { walkingMinutes, shortAddress } from "@/lib/utils";

type ToiletListItemProps = {
  place: Place;
  onSelect: (place: Place) => void;
};

export function ToiletListItem({ place, onSelect }: ToiletListItemProps) {
  const distance = place.distance ?? 0;
  const walkMin = walkingMinutes(distance);
  const address = shortAddress(place.formattedAddress);

  return (
    <button
      type="button"
      onClick={() => onSelect(place)}
      className="w-full rounded-2xl border border-slate-50 bg-white p-4 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] transition-transform active:scale-[0.98] hover:border-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-slate-700"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold leading-snug text-slate-800 dark:text-slate-100">
          {place.displayName}
        </h3>
        <div className="flex shrink-0 items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
          <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
          </svg>
          <span className="text-xs font-bold">{walkMin}分</span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <svg className="h-5 w-5 text-sky-400 dark:text-sky-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="text-sm font-medium">{distance}m</span>
        </div>
        <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden />
        <span className="min-w-0 truncate text-sm">{address || "住所なし"}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {/* タグ表示エリア（APIで取得できる情報があれば後で表示） */}
      </div>
    </button>
  );
}
