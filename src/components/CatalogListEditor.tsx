import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { CatalogNameInputModal } from './CatalogNameInputModal';
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
  moveCategory: (id: string, direction: 'up' | 'down') => void;
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
  newCategoryLabel: string;
  newGroupLabel: string;
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
    moveCategory,
    addGroup,
    updateGroup,
    removeGroup,
    addItemName,
    removeItemName,
  } = actions;

  const [activeCategoryId, setActiveCategoryId] = useState(catalog[0]?.id ?? '');
  const [keyword, setKeyword] = useState('');
  const [newNameByGroup, setNewNameByGroup] = useState<Record<number, string>>({});
  const [nameModal, setNameModal] = useState<'category' | 'group' | null>(null);
  const [editCategory, setEditCategory] = useState<{ id: string; name: string } | null>(null);
  const [editGroup, setEditGroup] = useState<{ groupIndex: number; title: string } | null>(null);
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!catalog.some((c) => c.id === activeCategoryId)) {
      setActiveCategoryId(catalog[0]?.id ?? '');
    }
  }, [catalog, activeCategoryId]);

  useEffect(() => {
    if (!openCategoryMenuId) return;
    const onPointerDown = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpenCategoryMenuId(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [openCategoryMenuId]);

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

  const renderGroup = (group: CatalogGroup, groupIndex: number) => (
    <section key={`${group.title}-${groupIndex}`} className={styles.groupBlock}>
      <div className={styles.groupHead}>
        <div className={styles.groupTitleRow}>
          <h5 className={styles.groupTitle}>{group.title}</h5>
          <button
            type="button"
            className={styles.groupEditIcon}
            aria-label={`编辑分组 ${group.title}`}
            onClick={() => setEditGroup({ groupIndex, title: group.title })}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <Button
          variant="danger"
          disabled={group.items.length > 0}
          title={
            group.items.length > 0
              ? `分组下仍有 ${group.items.length} ${labels.itemUnit}，请先全部删除后再移除分组`
              : undefined
          }
          onClick={() => {
            if (group.items.length > 0) {
              window.alert(
                `分组「${group.title}」下仍有 ${group.items.length} ${labels.itemUnit}，请先全部删除后再移除分组。`,
              );
              return;
            }
            if (window.confirm(`确定删除分组「${group.title}」？`)) {
              removeGroup(activeCategoryId, groupIndex);
            }
          }}
        >
          删除分组
        </Button>
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
      <PageHeader title={labels.pageTitle} />

      <p className={styles.stats} style={{ margin: '0 0 16px' }}>
        {labels.summaryLine(catalog.length, totalNames)}
      </p>

      <Card>
        <div className={styles.layout}>
          <aside className={styles.sidebar} ref={sidebarRef}>
            <div className={styles.sidebarHead}>
              <span>{labels.sidebarTitle}</span>
              <Button variant="text" className={styles.sidebarAddBtn} onClick={() => setNameModal('category')}>
                + 新增分类
              </Button>
            </div>
            {catalog.length === 0 ? (
              <p className={styles.emptyMain}>暂无分类，请点击「新增分类」</p>
            ) : (
              <ul className={styles.categoryList}>
                {catalog.map((cat, index) => (
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
                    <div className={styles.categoryMoreWrap}>
                      <button
                        type="button"
                        className={styles.categoryMoreBtn}
                        aria-label={`${cat.name} 更多操作`}
                        aria-expanded={openCategoryMenuId === cat.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenCategoryMenuId((id) => (id === cat.id ? null : cat.id));
                        }}
                      >
                        …
                      </button>
                      {openCategoryMenuId === cat.id && (
                        <div className={styles.categoryMenu} role="menu">
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOpenCategoryMenuId(null);
                              setEditCategory({ id: cat.id, name: cat.name });
                            }}
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            disabled={index === 0}
                            onClick={() => {
                              moveCategory(cat.id, 'up');
                              setOpenCategoryMenuId(null);
                            }}
                          >
                            上移
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            disabled={index === catalog.length - 1}
                            onClick={() => {
                              moveCategory(cat.id, 'down');
                              setOpenCategoryMenuId(null);
                            }}
                          >
                            下移
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className={styles.categoryMenuDanger}
                            onClick={() => {
                              setOpenCategoryMenuId(null);
                              if (window.confirm(labels.deleteCategoryConfirm(cat.name))) {
                                removeCategory(cat.id);
                              }
                            }}
                          >
                            删除
                          </button>
                        </div>
                      )}
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

                <div className={styles.toolbarRow}>
                  <Button variant="primary" onClick={() => setNameModal('group')}>
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

      {nameModal === 'category' && (
        <CatalogNameInputModal
          title="新增分类"
          label={labels.newCategoryLabel}
          placeholder={labels.newCategoryPrompt}
          onConfirm={(name) => {
            const id = addCategory(name);
            if (id) setActiveCategoryId(id);
            setNameModal(null);
          }}
          onClose={() => setNameModal(null)}
        />
      )}
      {nameModal === 'group' && activeCategoryId && (
        <CatalogNameInputModal
          title="新增分组"
          label={labels.newGroupLabel}
          placeholder={labels.newGroupPlaceholder}
          onConfirm={(name) => {
            addGroup(activeCategoryId, name);
            setNameModal(null);
          }}
          onClose={() => setNameModal(null)}
        />
      )}
      {editCategory && (
        <CatalogNameInputModal
          title="编辑分类"
          label={labels.newCategoryLabel}
          placeholder={labels.newCategoryPrompt}
          initialValue={editCategory.name}
          onConfirm={(name) => {
            updateCategory(editCategory.id, name);
            setEditCategory(null);
          }}
          onClose={() => setEditCategory(null)}
        />
      )}
      {editGroup && activeCategoryId && (
        <CatalogNameInputModal
          title="编辑分组"
          label={labels.newGroupLabel}
          placeholder={labels.newGroupPlaceholder}
          initialValue={editGroup.title}
          onConfirm={(name) => {
            updateGroup(activeCategoryId, editGroup.groupIndex, name);
            setEditGroup(null);
          }}
          onClose={() => setEditGroup(null)}
        />
      )}
    </>
  );
}
