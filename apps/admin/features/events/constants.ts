export const contentStatusOptions = [
  { value: 'draft', label: 'Черновик' },
  { value: 'published', label: 'Опубликовано' },
  { value: 'archived', label: 'В архиве' },
] as const;

export type ContentStatusValue = (typeof contentStatusOptions)[number]['value'];

export function getContentStatusLabel(value: ContentStatusValue) {
  return contentStatusOptions.find((option) => option.value === value)?.label
    ?? value;
}
