export const ALLOWED_MEDIA_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
] as const;

export const MAX_MEDIA_FILE_SIZE = 2 * 1024 * 1024;

export const MEDIA_EXTENSIONS: Record<(typeof ALLOWED_MEDIA_MIME_TYPES)[number], readonly string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'image/avif': ['avif'],
  'image/gif': ['gif'],
};
