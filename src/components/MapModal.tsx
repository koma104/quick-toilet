"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { Place } from "@/types/place";
import { walkingMinutes, navigationUrl, shortAddress } from "@/lib/utils";

const MapView = dynamic(() => import("./MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[200px] items-center justify-center bg-slate-100 dark:bg-slate-800">
      地図を読み込み中…
    </div>
  ),
});

type MapModalProps = {
  place: Place | null;
  open: boolean;
  onClose: () => void;
};

export function MapModal({ place, open, onClose }: MapModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && place) {
      dialog.showModal();
    } else {
      dialog.close();
    }
    return () => {
      dialog.close();
    };
  }, [open, place]);

  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  if (!place) return null;

  const walkMin = walkingMinutes(place.distance ?? 0);
  const navUrl = navigationUrl(place.latitude, place.longitude);
  const address = shortAddress(place.formattedAddress);

  return (
    <dialog
      ref={dialogRef}
      className="qt-modal border-0 bg-transparent p-0 shadow-none outline-none md:p-4"
      aria-label="トイレの詳細"
      onClick={handleDialogClick}
      onClose={onClose}
    >
      <div className="relative flex h-full max-h-[100dvh] w-full min-w-0 flex-col overflow-hidden bg-white shadow-2xl dark:bg-zinc-900 md:h-auto md:max-h-[90dvh] md:max-w-4xl md:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-[100] rounded-full border border-gray-100 bg-white/90 p-2 text-gray-500 shadow-lg transition-colors hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="閉じる"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
          <div className="relative z-0 h-[40vh] w-full shrink-0 md:h-auto md:w-3/5">
            <MapView
              latitude={place.latitude}
              longitude={place.longitude}
              title={place.displayName}
              className="h-full w-full"
            />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="flex-grow p-6 md:p-10 md:pt-16">
              <h2 className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-zinc-100 md:text-3xl">
                {place.displayName}
              </h2>
              <p className="mt-4 flex items-start gap-2 text-sm text-gray-500 dark:text-zinc-400">
                <svg className="h-5 w-5 shrink-0 text-gray-400 dark:text-zinc-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="font-medium">{address || "住所なし"}</span>
              </p>

              <div className="mb-8 mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <div className="mb-1 flex items-center gap-3">
                    <svg className="h-5 w-5 text-sky-500 dark:text-sky-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">距離</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                    {place.distance ?? 0}
                    <span className="ml-0.5 text-sm">m</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <div className="mb-1 flex items-center gap-3">
                    <svg className="h-5 w-5 text-sky-500 dark:text-sky-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">徒歩</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                    {walkMin}
                    <span className="ml-0.5 text-sm">分</span>
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">設備</p>
                <div className="flex flex-wrap gap-2">
                  {place.is24h && (
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                      24時間
                    </span>
                  )}
                  {place.wheelchairAccessibleEntrance && (
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                      アクセシブル
                    </span>
                  )}
                  {place.goodForChildren && (
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                      キッズ向け
                    </span>
                  )}
                  {!place.is24h && !place.wheelchairAccessibleEntrance && !place.goodForChildren && (
                    <span className="text-sm text-gray-400 dark:text-zinc-500">なし</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 md:p-10 md:pt-0">
              <a
                href={navUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-sky-500 py-5 font-bold text-white shadow-xl shadow-sky-100 transition-all hover:bg-sky-600 active:scale-[0.98] dark:bg-sky-600 dark:shadow-sky-900/30 dark:hover:bg-sky-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="text-lg">ナビ開始</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
