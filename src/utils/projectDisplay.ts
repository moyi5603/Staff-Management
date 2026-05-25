import type { Project } from '../types';

/** 与项目列表「参与人」列一致的展示格式 */
export function formatProjectMemberNames(members: Project['members'], max = 3): string {
  if (members.length === 0) return '—';
  const names = members.map((m) => m.name);
  if (names.length <= max) return names.join('、');
  return `${names.slice(0, max).join('、')} 等${names.length}人`;
}
