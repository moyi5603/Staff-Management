import type { Position, PositionStatus } from '../types';

export interface PositionListFilters {
  code: string;
  name: string;
  status: '' | PositionStatus;
}

export function emptyPositionListFilters(): PositionListFilters {
  return { code: '', name: '', status: '' };
}

export function filterPositions(list: Position[], filters: PositionListFilters): Position[] {
  const code = filters.code.trim();
  const name = filters.name.trim();
  return list.filter((p) => {
    if (code && !p.code.includes(code)) return false;
    if (name && !p.name.includes(name)) return false;
    if (filters.status && p.status !== filters.status) return false;
    return true;
  });
}

export function exportPositionsCsv(list: Position[]) {
  const header = ['岗位编号', '岗位编码', '岗位名称', '岗位排序', '状态', '所属部门', '创建时间'];
  const rows = list.map((p) =>
    [
      p.positionNo,
      p.code,
      p.name,
      p.sortOrder,
      p.status,
      p.departmentName,
      p.createdAt,
    ].map((cell) => `"${String(cell).replace(/"/g, '""')}"`),
  );
  const csv = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `岗位列表_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
