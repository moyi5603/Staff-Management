import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { projects as initialProjects } from '../mock/data';
import type { Project } from '../types';
import { useEmployees } from './EmployeeContext';
import {
  syncEmployeesAfterProjectDelete,
  syncEmployeesAfterProjectSave,
} from '../utils/projectEmployeeSync';

interface ProjectContextValue {
  projects: Project[];
  getById: (id: string) => Project | undefined;
  addProject: (project: Project, prevMemberIds?: string[]) => void;
  updateProject: (project: Project, prevMemberIds?: string[]) => void;
  removeProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { patchAllEmployees } = useEmployees();
  const [projects, setProjects] = useState<Project[]>(() =>
    initialProjects.map((p) => ({ ...p, members: p.members.map((m) => ({ ...m })) })),
  );

  const getById = useCallback((id: string) => projects.find((p) => p.id === id), [projects]);

  const addProject = useCallback(
    (project: Project) => {
      setProjects((prev) => [...prev, project]);
      patchAllEmployees((emps) => syncEmployeesAfterProjectSave(emps, project));
    },
    [patchAllEmployees],
  );

  const updateProject = useCallback(
    (project: Project, prevMemberIds: string[] = []) => {
      setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
      patchAllEmployees((emps) => syncEmployeesAfterProjectSave(emps, project, prevMemberIds));
    },
    [patchAllEmployees],
  );

  const removeProject = useCallback(
    (id: string) => {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      patchAllEmployees((emps) => syncEmployeesAfterProjectDelete(emps, id));
    },
    [patchAllEmployees],
  );

  const value = useMemo(
    () => ({ projects, getById, addProject, updateProject, removeProject }),
    [projects, getById, addProject, updateProject, removeProject],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
}
