/** 证书名称库（演示数据，仿 BOSS 直聘资格证书选择分类） */

import type { CatalogCategory } from './catalogTypes';

export type { CatalogCategory, CatalogGroup } from './catalogTypes';

export const CERTIFICATE_CATALOG: CatalogCategory[] = [
  {
    id: 'pm',
    name: '项目管理',
    groups: [
      {
        title: '国际认证',
        items: ['PMP 项目管理专业人士', 'PgMP 项目集管理专业人士', 'ACP 敏捷管理专业人士'],
      },
      {
        title: '国内职称',
        items: ['信息系统项目管理师', '系统集成项目管理工程师'],
      },
    ],
  },
  {
    id: 'it',
    name: 'IT',
    groups: [
      {
        title: '计算机等级',
        items: ['计算机一级', '计算机二级', '计算机三级', '计算机四级'],
      },
      {
        title: '厂商认证',
        items: ['AWS 认证解决方案架构师', '阿里云ACP', '华为HCIA', 'CISP 注册信息安全专业人员'],
      },
      {
        title: '开发',
        items: ['软考程序员', '软考软件设计师', 'Oracle OCP'],
      },
    ],
  },
  {
    id: 'language',
    name: '英语',
    groups: [
      {
        title: '等级考试',
        items: ['大学英语四级', '大学英语六级', '专业英语四级', '专业英语八级'],
      },
      {
        title: '留学考试',
        items: ['雅思 6.5+', '托福 90+', 'GRE', 'GMAT'],
      },
    ],
  },
  {
    id: 'foreign',
    name: '外语',
    groups: [
      {
        title: '日语',
        items: ['日语 N2', '日语 N1'],
      },
      {
        title: '其他',
        items: ['法语 DELF B2', '德语 TestDaF', '韩语 TOPIK 中级'],
      },
    ],
  },
  {
    id: 'finance',
    name: '财务',
    groups: [
      {
        title: '会计审计',
        items: ['注册会计师 CPA', '中级会计师', '初级会计师', '税务师'],
      },
    ],
  },
  {
    id: 'hr',
    name: '人力资源',
    groups: [
      {
        title: '人力资源管理',
        items: ['企业人力资源管理师二级', '企业人力资源管理师三级', 'SHRM-CP'],
      },
    ],
  },
  {
    id: 'drive',
    name: '驾驶',
    groups: [
      {
        title: '机动车驾驶证',
        items: ['驾驶证 C1', '驾驶证 C2', '驾驶证 B2'],
      },
    ],
  },
];
