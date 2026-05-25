import { CatalogListEditor } from '../../components/CatalogListEditor';
import { useCertificateCatalog } from '../../context/CertificateCatalogContext';

export function CertificateCatalogList() {
  const api = useCertificateCatalog();

  return (
    <CatalogListEditor
      labels={{
        pageTitle: '证书管理',
        summaryLine: (c, n) =>
          `维护员工「个人证书」选择弹窗中的分类与证书名称，共 ${c} 个分类、${n} 条证书名称。`,
        sidebarTitle: '证书分类',
        newCategoryPrompt: '如：项目管理、语言类',
        newCategoryLabel: '分类名称',
        newGroupLabel: '分组名称',
        deleteCategoryConfirm: (name) =>
          `确定删除分类「${name}」及其下全部分组与证书名称？`,
        searchPlaceholder: '搜索分组或证书名称...',
        newGroupPlaceholder: '新分组名称，如：项目管理',
        addItemPlaceholder: '输入证书名称，回车添加',
        emptyItems: '暂无证书名称',
        emptyNoGroup: '暂无分组，请先新增分组再添加证书名称',
        itemUnit: '条名称',
      }}
      actions={{
        catalog: api.catalog,
        addCategory: api.addCategory,
        updateCategory: api.updateCategory,
        removeCategory: api.removeCategory,
        moveCategory: api.moveCategory,
        addGroup: api.addGroup,
        updateGroup: api.updateGroup,
        removeGroup: api.removeGroup,
        addItemName: api.addCertificateName,
        removeItemName: api.removeCertificateName,
      }}
    />
  );
}
