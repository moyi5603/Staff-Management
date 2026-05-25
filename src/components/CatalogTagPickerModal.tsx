import { useMemo, useState } from 'react';
import { Button } from './Button';
import type { CatalogCategory } from '../data/catalogTypes';
import { normalizeTagLabel } from '../utils/tagLabel';
import styles from './CatalogTagPickerModal.module.css';

interface Props {
  title: string;
  /** 不传则不限制数量 */
  maxCount?: number;
  catalog: CatalogCategory[];
  existingNames: string[];
  inputPlaceholder?: string;
  emptySearchHint?: (query: string) => string;
  limitHintUnit?: string;
  onConfirm: (names: string[]) => void;
  onClose: () => void;
}

export function CatalogTagPickerModal({
  title,
  maxCount,
  catalog,
  existingNames,
  inputPlaceholder = '请输入，回车添加自定义',
  emptySearchHint = (q) => `未找到匹配项，按回车将「${q}」添加为自定义`,
  limitHintUnit = '项',
  onConfirm,
  onClose,
}: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState(catalog[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState<string[]>([]);

  const existingLower = useMemo(
    () => new Set(existingNames.map((n) => n.toLowerCase())),
    [existingNames],
  );

  const pendingLower = useMemo(() => new Set(pending.map((n) => n.toLowerCase())), [pending]);

  const totalCount = existingNames.length + pending.length;
  const atLimit = maxCount !== undefined && totalCount >= maxCount;

  const activeCategory = useMemo(
    () => catalog.find((c) => c.id === activeCategoryId) ?? catalog[0],
    [catalog, activeCategoryId],
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const items: string[] = [];
    for (const cat of catalog) {
      for (const group of cat.groups) {
        for (const name of group.items) {
          if (name.toLowerCase().includes(q) && !items.includes(name)) {
            items.push(name);
          }
        }
      }
    }
    return items;
  }, [query, catalog]);

  const togglePending = (name: string) => {
    const key = name.toLowerCase();
    if (existingLower.has(key)) return;
    if (pendingLower.has(key)) {
      setPending((prev) => prev.filter((n) => n.toLowerCase() !== key));
      return;
    }
    if (atLimit) return;
    setPending((prev) => [...prev, name]);
  };

  const addCustom = (raw: string) => {
    const name = normalizeTagLabel(raw);
    if (!name) return;
    const key = name.toLowerCase();
    if (existingLower.has(key) || pendingLower.has(key)) return;
    if (atLimit) return;
    setPending((prev) => [...prev, name]);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom(query);
    }
  };

  const handleConfirm = () => {
    if (pending.length === 0) {
      onClose();
      return;
    }
    onConfirm(pending);
  };

  const isSelected = (name: string) => pendingLower.has(name.toLowerCase());
  const isDisabled = (name: string) =>
    existingLower.has(name.toLowerCase()) || (atLimit && !isSelected(name));

  const renderTag = (name: string) => (
    <button
      key={name}
      type="button"
      className={`${styles.tag} ${isSelected(name) ? styles.tagSelected : ''}`}
      disabled={isDisabled(name)}
      onClick={() => togglePending(name)}
    >
      {name}
    </button>
  );

  if (!activeCategory) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <h3>{title}</h3>
          <button type="button" className={styles.closeBtn} aria-label="关闭" onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.selectedRow}>
            <span className={styles.selectedLabel}>已选择：</span>
            <div className={styles.selectedChips}>
              {pending.length === 0 ? (
                <span className={styles.selectedEmpty}>点击右侧标签添加</span>
              ) : (
                pending.map((name) => (
                  <span key={name} className={styles.chip}>
                    {name}
                    <button
                      type="button"
                      className={styles.chipRemove}
                      aria-label={`移除 ${name}`}
                      onClick={() => togglePending(name)}
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className={styles.toolbarActions}>
              {maxCount !== undefined && (
                <span className={styles.counter}>
                  {totalCount}/{maxCount}
                </span>
              )}
              <Button variant="primary" onClick={handleConfirm}>
                确定
              </Button>
            </div>
          </div>
          <div className={styles.searchRow}>
            <div className={styles.searchWrap}>
              <input
                className={styles.searchInput}
                value={query}
                placeholder={inputPlaceholder}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>

        {atLimit && (
          <p className={styles.limitHint}>
            已达上限 {maxCount} {limitHintUnit}，请删除部分后再添加。
          </p>
        )}

        <div className={styles.body}>
          <ul className={styles.categories}>
            {catalog.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  className={`${styles.categoryBtn} ${
                    !searchResults && activeCategoryId === cat.id ? styles.categoryActive : ''
                  }`}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setQuery('');
                  }}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.content}>
            {searchResults ? (
              searchResults.length === 0 ? (
                <p className={styles.emptySearch}>{emptySearchHint(query.trim())}</p>
              ) : (
                <section className={styles.group}>
                  <h4 className={styles.groupTitle}>搜索结果</h4>
                  <div className={styles.tagCloud}>{searchResults.map(renderTag)}</div>
                </section>
              )
            ) : (
              activeCategory.groups.map((group) => (
                <section key={group.title} className={styles.group}>
                  <h4 className={styles.groupTitle}>{group.title}</h4>
                  <div className={styles.tagCloud}>{group.items.map(renderTag)}</div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
