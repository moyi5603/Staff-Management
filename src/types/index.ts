export type EmployeeStatus = '在职' | '休假' | '离职';
export type AccountStatus = '正常' | '已禁用' | '待激活';
export type ProjectStatus = '筹备中' | '进行中' | '已结束';
export type DepartmentStatus = '正常' | '已撤销';
export type ProjectMemberRole = '负责人' | '核心成员' | '一般成员';

export interface DepartmentKpi {
  name: string;
  target: string;
  period: string;
}

export interface Department {
  id: string;
  name: string;
  parentId: string | null;
  leaderId?: string;
  email?: string;
  description?: string;
  culture?: string;
  functionDetail?: string;
  kpis?: DepartmentKpi[];
  status: DepartmentStatus;
  employeeCount: number;
  children?: Department[];
}

export interface PositionKpi {
  name: string;
  target: string;
  period: string;
}

export interface Position {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  coreDuties: string[];
  detailDuty?: string;
  kpis?: PositionKpi[];
  kpiCount: number;
}

export interface SkillTag {
  id: string;
  name: string;
  type: '技能' | '兴趣';
  employeeCount: number;
  scene: string;
}

export interface InterestGroup {
  id: string;
  name: string;
  memberCount: number;
}

export interface Certificate {
  id: string;
  name: string;
  issueDate: string;
  expireDate?: string;
  issuer?: string;
}

export interface Honor {
  id: string;
  name: string;
  date: string;
  issuer: string;
  description?: string;
}

export interface ProjectMember {
  employeeId: string;
  name: string;
  role: ProjectMemberRole;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  departmentId: string;
  departmentName: string;
  relatedDepartments: string[];
  leaderId: string;
  leaderName: string;
  members: ProjectMember[];
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
}

export interface Employee {
  id: string;
  empNo: string;
  name: string;
  phone: string;
  phoneSuffix: string;
  email: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionName: string;
  joinDate: string;
  leaveDate?: string;
  status: EmployeeStatus;
  accountStatus: AccountStatus;
  /** 档案创建日期 YYYY-MM-DD */
  createdAt: string;
  /** 生日 YYYY-MM-DD */
  birthday?: string;
  /** 试用期截止 YYYY-MM-DD */
  probationEndDate?: string;
  wechatBound: boolean;
  /** 最近登录时间 ISO 或 YYYY-MM-DD HH:mm */
  lastLoginAt?: string;
  avatar?: string;
  skills: string[];
  interests: string[];
  interestGroups: string[];
  certificates: Certificate[];
  honors: Honor[];
  projects: { projectId: string; projectName: string; role: ProjectMemberRole; status: ProjectStatus }[];
}

export interface DutyRecord {
  id: string;
  departmentId: string;
  departmentName: string;
  date: string;
  /** 值班开始小时 0–23 */
  startHour: number;
  /** 值班结束小时 0–23（开区间，可小于 startHour 表示跨天） */
  endHour: number;
  employeeId: string;
  employeeName: string;
  phone?: string;
  note?: string;
}

export interface OperationLog {
  id: string;
  time: string;
  operator: string;
  module: string;
  action: string;
  detail: string;
}
