"use client";

import { useCallback, useEffect, useState } from "react";
import type { Place } from "@/types/place";
import { ToiletList } from "@/components/ToiletList";
import { MapModal } from "@/components/MapModal";

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const fetchNearby = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/nearby?lat=${lat}&lng=${lng}&radius=2000&max=20`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "検索に失敗しました");
      setPlaces(data.places ?? []);
      setUserLocation({ lat, lng });
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("お使いのブラウザは位置情報に対応していません。");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchNearby(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setError("現在地を取得できませんでした。位置情報の利用を許可してください。");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [fetchNearby]);

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlace(null);
  };

  const handleRefresh = () => {
    if (userLocation) {
      setModalOpen(false);
      setSelectedPlace(null);
      fetchNearby(userLocation.lat, userLocation.lng);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-off-white)] dark:bg-zinc-950 pb-24">
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-md items-center gap-2 px-5 py-4">
          <img
            src="/icon.svg"
            alt=""
            className="h-8 w-8 rounded-lg shadow-sm"
            width={32}
            height={32}
            aria-hidden
          />
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            QT
          </h1>
        </div>
      </header>

      <main className="w-full px-5 py-6 md:mx-auto md:max-w-md">
        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            トイレを選ぶと地図とナビを開きます。
          </p>
        </div>
        <ToiletList
          places={places}
          onSelectPlace={handleSelectPlace}
          loading={loading}
          error={error}
        />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--bg-off-white)] via-[var(--bg-off-white)] to-transparent pt-6 pb-5 pointer-events-none dark:from-zinc-950 dark:via-zinc-950 dark:to-transparent">
        <div className="pointer-events-auto mx-auto max-w-md px-5">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-4 font-bold text-white shadow-lg shadow-sky-200 transition-all hover:bg-sky-600 active:scale-[0.97] dark:bg-sky-600 dark:shadow-sky-900/30"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            リストを更新
          </button>
        </div>
      </div>

      <MapModal
        place={selectedPlace}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
