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
      { key: 'certificate', label: '证书管理', path: '/certificate/list' },
    ],
  },
  {
    key: 'project',
    label: '项目管理',
    children: [{ key: 'project-list', label: '项目列表', path: '/project/list' }],
  },
  {
    key: 'duty',
    label: '值班管理',
    children: [{ key: 'duty-calendar', label: '值班日历', path: '/duty/calendar' }],
  },
  {
    key: 'tag',
    label: '标签中心',
    children: [
      { key: 'tag-skill', label: '技能标签', path: '/tag/skill' },
      { key: 'tag-interest', label: '兴趣标签', path: '/tag/interest' },
    ],
  },
];

export const routeTitles: Record<string, string> = {
  '/employee/list': '员工管理',
  '/employee/detail': '员工详情',
  '/employee/form': '员工编辑',
  '/department/list': '部门管理',
  '/position/list': '岗位管理',
  '/certificate/list': '证书管理',
  '/project/list': '项目列表',
  '/duty/calendar': '值班管理',
  '/tag/skill': '技能标签管理',
  '/tag/interest': '兴趣标签管理',
};
