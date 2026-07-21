'use client';

import { ImageOff } from 'lucide-react';
import { useState } from 'react';

export function MediaImage({
  alt,
  className,
  fit = 'contain',
  src,
}: {
  alt: string;
  className: string;
  fit?: 'contain' | 'cover';
  src: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <div className={`grid place-items-center bg-muted/50 ${className}`}>
        <ImageOff className="size-10 text-muted-foreground/60" />
        <span className="sr-only">
          Не удалось загрузить {alt.toLowerCase()}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Runtime S3 host is configured outside Next image domains.
    <img
      alt={alt}
      className={`${className} bg-muted ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
      onError={() => setFailedSrc(src)}
      src={src}
    />
  );
}
