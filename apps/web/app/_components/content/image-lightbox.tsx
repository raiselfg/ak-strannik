'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ImageLightboxProps = {
  src: string;
  alt: string;
  children: ReactNode;
  className?: string;
};

export function ImageLightbox({
  src,
  alt,
  children,
  className,
}: ImageLightboxProps) {
  const t = useTranslations('Pages.common');
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const triggerElement = triggerRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerElement?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`group/lightbox relative block cursor-zoom-in overflow-hidden focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
          className ?? ''
        }`}
        aria-label={t('openImage', { alt })}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </button>

      {isOpen
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 p-3 backdrop-blur-sm sm:p-8"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setIsOpen(false);
              }}
            >
              <span id={titleId} className="sr-only">
                {t('imageViewer', { alt })}
              </span>
              <div className="relative h-full w-full">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label={t('closeImage')}
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 flex size-12 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white shadow-xl transition-colors hover:bg-black/80 focus-visible:ring-3 focus-visible:ring-white/70 focus-visible:outline-none sm:top-6 sm:right-6"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
