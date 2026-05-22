export type EmployeeStatus = '在职' | '休假' | '离职';
export type ProjectStatus = '筹备中' | '进行中' | '已结束';
export type DutyShift = '白班' | '夜班' | '24小时';
export type DepartmentStatus = '正常' | '已撤销';
export type ProjectMemberRole = '负责人' | '核心成员' | '一般成员';

export interface Department {
  id: string;
  name: string;
  parentId: string | null;
  leaderId?: string;
  hrbpId?: string;
  adminContactId?: string;
  description?: string;
  status: DepartmentStatus;
  employeeCount: number;
  children?: Department[];
}

export interface Position {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  coreDuties: string[];
  detailDuty?: string;
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
  shift: DutyShift;
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
