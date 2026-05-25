export type EmployeeStatus = '在职' | '休假' | '离职';
export type EmployeeGender = '男' | '女';
export type PoliticalStatus =
  | '群众'
  | '共青团员'
  | '中共党员'
  | '中共预备党员'
  | '民主党派'
  | '无党派人士'
  | '其他';

export const EMPLOYEE_GENDER_OPTIONS: EmployeeGender[] = ['男', '女'];
export const POLITICAL_STATUS_OPTIONS: PoliticalStatus[] = [
  '群众',
  '共青团员',
  '中共党员',
  '中共预备党员',
  '民主党派',
  '无党派人士',
  '其他',
];
export type AccountStatus = '正常' | '已禁用' | '待激活';
export type ProjectStatus = '未启动' | '进行中' | '已结束';
export type ProjectLevel = '公司级' | '部门级' | '团队级';
export type ProjectPriority = '高' | '中' | '低';
export type DepartmentStatus = '正常' | '已撤销';
export type ProjectMemberRole = '负责人' | '核心成员' | '一般成员';

export interface Department {
  id: string;
  name: string;
  parentId: string | null;
  leaderId?: string;
  email?: string;
  description?: string;
  culture?: string;
  functionDetail?: string;
  /** 部门绩效指标（自由文本） */
  performanceIndicators?: string;
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
  /** 核心职责（自由文本，可换行） */
  coreDuties: string;
  detailDuty?: string;
  /** 岗位绩效指标（自由文本） */
  performanceIndicators?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issueDate?: string;
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
  level: ProjectLevel;
  priority: ProjectPriority;
}

export interface Employee {
  id: string;
  empNo: string;
  name: string;
  /** 花名 / 昵称 */
  nickname?: string;
  gender?: EmployeeGender;
  phone: string;
  phoneSuffix: string;
  email: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionName: string;
  workLocationProvince: string;
  workLocationCity: string;
  workLocationDistrict: string;
  joinDate: string;
  leaveDate?: string;
  status: EmployeeStatus;
  accountStatus: AccountStatus;
  /** 档案创建日期 YYYY-MM-DD */
  createdAt: string;
  /** 出生日期 YYYY-MM-DD */
  birthday?: string;
  /** 试用期截止 YYYY-MM-DD */
  probationEndDate?: string;
  /** 籍贯，如「浙江省杭州市」 */
  nativePlace?: string;
  politicalStatus?: PoliticalStatus;
  /** 个人介绍 */
  bio?: string;
  wechatBound: boolean;
  /** 最近登录时间 ISO 或 YYYY-MM-DD HH:mm */
  lastLoginAt?: string;
  avatar?: string;
  skills: string[];
  interests: string[];
  interestGroups: string[];
  certificates: Certificate[];
  honors: Honor[];
  projects: {
    projectId: string;
    projectName: string;
    /** 该员工在项目中的角色 */
    role: ProjectMemberRole;
    status: ProjectStatus;
    level: ProjectLevel;
    priority: ProjectPriority;
    /** 主责部门 */
    departmentName: string;
    leaderName: string;
    /** 参与人摘要，与项目列表一致 */
    membersSummary: string;
    startDate: string;
    endDate?: string;
  }[];
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
