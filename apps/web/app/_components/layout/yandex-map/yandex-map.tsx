'use client';

import Script from 'next/script';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

type Coordinates = [number, number];

type YandexPlacemark = object;

type YandexMapInstance = {
  destroy: () => void;
  geoObjects: {
    add: (placemark: YandexPlacemark) => void;
  };
};

type YandexMapsApi = {
  ready: (callback: () => void) => void;
  Map: new (
    container: HTMLElement,
    options: {
      center: Coordinates;
      zoom: number;
      controls: string[];
    }
  ) => YandexMapInstance;
  Placemark: new (
    coordinates: Coordinates,
    properties: Record<string, string>,
    options: Record<string, string>
  ) => YandexPlacemark;
};

interface YandexMapProps {
  apiKey: string;
  center: Coordinates;
  zoom?: number;
  className?: string;
}

declare global {
  interface Window {
    ymaps?: YandexMapsApi;
  }
}

export default function YandexMap({
  apiKey,
  center,
  zoom = 16,
  className,
}: YandexMapProps) {
  const locale = useLocale();
  const t = useTranslations('Map');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YandexMapInstance | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const mapLanguage = locale === 'en' ? 'en_US' : 'ru_RU';

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const initMap = useCallback(() => {
    const ymaps = window.ymaps;
    const container = mapContainerRef.current;

    if (!ymaps || !container || mapRef.current) return;

    ymaps.ready(() => {
      const currentContainer = mapContainerRef.current;

      if (!currentContainer || mapRef.current) return;

      const map = new ymaps.Map(currentContainer, {
        center,
        zoom,
        controls: ['zoomControl', 'fullscreenControl'],
      });

      const placemark = new ymaps.Placemark(
        center,
        {
          hintContent: t('hint'),
          balloonContent: t('balloon'),
        },
        {
          preset: 'islands#yellowDotIcon',
        }
      );

      map.geoObjects.add(placemark);
      mapRef.current = map;
    });
  }, [center, t, zoom]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, []);

  if (!apiKey) {
    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%' }}
        role="status"
        aria-label={t('unavailableLabel')}
      >
        <div className="flex h-full min-h-80 flex-col justify-end bg-[linear-gradient(135deg,var(--color-ink-3),var(--color-ink))] p-6 text-sm text-muted-foreground">
          <p className="text-lg font-medium text-foreground">
            {t('unavailableTitle')}
          </p>
          <p>{t('unavailableDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {shouldLoad && (
        <Script
          src={`https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=${mapLanguage}`}
          strategy="lazyOnload"
          onLoad={initMap}
          onReady={initMap}
        />
      )}
      <div
        ref={mapContainerRef}
        className={className}
        style={{ width: '100%', height: '100%' }}
      />
    </>
  );
}
