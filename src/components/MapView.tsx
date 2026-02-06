"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  latitude: number;
  longitude: number;
  title?: string;
  className?: string;
}

export function MapView({ latitude, longitude, title, className }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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

    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: 200 }}
      aria-label={title ?? "地図"}
    />
  );
}
