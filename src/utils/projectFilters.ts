import type { Project } from '../types';

export interface ProjectListFilters {
  name: string;
  department: string;
  leader: string;
  member: string;
}

export function emptyProjectListFilters(): ProjectListFilters {
  return { name: '', department: '', leader: '', member: '' };
}

export function hasActiveProjectFilters(filters: ProjectListFilters): boolean {
  return Boolean(
    filters.name.trim() ||
      filters.department.trim() ||
      filters.leader.trim() ||
      filters.member.trim(),
  );
}

export function filterProjects(projects: Project[], filters: ProjectListFilters): Project[] {
  const name = filters.name.trim();
  const department = filters.department.trim();
  const leader = filters.leader.trim();
  const member = filters.member.trim();

  if (!name && !department && !leader && !member) return projects;

  return projects.filter((p) => {
    if (name && !p.name.includes(name)) return false;
    if (department && !p.departmentName.includes(department)) return false;
    if (leader && !p.leaderName.includes(leader)) return false;
    if (member && !p.members.some((m) => m.name.includes(member))) return false;
    return true;
  });
}
