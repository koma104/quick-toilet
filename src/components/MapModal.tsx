"use client";

import dynamic from "next/dynamic";
import type { Place } from "@/types/place";
import { walkingMinutes, navigationUrl } from "@/lib/utils";

const MapView = dynamic(() => import("./MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[200px] items-center justify-center bg-zinc-100 dark:bg-zinc-800">
      地図を読み込み中…
    </div>
  ),
});

interface MapModalProps {
  place: Place | null;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function MapModal({ place, open, onClose, onRefresh }: MapModalProps) {
  if (!open || !place) return null;

  const walkMin = walkingMinutes(place.distance ?? 0);
  const navUrl = navigationUrl(place.latitude, place.longitude);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-900"
      role="dialog"
      aria-modal="true"
      aria-label="トイレの地図"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
        <div className="min-w-0 flex-1 pr-4">
          <h2 className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
            {place.displayName}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            徒歩約{walkMin}分 · {place.distance}m
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          aria-label="閉じる"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="min-h-[40vh] min-w-0 flex-1">
        <MapView
          latitude={place.latitude}
          longitude={place.longitude}
          title={place.displayName}
          className="h-full w-full"
        />
      </div>

      <div className="flex shrink-0 flex-col gap-2 border-t border-zinc-200 p-4 dark:border-zinc-700">
        <a
          href={navUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
        >
          <span>ナビ開始</span>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-xl border border-zinc-300 py-3 font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          一覧を更新
        </button>
      </div>
    </div>
  );
}
