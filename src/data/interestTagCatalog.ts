import type { CatalogCategory } from './catalogTypes';

/** 兴趣标签库：分类 → 分组 → 标签名称 */
export const INTEREST_TAG_CATALOG: CatalogCategory[] = [
  {
    id: 'sport',
    name: '运动健身',
    groups: [
      {
        title: '球类运动',
        items: ['羽毛球', '篮球', '足球', '乒乓球', '网球'],
      },
      {
        title: '户外运动',
        items: ['跑步', '徒步', '骑行', '登山', '露营'],
      },
    ],
  },
  {
    id: 'culture',
    name: '文化艺术',
    groups: [
      {
        title: '阅读学习',
        items: ['阅读', '写作', '历史', '心理学'],
      },
      {
        title: '音乐艺术',
        items: ['吉他', '钢琴', '摄影', '绘画'],
      },
    ],
  },
  {
    id: 'life',
    name: '休闲娱乐',
    groups: [
      {
        title: '游戏影音',
        items: ['游戏', '电影', '动漫', '播客'],
      },
      {
        title: '美食旅行',
        items: ['烹饪', '咖啡', '旅行', '探店'],
      },
    ],
  },
  {
    id: 'social',
    name: '社交公益',
    groups: [
      {
        title: '志愿社群',
        items: ['志愿服务', '宠物', '亲子活动'],
      },
    ],
  },
];
