import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 1280;
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(onChange: () => void) {
  const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
  mediaQuery.addEventListener('change', onChange);

  return () => mediaQuery.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
