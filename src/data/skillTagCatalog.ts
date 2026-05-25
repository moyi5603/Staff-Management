import type { CatalogCategory } from './catalogTypes';

export const SKILL_TAG_PICKER_MAX = 10;

/** 技能标签库：分类 → 分组 → 标签名称 */
export const SKILL_TAG_CATALOG: CatalogCategory[] = [
  {
    id: 'pm',
    name: '产品经理',
    groups: [
      {
        title: '产品方向',
        items: [
          'B端产品',
          'C端产品',
          '电商产品',
          '移动产品',
          '数据产品',
          'AI 产品',
          'SaaS 产品',
          '平台产品',
        ],
      },
      {
        title: '产品职责',
        items: [
          '产品规划',
          '需求分析',
          '需求管理',
          '竞品分析',
          '用户研究',
          '原型设计',
          'PRD 撰写',
          '数据分析',
          '产品运营',
        ],
      },
    ],
  },
  {
    id: 'dev',
    name: '开发编程类',
    groups: [
      {
        title: '前端',
        items: ['React', 'TypeScript', 'Vue', 'JavaScript', 'HTML/CSS', '前端工程化'],
      },
      {
        title: '后端',
        items: ['Java', 'Python', 'Go', 'Node.js', 'Spring Boot', '微服务'],
      },
      {
        title: '数据库',
        items: ['MySQL', 'Redis', 'MongoDB', 'SQL 优化'],
      },
    ],
  },
  {
    id: 'data',
    name: '大数据类',
    groups: [
      {
        title: '数据工程',
        items: ['Hadoop', 'Spark', 'Flink', '数据仓库', 'ETL'],
      },
      {
        title: '数据科学',
        items: ['机器学习', '数据挖掘', '数据可视化', 'Tableau', 'Power BI'],
      },
    ],
  },
  {
    id: 'design',
    name: '多媒体设计类',
    groups: [
      {
        title: '设计工具',
        items: ['Figma', 'Sketch', 'Photoshop', 'Illustrator', 'AE 动效'],
      },
      {
        title: '设计能力',
        items: ['UI 设计', '交互设计', '视觉设计', '品牌设计'],
      },
    ],
  },
  {
    id: 'office',
    name: '办公应用软件',
    groups: [
      {
        title: '办公软件',
        items: ['Excel 高级', 'PPT 汇报', 'Word 文档', 'Visio 流程图'],
      },
    ],
  },
  {
    id: 'language',
    name: '语言类',
    groups: [
      {
        title: '英语',
        items: ['英语读写', '英语口语', '商务英语', '英文文档撰写'],
      },
      {
        title: '其他语种',
        items: ['日语', '韩语', '法语'],
      },
    ],
  },
];
