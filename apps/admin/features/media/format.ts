export function formatFileSize(size: number | null) {
  if (size === null) return 'Размер не определён';
  if (size < 1024) return `${size} Б`;
  if (size < 1024 ** 2)
    return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(size / 1024)} КБ`;
  return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(size / 1024 ** 2)} МБ`;
}

export function formatImageDimensions(
  width: number | null,
  height: number | null
) {
  return width && height ? `${width} × ${height}` : 'Размер не определён';
}
