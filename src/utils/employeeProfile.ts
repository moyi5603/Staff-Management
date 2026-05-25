import type { Employee } from '../types';

/** 展示用姓名：有花名时为「姓名（花名）」 */
export function formatEmployeeDisplayName(emp: Pick<Employee, 'name' | 'nickname'>): string {
  const nick = emp.nickname?.trim();
  return nick ? `${emp.name}（${nick}）` : emp.name;
}

export function formatOptionalText(value: string | undefined, empty = '—'): string {
  const t = value?.trim();
  return t ? t : empty;
}
