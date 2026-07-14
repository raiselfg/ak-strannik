export const projectSectionVariantOptions = [
  {
    value: 'content',
    label: 'Контент',
    description: 'Текстовый информационный блок',
  },
  {
    value: 'split',
    label: 'Текст и изображение',
    description: 'Текстовый блок с одним или несколькими изображениями',
  },
  { value: 'gallery', label: 'Галерея', description: 'Галерея изображений' },
  {
    value: 'slider',
    label: 'Слайдер',
    description: 'Последовательность изображений в слайдере',
  },
  {
    value: 'video',
    label: 'Видео',
    description: 'Видео с YouTube, VK, Rutube или внешнего сервиса',
  },
  { value: 'quote', label: 'Цитата', description: 'Цитата с указанием автора' },
] as const;

export type ProjectSectionVariantValue =
  (typeof projectSectionVariantOptions)[number]['value'];

export function getProjectSectionVariant(value: ProjectSectionVariantValue) {
  return (
    projectSectionVariantOptions.find((option) => option.value === value) ?? {
      value,
      label: value,
      description: '',
    }
  );
}
