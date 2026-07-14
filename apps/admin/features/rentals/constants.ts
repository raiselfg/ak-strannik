export const rentalTypeOptions = [
  { value: 'mascot', label: 'Ростовая кукла' },
  { value: 'attraction', label: 'Аттракцион' },
  { value: 'props', label: 'Реквизит' },
] as const;

export type RentalTypeValue = (typeof rentalTypeOptions)[number]['value'];

export function getRentalTypeLabel(value: RentalTypeValue) {
  return (
    rentalTypeOptions.find((option) => option.value === value)?.label ?? value
  );
}
