import { z } from 'zod';
import { SortOrderSchema } from './common';
import { VideoProviderSchema, type VideoProvider } from './enums';

const providerHosts: Record<Exclude<VideoProvider, 'external'>, string[]> = {
  youtube: ['youtube.com', 'youtu.be', 'youtube-nocookie.com'],
  vk: ['vk.com', 'vkvideo.ru'],
  rutube: ['rutube.ru'],
};

export function validateVideoUrl(provider: VideoProvider, value: string) {
  try {
    const url = new URL(value);

    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password
    ) {
      return false;
    }

    if (provider === 'external') {
      return true;
    }

    const hostname = url.hostname.toLowerCase();
    return providerHosts[provider].some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export const VideoInputSchema = z
  .object({
    provider: VideoProviderSchema,
    url: z.string().trim().min(1),
    sortOrder: SortOrderSchema.optional(),
  })
  .refine(({ provider, url }) => validateVideoUrl(provider, url), {
    path: ['url'],
    message: 'URL не соответствует выбранному видеопровайдеру',
  });

export type VideoInput = z.infer<typeof VideoInputSchema>;
