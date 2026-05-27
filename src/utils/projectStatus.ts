import type { Project, ProjectDisplayStatus, ProjectStatus } from '../types';

function todayDateString(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** 进行中且计划结束日早于今天 */
export function isProjectOverdue(
  status: ProjectStatus,
  endDate?: string,
  today = new Date(),
): boolean {
  if (status !== '进行中' || !endDate) return false;
  return endDate < todayDateString(today);
}

export function getProjectDisplayStatus(project: Project, today = new Date()): ProjectDisplayStatus {
  if (isProjectOverdue(project.status, project.endDate, today)) return '已延期';
  return project.status;
}

export function getProjectDisplayStatusFromFields(
  status: ProjectStatus,
  endDate?: string,
  today = new Date(),
): ProjectDisplayStatus {
  if (isProjectOverdue(status, endDate, today)) return '已延期';
  return status;
}
