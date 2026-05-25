import type { Employee, Project, ProjectMemberRole } from '../types';
import { formatProjectMemberNames } from './projectDisplay';

export function employeeProjectRef(
  project: Project,
  role: ProjectMemberRole,
): Employee['projects'][number] {
  return {
    projectId: project.id,
    projectName: project.name,
    role,
    status: project.status,
    level: project.level,
    priority: project.priority,
    departmentName: project.departmentName,
    leaderName: project.leaderName,
    membersSummary: formatProjectMemberNames(project.members),
    startDate: project.startDate,
    endDate: project.endDate,
  };
}

/** 保存项目后，同步各员工「参与项目」中的引用 */
export function syncEmployeesAfterProjectSave(
  employees: Employee[],
  project: Project,
  prevMemberIds: string[] = [],
): Employee[] {
  const roleByEmp = new Map(project.members.map((m) => [m.employeeId, m.role]));
  const touched = new Set([...prevMemberIds, ...project.members.map((m) => m.employeeId)]);

  return employees.map((emp) => {
    if (!touched.has(emp.id) && !emp.projects.some((p) => p.projectId === project.id)) {
      return emp;
    }
    const role = roleByEmp.get(emp.id);
    if (role) {
      const rest = emp.projects.filter((p) => p.projectId !== project.id);
      return { ...emp, projects: [...rest, employeeProjectRef(project, role)] };
    }
    return { ...emp, projects: emp.projects.filter((p) => p.projectId !== project.id) };
  });
}

export function syncEmployeesAfterProjectDelete(
  employees: Employee[],
  projectId: string,
): Employee[] {
  return employees.map((emp) => ({
    ...emp,
    projects: emp.projects.filter((p) => p.projectId !== projectId),
  }));
}
