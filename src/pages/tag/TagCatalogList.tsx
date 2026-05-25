import { CatalogListEditor } from '../../components/CatalogListEditor';
import { useTagCatalogKind, type TagCatalogKind } from '../../context/TagCatalogContext';

const config: Record<
  TagCatalogKind,
  {
    pageTitle: string;
    summaryLine: (c: number, n: number) => string;
    sidebarTitle: string;
    newCategoryPrompt: string;
    deleteCategoryConfirm: (name: string) => string;
    searchPlaceholder: string;
    newGroupPlaceholder: string;
    addItemPlaceholder: string;
    emptyItems: string;
    emptyNoGroup: string;
    itemUnit: string;
  }
> = {
  skill: {
    pageTitle: '技能标签管理',
    summaryLine: (c, n) =>
      `维护员工「个人技能」选择弹窗中的分类与标签，共 ${c} 个分类、${n} 个标签。`,
    sidebarTitle: '技能分类',
    newCategoryPrompt: '请输入技能分类名称',
    deleteCategoryConfirm: (name) => `确定删除分类「${name}」及其下全部分组与技能标签？`,
    searchPlaceholder: '搜索分组或技能标签...',
    newGroupPlaceholder: '新分组名称，如：产品职责',
    addItemPlaceholder: '输入技能标签名称，回车添加',
    emptyItems: '暂无标签',
    emptyNoGroup: '暂无分组，请先新增分组再添加技能标签',
    itemUnit: '个标签',
  },
  interest: {
    pageTitle: '兴趣标签管理',
    summaryLine: (c, n) =>
      `维护员工「兴趣爱好」选择弹窗中的分类与标签，共 ${c} 个分类、${n} 个标签。`,
    sidebarTitle: '兴趣分类',
    newCategoryPrompt: '请输入兴趣分类名称',
    deleteCategoryConfirm: (name) => `确定删除分类「${name}」及其下全部分组与兴趣标签？`,
    searchPlaceholder: '搜索分组或兴趣标签...',
    newGroupPlaceholder: '新分组名称，如：球类运动',
    addItemPlaceholder: '输入兴趣标签名称，回车添加',
    emptyItems: '暂无标签',
    emptyNoGroup: '暂无分组，请先新增分组再添加兴趣标签',
    itemUnit: '个标签',
  },
};

export function TagCatalogList({ mode }: { mode: TagCatalogKind }) {
  const api = useTagCatalogKind(mode);
  const labels = config[mode];

  return (
    <CatalogListEditor
      labels={labels}
      actions={{
        catalog: api.catalog,
        addCategory: api.addCategory,
        updateCategory: api.updateCategory,
        removeCategory: api.removeCategory,
        addGroup: api.addGroup,
        updateGroup: api.updateGroup,
        removeGroup: api.removeGroup,
        addItemName: api.addTagName,
        removeItemName: api.removeTagName,
      }}
    />
  );
}
