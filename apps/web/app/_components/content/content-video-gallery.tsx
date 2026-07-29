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
    <ul className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      {embeds.map((embed, index) => (
        <li
          key={`${embed.src}-${index}`}
          className="aspect-video overflow-hidden rounded-2xl border border-border/40 bg-muted/30 sm:rounded-3xl"
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
