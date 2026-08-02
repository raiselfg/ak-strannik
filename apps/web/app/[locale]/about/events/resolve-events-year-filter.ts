export function resolveEventsYearFilter(
  selectedYear: string | undefined,
  availableYears: string[]
): string | null | undefined {
  if (selectedYear === 'all') return undefined;
  if (selectedYear && availableYears.includes(selectedYear))
    return selectedYear;
  return null;
}
