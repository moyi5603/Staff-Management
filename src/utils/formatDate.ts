export function formatDate(iso?: string): string {
  if (!iso) return '—';
  return iso.slice(0, 10);
}

export function formatDateTime(iso?: string): string {
  if (!iso) return '—';
  const d = iso.includes('T') ? iso : `${iso}T00:00:00`;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return iso;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  if (iso.length <= 10) return `${y}-${m}-${day}`;
  return `${y}-${m}-${day} ${h}:${min}`;
}
