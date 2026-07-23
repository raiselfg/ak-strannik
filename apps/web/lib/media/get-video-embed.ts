export type VideoEmbed =
  | { provider: 'youtube'; src: string }
  | { provider: 'rutube'; src: string };

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{6,64}$/;

export function getVideoEmbed(value: string): VideoEmbed | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:' || url.username || url.password || url.port) {
    return null;
  }

  const youtubeId = getYoutubeId(url);
  if (youtubeId) {
    return {
      provider: 'youtube',
      src: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
    };
  }

  const rutubeId = getRutubeId(url);
  if (rutubeId) {
    return {
      provider: 'rutube',
      src: `https://rutube.ru/play/embed/${rutubeId}/`,
    };
  }

  return null;
}

function getYoutubeId(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  const segments = getPathSegments(url);
  let id: string | null = null;

  if (host === 'youtu.be' && segments.length === 1) {
    id = segments[0] ?? null;
  } else if (
    host === 'youtube.com' ||
    host === 'www.youtube.com' ||
    host === 'm.youtube.com'
  ) {
    if (url.pathname === '/watch') {
      id = url.searchParams.get('v');
    } else if (
      segments.length === 2 &&
      (segments[0] === 'embed' || segments[0] === 'shorts')
    ) {
      id = segments[1] ?? null;
    }
  }

  return isValidVideoId(id) ? id : null;
}

function getRutubeId(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  if (host !== 'rutube.ru' && host !== 'www.rutube.ru') return null;

  const segments = getPathSegments(url);
  let id: string | null = null;
  if (segments.length === 2 && segments[0] === 'video') {
    id = segments[1] ?? null;
  } else if (
    segments.length === 3 &&
    segments[0] === 'play' &&
    segments[1] === 'embed'
  ) {
    id = segments[2] ?? null;
  }

  return isValidVideoId(id) ? id : null;
}

function getPathSegments(url: URL): string[] {
  return url.pathname.split('/').filter(Boolean);
}

function isValidVideoId(value: string | null): value is string {
  return value !== null && VIDEO_ID_PATTERN.test(value);
}
