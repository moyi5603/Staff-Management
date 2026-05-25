import type { AccountStatus, Employee, EmployeeStatus } from '../types';

export type SearchFieldType = 'name' | 'empNo' | 'email' | 'phone';

export type TenureRange = '0-1' | '1-3' | '3-5' | '5+';

export interface EmployeeListFilters {
  searchType: SearchFieldType;
  keyword: string;
  status: EmployeeStatus | '';
  accountStatus: AccountStatus | '';
  createdStart: string;
  createdEnd: string;
  birthdayStart: string;
  birthdayEnd: string;
  tenure: TenureRange | '';
}

export const emptyEmployeeListFilters = (): EmployeeListFilters => ({
  searchType: 'name',
  keyword: '',
  status: '',
  accountStatus: '',
  createdStart: '',
  createdEnd: '',
  birthdayStart: '',
  birthdayEnd: '',
  tenure: '',
});

export const SEARCH_FIELD_OPTIONS: { value: SearchFieldType; label: string }[] = [
  { value: 'name', label: '员工姓名' },
  { value: 'empNo', label: '工号' },
  { value: 'email', label: '邮箱' },
  { value: 'phone', label: '电话' },
];

export const TENURE_OPTIONS: { value: TenureRange | ''; label: string }[] = [
  { value: '', label: '选择司龄' },
  { value: '0-1', label: '1年以内' },
  { value: '1-3', label: '1-3年' },
  { value: '3-5', label: '3-5年' },
  { value: '5+', label: '5年以上' },
];

function yearsOfService(joinDate: string, asOf = new Date()): number {
  const join = new Date(joinDate);
  return (asOf.getTime() - join.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
}

function inDateRange(value: string | undefined, start: string, end: string): boolean {
  if (!start && !end) return true;
  if (!value) return false;
  if (start && value < start) return false;
  if (end && value > end) return false;
  return true;
}

function matchTenure(joinDate: string, range: TenureRange): boolean {
  const y = yearsOfService(joinDate);
  switch (range) {
    case '0-1':
      return y < 1;
    case '1-3':
      return y >= 1 && y < 3;
    case '3-5':
      return y >= 3 && y < 5;
    case '5+':
      return y >= 5;
    default:
      return true;
  }
}

function matchKeyword(emp: Employee, type: SearchFieldType, kw: string): boolean {
  const q = kw.trim().toLowerCase();
  if (!q) return true;
  switch (type) {
    case 'name':
      return emp.name.toLowerCase().includes(q);
    case 'empNo':
      return emp.empNo.toLowerCase().includes(q);
    case 'email':
      return emp.email.toLowerCase().includes(q);
    case 'phone':
      return emp.phone.includes(q);
    default:
      return true;
  }
}

export function filterEmployees(
  employees: Employee[],
  filters: EmployeeListFilters,
  treeDeptScope: { ids: Set<string>; names: Set<string> } | null,
): Employee[] {
  return employees.filter((e) => {
    if (!matchKeyword(e, filters.searchType, filters.keyword)) return false;
    if (filters.status && e.status !== filters.status) return false;
    if (filters.accountStatus && e.accountStatus !== filters.accountStatus) return false;
    if (!inDateRange(e.createdAt ?? e.joinDate, filters.createdStart, filters.createdEnd)) return false;
    if (!inDateRange(e.birthday, filters.birthdayStart, filters.birthdayEnd)) return false;
    if (filters.tenure && !matchTenure(e.joinDate, filters.tenure)) return false;
    if (
      treeDeptScope &&
      !treeDeptScope.ids.has(e.departmentId) &&
      !treeDeptScope.names.has(e.departmentName)
    ) {
      return false;
    }
    return true;
  });
}
