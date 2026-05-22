import type {
  Department,
  DutyRecord,
  Employee,
  InterestGroup,
  OperationLog,
  Position,
  Project,
  SkillTag,
} from '../types';

export const departments: Department[] = [
  {
    id: 'dept-root',
    name: '公司总部',
    parentId: null,
    status: '正常',
    employeeCount: 120,
    children: [
      {
        id: 'dept-product',
        name: '产品部',
        parentId: 'dept-root',
        leaderId: 'emp-001',
        hrbpId: 'emp-002',
        adminContactId: 'emp-003',
        description: '负责公司产品规划与运营，推动产品全生命周期管理。',
        status: '正常',
        employeeCount: 23,
        children: [
          { id: 'dept-product-plan', name: '产品规划组', parentId: 'dept-product', status: '正常', employeeCount: 8 },
          { id: 'dept-product-ops', name: '产品运营组', parentId: 'dept-product', status: '正常', employeeCount: 15 },
        ],
      },
      {
        id: 'dept-tech',
        name: '技术部',
        parentId: 'dept-root',
        status: '正常',
        employeeCount: 45,
        children: [
          { id: 'dept-fe', name: '前端组', parentId: 'dept-tech', status: '正常', employeeCount: 12 },
          { id: 'dept-be', name: '后端组', parentId: 'dept-tech', status: '正常', employeeCount: 18 },
        ],
      },
      { id: 'dept-sales', name: '销售部', parentId: 'dept-root', status: '正常', employeeCount: 32 },
      { id: 'dept-hr', name: '人力部', parentId: 'dept-root', status: '正常', employeeCount: 8 },
    ],
  },
];

export const positions: Position[] = [
  { id: 'pos-1', name: '产品经理', departmentId: 'dept-product', departmentName: '产品部', employeeCount: 5, coreDuties: ['需求分析', '产品规划', '跨部门协调'], kpiCount: 4 },
  { id: 'pos-2', name: '前端开发', departmentId: 'dept-fe', departmentName: '技术部', employeeCount: 8, coreDuties: ['页面开发', '组件封装', '性能优化'], kpiCount: 3 },
  { id: 'pos-3', name: '销售代表', departmentId: 'dept-sales', departmentName: '销售部', employeeCount: 12, coreDuties: ['客户拓展', '合同跟进'], kpiCount: 5 },
];

export const skillTags: SkillTag[] = [
  { id: 'tag-1', name: '产品规划', type: '技能', employeeCount: 12, scene: '员工技能展示' },
  { id: 'tag-2', name: '需求管理', type: '技能', employeeCount: 8, scene: '员工技能展示' },
  { id: 'tag-3', name: '数据分析', type: '技能', employeeCount: 15, scene: '员工技能展示' },
  { id: 'tag-4', name: 'Python', type: '技能', employeeCount: 6, scene: '员工技能展示' },
  { id: 'tag-5', name: '羽毛球', type: '兴趣', employeeCount: 23, scene: '兴趣小组匹配' },
];

export const interestGroups: InterestGroup[] = [
  { id: 'ig-1', name: '羽毛球俱乐部', memberCount: 18 },
  { id: 'ig-2', name: '摄影兴趣组', memberCount: 12 },
  { id: 'ig-3', name: '咖啡爱好者', memberCount: 9 },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: '智能客服系统 v2.0',
    description: '为用户提供智能化客服体验，提升服务效率与客户满意度。',
    departmentId: 'dept-product',
    departmentName: '产品部',
    relatedDepartments: ['技术部', '销售部'],
    leaderId: 'emp-001',
    leaderName: '张三',
    members: [
      { employeeId: 'emp-001', name: '张三', role: '负责人' },
      { employeeId: 'emp-002', name: '李四', role: '核心成员' },
      { employeeId: 'emp-003', name: '王五', role: '一般成员' },
    ],
    startDate: '2024-01-01',
    status: '进行中',
  },
  {
    id: 'proj-2',
    name: '企业知识库',
    departmentId: 'dept-product',
    departmentName: '产品部',
    relatedDepartments: [],
    leaderId: 'emp-004',
    leaderName: '陈丽华',
    members: [
      { employeeId: 'emp-001', name: '张三', role: '核心成员' },
      { employeeId: 'emp-004', name: '陈丽华', role: '负责人' },
    ],
    startDate: '2023-06-01',
    endDate: '2024-02-28',
    status: '已结束',
  },
];

export const employees: Employee[] = [
  {
    id: 'emp-001',
    empNo: 'EMP-00123',
    name: '张三',
    phone: '13812340001',
    phoneSuffix: '0001',
    email: 'zhangsan@company.com',
    departmentId: 'dept-product',
    departmentName: '产品部',
    positionId: 'pos-1',
    positionName: '产品经理',
    joinDate: '2022-03-15',
    status: '在职',
    skills: ['产品规划', '需求管理', '数据分析'],
    interests: ['跑步', '羽毛球', '阅读'],
    interestGroups: ['羽毛球俱乐部'],
    certificates: [
      { id: 'cert-1', name: 'PMP 项目管理专业人士', issueDate: '2023-06-01', expireDate: '2026-06-01', issuer: 'PMI' },
    ],
    honors: [
      { id: 'honor-1', name: '2023年度最佳产品经理', date: '2024-01-15', issuer: '公司管理层', description: '因在智能客服v2项目中卓越的产品设计获得该荣誉' },
    ],
    projects: [
      { projectId: 'proj-1', projectName: '智能客服系统 v2.0', role: '负责人', status: '进行中' },
      { projectId: 'proj-2', projectName: '企业知识库', role: '核心成员', status: '已结束' },
    ],
  },
  {
    id: 'emp-002',
    empNo: 'EMP-00124',
    name: '李四',
    phone: '13812340002',
    phoneSuffix: '0002',
    email: 'lisi@company.com',
    departmentId: 'dept-fe',
    departmentName: '技术部',
    positionId: 'pos-2',
    positionName: '前端开发',
    joinDate: '2021-08-01',
    status: '在职',
    skills: ['React', 'TypeScript'],
    interests: ['游戏'],
    interestGroups: [],
    certificates: [],
    honors: [],
    projects: [{ projectId: 'proj-1', projectName: '智能客服系统 v2.0', role: '核心成员', status: '进行中' }],
  },
  {
    id: 'emp-003',
    empNo: 'EMP-00125',
    name: '王五',
    phone: '13812340003',
    phoneSuffix: '0003',
    email: 'wangwu@company.com',
    departmentId: 'dept-product',
    departmentName: '产品部',
    positionId: 'pos-1',
    positionName: '产品经理',
    joinDate: '2023-01-10',
    status: '休假',
    skills: ['需求管理'],
    interests: ['阅读'],
    interestGroups: [],
    certificates: [],
    honors: [],
    projects: [],
  },
  {
    id: 'emp-004',
    empNo: 'EMP-00126',
    name: '赵六',
    phone: '13812340004',
    phoneSuffix: '0004',
    email: 'zhaoliu@company.com',
    departmentId: 'dept-sales',
    departmentName: '销售部',
    positionId: 'pos-3',
    positionName: '销售代表',
    joinDate: '2020-05-20',
    leaveDate: '2025-12-01',
    status: '离职',
    skills: [],
    interests: [],
    interestGroups: [],
    certificates: [],
    honors: [],
    projects: [],
  },
];

export const dutyRecords: DutyRecord[] = [
  { id: 'duty-1', departmentId: 'dept-product', departmentName: '产品部', date: '2026-05-18', shift: '白班', employeeId: 'emp-001', employeeName: '张三' },
  { id: 'duty-2', departmentId: 'dept-product', departmentName: '产品部', date: '2026-05-19', shift: '白班', employeeId: 'emp-003', employeeName: '王五' },
  { id: 'duty-3', departmentId: 'dept-tech', departmentName: '技术部', date: '2026-05-18', shift: '白班', employeeId: 'emp-002', employeeName: '李四' },
];

export const operationLogs: OperationLog[] = [
  { id: 'log-1', time: '2026-05-22 14:30', operator: '张三（本人）', module: '员工管理', action: '编辑基础信息', detail: '手机号: 138****0001 → 138****9999' },
  { id: 'log-2', time: '2026-05-22 10:15', operator: 'HR-李华', module: '项目管理', action: '新增项目', detail: '新增项目：智能客服v3.0' },
  { id: 'log-3', time: '2026-05-21 09:00', operator: 'HR-李华', module: '值班管理', action: '批量排班', detail: '批量排班：产品部5月' },
];

export function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

export function getEmployeeById(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}

export function flattenDepartments(nodes: Department[], result: Department[] = []): Department[] {
  for (const node of nodes) {
    result.push(node);
    if (node.children) flattenDepartments(node.children, result);
  }
  return result;
}
