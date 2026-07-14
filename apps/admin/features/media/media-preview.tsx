export function MediaPreview({
  url,
  alt,
  className = '',
}: {
  url: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`bg-muted bg-contain bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url(${JSON.stringify(url)})` }}
    />
  );
}
