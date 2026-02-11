"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  latitude: number;
  longitude: number;
  /** 現在地（指定時は地図上に青い丸で表示し、目的地と現在地の両方が見える範囲で表示） */
  userLat?: number;
  userLng?: number;
  title?: string;
  className?: string;
}

export function MapView({
  latitude,
  longitude,
  userLat,
  userLng,
  title,
  className,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasUserPosition =
    userLat != null &&
    userLng != null &&
    Number.isFinite(userLat) &&
    Number.isFinite(userLng);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView([latitude, longitude], 17);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const icon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.marker([latitude, longitude], { icon }).addTo(map);

    if (hasUserPosition) {
      L.circleMarker([userLat, userLng], {
        radius: 10,
        fillColor: "#0EA5E9",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      })
        .addTo(map)
        .bindTooltip("現在地", {
          permanent: false,
          direction: "top",
        });
      const bounds = L.latLngBounds([
        [latitude, longitude],
        [userLat, userLng],
      ]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });
    }

    return () => {
      map.remove();
    };
  }, [latitude, longitude, userLat, userLng, hasUserPosition]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: 200 }}
      aria-label={title ?? "地図"}
    />
  );
}
