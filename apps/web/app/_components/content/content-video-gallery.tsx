import { getVideoEmbed } from '@/lib/media/get-video-embed';

export function ContentVideoGallery({
  videos,
  title,
}: {
  videos: string[];
  title: (index: number) => string;
}) {
  const embeds = videos.map(getVideoEmbed).filter((embed) => embed !== null);

  if (embeds.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:gap-4 lg:grid-cols-6">
      {embeds.map((embed, index) => (
        <li
          key={`${embed.src}-${index}`}
          className={`aspect-video overflow-hidden rounded-2xl border border-border/40 bg-muted/30 sm:rounded-3xl ${getVideoGridSpan(index, embeds.length)}`}
        >
          <iframe
            src={embed.src}
            title={title(index)}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="size-full"
          />
        </li>
      ))}
    </ul>
  );
}

function getVideoGridSpan(index: number, videoCount: number): string {
  const remainder = videoCount % 3;

  if (videoCount === 1) return 'lg:col-span-6';
  if (remainder === 1 && index >= videoCount - 4) return 'lg:col-span-3';
  if (remainder === 2 && index >= videoCount - 2) return 'lg:col-span-3';

  return 'lg:col-span-2';
}
