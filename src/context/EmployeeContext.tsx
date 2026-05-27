import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { employees as initialEmployees } from '../mock/data';
import type { Employee, EmployeeStatus } from '../types';
import { formatWorkLocation } from '../utils/workLocation';

interface EmployeeContextValue {
  employees: Employee[];
  getById: (id: string) => Employee | undefined;
  addEmployee: (emp: Employee) => void;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;
  removeEmployees: (ids: string[]) => void;
  patchAllEmployees: (updater: (prev: Employee[]) => Employee[]) => void;
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() =>
    initialEmployees.map((e) => ({ ...e })),
  );

  const getById = useCallback((id: string) => employees.find((e) => e.id === id), [employees]);

  const addEmployee = useCallback((emp: Employee) => {
    setEmployees((prev) => [...prev, emp]);
  }, []);

  const updateEmployee = useCallback((id: string, patch: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const removeEmployees = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setEmployees((prev) => prev.filter((e) => !idSet.has(e.id)));
  }, []);

  const patchAllEmployees = useCallback((updater: (prev: Employee[]) => Employee[]) => {
    setEmployees(updater);
  }, []);

  const value = useMemo(
    () => ({
      employees,
      getById,
      addEmployee,
      updateEmployee,
      removeEmployees,
      patchAllEmployees,
    }),
    [employees, getById, addEmployee, updateEmployee, removeEmployees, patchAllEmployees],
  );

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}

export function useEmployees() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployees must be used within EmployeeProvider');
  return ctx;
}

export const DEPARTMENT_OPTIONS = [
  { id: 'dept-product', name: '产品部' },
  { id: 'dept-tech', name: '技术部' },
  { id: 'dept-sales', name: '销售部' },
] as const;

export const POSITION_OPTIONS = [
  { id: 'pos-1', name: '产品经理', departmentId: 'dept-product' },
  { id: 'pos-2', name: '前端开发', departmentId: 'dept-tech' },
  { id: 'pos-3', name: '销售代表', departmentId: 'dept-sales' },
] as const;

export function phoneSuffixFromPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-4).padStart(4, '0');
}

export function exportEmployeesCsv(list: Employee[]) {
  const headers = [
    '员工姓名',
    '工号',
    '员工生日',
    '入职时间',
    '部门',
    '工作地点',
    '手机号码',
    '邮箱',
    '试用截止',
    '是否绑定微信小程序',
    '最近登录时间',
    '角色',
    '在职状态',
    '账号状态',
    '备注',
  ];
  const rows = list.map((e) =>
    [
      e.name,
      e.empNo,
      e.birthday ?? '',
      e.joinDate,
      e.departmentName,
      formatWorkLocation(e, ''),
      e.phone,
      e.email,
      e.probationEndDate ?? '',
      e.wechatBound ? '是' : '否',
      e.lastLoginAt ?? '',
      e.role,
      e.status,
      e.accountStatus,
      e.remark ?? '',
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(','),
  );
  const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `员工导出_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export type { EmployeeStatus };
