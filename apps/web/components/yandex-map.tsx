"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

interface YandexMapProps {
  apiKey: string;
  center: [number, number];
  zoom?: number;
  className?: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function YandexMap({
  apiKey,
  center,
  zoom = 16,
  className,
}: YandexMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  const initMap = useCallback(() => {
    if (!window.ymaps || !mapContainerRef.current || mapRef.current) return;

    window.ymaps.ready(() => {
      const map = new window.ymaps.Map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        controls: ["zoomControl", "fullscreenControl"],
      });

      const placemark = new window.ymaps.Placemark(
        center,
        {
          hintContent: "Академия Странствий",
          balloonContent: "Невский проспект, дом 111/3",
        },
        {
          preset: "islands#yellowDotIcon",
        }
      );

      map.geoObjects.add(placemark);
      mapRef.current = map;
    });
  }, [center, zoom]);

  useEffect(() => {
    if (isApiLoaded) {
      initMap();
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [isApiLoaded, initMap]);

  return (
    <>
      <Script
        src={`https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`}
        onLoad={() => setIsApiLoaded(true)}
      />
      <div
        ref={mapContainerRef}
        className={className}
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
}
