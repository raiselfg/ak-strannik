export const projectTypeOptions = [
  { value: 'musical', label: 'Мюзикл' },
  { value: 'singer', label: 'Певец / певица' },
  { value: 'exhibition', label: 'Выставка' },
  { value: 'newYearShow', label: 'Новогоднее шоу' },
  { value: 'masterClass', label: 'Мастер-класс' },
  { value: 'performance', label: 'Спектакль' },
  { value: 'artist', label: 'Артист' },
  { value: 'concertProgram', label: 'Концертная программа' },
  { value: 'festival', label: 'Фестиваль' },
  { value: 'charity', label: 'Благотворительность' },
  { value: 'other', label: 'Другое' },
] as const;

export type ProjectTypeValue = (typeof projectTypeOptions)[number]['value'];

export function getProjectTypeLabel(value: ProjectTypeValue) {
  return projectTypeOptions.find((option) => option.value === value)?.label
    ?? value;
}
