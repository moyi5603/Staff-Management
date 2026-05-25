const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] as const;

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatMonthLabel(weekStart: Date): string {
  return `${weekStart.getFullYear()}年${weekStart.getMonth() + 1}月`;
}

export function getWeekDays(weekStart: Date): { iso: string; label: string; weekday: string }[] {
  return WEEKDAY_LABELS.map((weekday, i) => {
    const date = addDays(weekStart, i);
    const iso = formatDateISO(date);
    const label = `${date.getMonth() + 1}/${date.getDate()}`;
    return { iso, label, weekday };
  });
}

export function eachDateInRange(startIso: string, endIso: string): string[] {
  const dates: string[] = [];
  let cur = parseDate(startIso);
  const end = parseDate(endIso);
  if (cur > end) return dates;
  while (cur <= end) {
    dates.push(formatDateISO(cur));
    cur = addDays(cur, 1);
  }
  return dates;
}
