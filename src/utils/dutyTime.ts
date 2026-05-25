/** 值班小时 0–23，表示该整点起算 */
export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);

export function formatHour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`;
}

export function formatDutyTimeRange(startHour: number, endHour: number): string {
  if (startHour < endHour) {
    return `${formatHour(startHour)}–${formatHour(endHour)}`;
  }
  if (startHour > endHour) {
    return `${formatHour(startHour)}–次日${formatHour(endHour)}`;
  }
  return formatHour(startHour);
}

/** 该值班时段是否覆盖某整点小时（结束小时为开区间，不含 endHour） */
export function dutyCoversHour(startHour: number, endHour: number, hour: number): boolean {
  if (startHour < endHour) return hour >= startHour && hour < endHour;
  if (startHour > endHour) return hour >= startHour || hour < endHour;
  return false;
}
