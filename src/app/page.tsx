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
        `/api/nearby?lat=${lat}&lng=${lng}&radius=2000&max=10`
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-lg px-4 py-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Quick Toilet
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          近くのトイレを表示しています。タップで地図とナビを開きます。
        </p>
        <div className="mt-6">
          <ToiletList
            places={places}
            onSelectPlace={handleSelectPlace}
            loading={loading}
            error={error}
          />
        </div>
      </main>

      <MapModal
        place={selectedPlace}
        open={modalOpen}
        onClose={handleCloseModal}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
