export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
  {
    key: 'enterprise',
    label: '企业管理',
    children: [
      { key: 'department', label: '部门管理', path: '/department/list' },
      { key: 'employee', label: '员工管理', path: '/employee/list' },
      { key: 'position', label: '岗位管理', path: '/position/list' },
    ],
  },
  {
    key: 'project',
    label: '项目管理',
    children: [
      { key: 'project-list', label: '项目列表', path: '/project/list' },
      { key: 'project-archive', label: '项目归档', path: '/project/list?status=已结束' },
    ],
  },
  {
    key: 'duty',
    label: '值班管理',
    children: [
      { key: 'duty-calendar', label: '值班日历', path: '/duty/calendar' },
      { key: 'duty-records', label: '值班记录', path: '/duty/calendar?view=list' },
    ],
  },
  {
    key: 'tag',
    label: '标签中心',
    children: [
      { key: 'tag-skill', label: '技能标签', path: '/tag/skill' },
      { key: 'tag-interest', label: '兴趣标签', path: '/tag/interest' },
      { key: 'tag-group', label: '兴趣小组', path: '/tag/group' },
    ],
  },
  {
    key: 'system',
    label: '系统设置',
    children: [
      { key: 'system-log', label: '操作日志', path: '/system/log' },
      { key: 'system-import', label: '数据导入/导出', path: '/system/import' },
    ],
  },
];

export const routeTitles: Record<string, string> = {
  '/employee/list': '员工管理',
  '/employee/detail': '员工详情',
  '/employee/form': '员工编辑',
  '/department/list': '部门管理',
  '/position/list': '岗位管理',
  '/project/list': '项目管理',
  '/duty/calendar': '值班管理',
  '/tag/skill': '技能标签',
  '/tag/interest': '兴趣标签',
  '/tag/group': '兴趣小组',
  '/system/log': '操作日志',
  '/system/import': '数据导入/导出',
};
