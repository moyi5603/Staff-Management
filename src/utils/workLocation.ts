import type { Employee } from '../types';

export type WorkLocationValue = Pick<
  Employee,
  'workLocationProvince' | 'workLocationCity' | 'workLocationDistrict'
>;

export function formatWorkLocation(
  loc: Partial<WorkLocationValue> | undefined,
  empty = '—',
): string {
  if (!loc?.workLocationProvince) return empty;
  const parts = [loc.workLocationProvince, loc.workLocationCity, loc.workLocationDistrict].filter(
    Boolean,
  );
  return parts.join(' / ');
}

export function isWorkLocationComplete(loc: Partial<WorkLocationValue>): boolean {
  return Boolean(loc.workLocationProvince && loc.workLocationCity && loc.workLocationDistrict);
}
