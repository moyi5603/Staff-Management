import { useEffect, useMemo, useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { PageHeader } from './PageHeader';
import type { CatalogCategory } from '../data/catalogTypes';
import type { CatalogGroup } from '../data/catalogTypes';
import { countCatalogItems } from '../utils/catalogUtils';
import styles from '../pages/certificate/CertificateCatalogList.module.css';

export interface CatalogEditorActions {
  catalog: CatalogCategory[];
  addCategory: (name: string) => string;
  updateCategory: (id: string, name: string) => void;
  removeCategory: (id: string) => void;
  addGroup: (categoryId: string, title: string) => void;
  updateGroup: (categoryId: string, groupIndex: number, title: string) => void;
  removeGroup: (categoryId: string, groupIndex: number) => void;
  addItemName: (categoryId: string, groupIndex: number, name: string) => void;
  removeItemName: (categoryId: string, groupIndex: number, nameIndex: number) => void;
}

export interface CatalogListEditorLabels {
  pageTitle: string;
  summaryLine: (categoryCount: number, itemCount: number) => string;
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

interface Props {
  labels: CatalogListEditorLabels;
  actions: CatalogEditorActions;
}

export function CatalogListEditor({ labels, actions }: Props) {
  const {
    catalog,
    addCategory,
    updateCategory,
    removeCategory,
    addGroup,
    updateGroup,
    removeGroup,
    addItemName,
    removeItemName,
  } = actions;

  const [activeCategoryId, setActiveCategoryId] = useState(catalog[0]?.id ?? '');
  const [keyword, setKeyword] = useState('');
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newNameByGroup, setNewNameByGroup] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!catalog.some((c) => c.id === activeCategoryId)) {
      setActiveCategoryId(catalog[0]?.id ?? '');
    }
  }, [catalog, activeCategoryId]);

  const activeCategory = useMemo(
    () => catalog.find((c) => c.id === activeCategoryId),
    [catalog, activeCategoryId],
  );

  const filteredGroups = useMemo(() => {
    if (!activeCategory) return [];
    const q = keyword.trim().toLowerCase();
    return activeCategory.groups
      .map((group, groupIndex) => {
        if (!q) return { group, groupIndex };
        const items = group.items.filter((name) => name.toLowerCase().includes(q));
        const titleMatch = group.title.toLowerCase().includes(q);
        if (!titleMatch && items.length === 0) return null;
        return { group: { ...group, items: titleMatch ? group.items : items }, groupIndex };
      })
      .filter((row): row is { group: CatalogGroup; groupIndex: number } => row !== null);
  }, [activeCategory, keyword]);

  const totalNames = countCatalogItems(catalog);

  const handleAddCategory = () => {
    const name = window.prompt(labels.newCategoryPrompt);
    if (!name?.trim()) return;
    const id = addCategory(name);
    if (id) setActiveCategoryId(id);
  };

  const renderGroup = (group: CatalogGroup, groupIndex: number) => (
    <section key={`${group.title}-${groupIndex}`} className={styles.groupBlock}>
      <div className={styles.groupHead}>
        <h5 className={styles.groupTitle}>{group.title}</h5>
        <div>
          <Button
            variant="text"
            onClick={() => {
              const title = window.prompt('编辑分组名称', group.title);
              if (title?.trim()) updateGroup(activeCategoryId, groupIndex, title);
            }}
          >
            编辑分组
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm(`确定删除分组「${group.title}」？`)) {
                removeGroup(activeCategoryId, groupIndex);
              }
            }}
          >
            删除分组
          </Button>
        </div>
      </div>

      <div className={styles.nameCloud}>
        {group.items.length === 0 ? (
          <span className={styles.stats}>{labels.emptyItems}</span>
        ) : (
          group.items.map((name, nameIndex) => (
            <span key={`${name}-${nameIndex}`} className={styles.nameTag}>
              {name}
              <button
                type="button"
                className={styles.nameRemove}
                aria-label={`删除 ${name}`}
                onClick={() => removeItemName(activeCategoryId, groupIndex, nameIndex)}
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      <div className={styles.addNameRow}>
        <input
          value={newNameByGroup[groupIndex] ?? ''}
          placeholder={labels.addItemPlaceholder}
          onChange={(e) =>
            setNewNameByGroup((prev) => ({ ...prev, [groupIndex]: e.target.value }))
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const n = newNameByGroup[groupIndex]?.trim();
              if (activeCategoryId && n) {
                addItemName(activeCategoryId, groupIndex, n);
                setNewNameByGroup((prev) => ({ ...prev, [groupIndex]: '' }));
              }
            }
          }}
        />
        <Button
          variant="default"
          onClick={() => {
            const n = newNameByGroup[groupIndex]?.trim();
            if (activeCategoryId && n) {
              addItemName(activeCategoryId, groupIndex, n);
              setNewNameByGroup((prev) => ({ ...prev, [groupIndex]: '' }));
            }
          }}
        >
          添加
        </Button>
      </div>
    </section>
  );

  return (
    <>
      <PageHeader
        title={labels.pageTitle}
        actions={
          <Button variant="primary" onClick={handleAddCategory}>
            + 新增分类
          </Button>
        }
      />

      <p className={styles.stats} style={{ margin: '0 0 16px' }}>
        {labels.summaryLine(catalog.length, totalNames)}
      </p>

      <Card>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHead}>
              <span>{labels.sidebarTitle}</span>
            </div>
            {catalog.length === 0 ? (
              <p className={styles.emptyMain}>暂无分类，请点击「新增分类」</p>
            ) : (
              <ul className={styles.categoryList}>
                {catalog.map((cat) => (
                  <li key={cat.id} className={styles.categoryItem}>
                    <button
                      type="button"
                      className={`${styles.categoryBtn} ${
                        activeCategoryId === cat.id ? styles.categoryActive : ''
                      }`}
                      onClick={() => setActiveCategoryId(cat.id)}
                    >
                      {cat.name}
                    </button>
                    <div className={styles.categoryOps}>
                      <Button
                        variant="text"
                        onClick={() => {
                          const name = window.prompt('编辑分类名称', cat.name);
                          if (name?.trim()) updateCategory(cat.id, name);
                        }}
                      >
                        编
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => {
                          if (window.confirm(labels.deleteCategoryConfirm(cat.name))) {
                            removeCategory(cat.id);
                          }
                        }}
                      >
                        删
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <div className={styles.main}>
            {!activeCategory ? (
              <p className={styles.emptyMain}>请选择左侧分类，或新增分类后开始维护</p>
            ) : (
              <>
                <div className={styles.mainHead}>
                  <h4>{activeCategory.name}</h4>
                  <span className={styles.stats}>
                    {activeCategory.groups.length} 个分组 ·{' '}
                    {activeCategory.groups.reduce((s, g) => s + g.items.length, 0)} {labels.itemUnit}
                  </span>
                </div>

                <input
                  className={styles.search}
                  value={keyword}
                  placeholder={labels.searchPlaceholder}
                  onChange={(e) => setKeyword(e.target.value)}
                />

                <div className={styles.inlineForm}>
                  <input
                    value={newGroupTitle}
                    placeholder={labels.newGroupPlaceholder}
                    onChange={(e) => setNewGroupTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (activeCategoryId && newGroupTitle.trim()) {
                          addGroup(activeCategoryId, newGroupTitle);
                          setNewGroupTitle('');
                        }
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (activeCategoryId && newGroupTitle.trim()) {
                        addGroup(activeCategoryId, newGroupTitle);
                        setNewGroupTitle('');
                      }
                    }}
                  >
                    + 新增分组
                  </Button>
                </div>

                {filteredGroups.length === 0 ? (
                  <p className={styles.emptyMain}>
                    {keyword ? '无匹配结果' : labels.emptyNoGroup}
                  </p>
                ) : (
                  filteredGroups.map(({ group, groupIndex }) => renderGroup(group, groupIndex))
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
