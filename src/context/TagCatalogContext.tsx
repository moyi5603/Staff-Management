import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CatalogCategory } from '../data/catalogTypes';
import { INTEREST_TAG_CATALOG } from '../data/interestTagCatalog';
import { SKILL_TAG_CATALOG } from '../data/skillTagCatalog';
import {
  cloneCatalog,
  flattenCatalogNames,
  moveCatalogCategory,
  newCatalogCategoryId,
} from '../utils/catalogUtils';

export type TagCatalogKind = 'skill' | 'interest';

interface TagCatalogContextValue {
  skillCatalog: CatalogCategory[];
  interestCatalog: CatalogCategory[];
  skillTagNames: string[];
  interestTagNames: string[];
  getCatalog: (kind: TagCatalogKind) => CatalogCategory[];
  addCategory: (kind: TagCatalogKind, name: string) => string;
  updateCategory: (kind: TagCatalogKind, id: string, name: string) => void;
  removeCategory: (kind: TagCatalogKind, id: string) => void;
  moveCategory: (kind: TagCatalogKind, id: string, direction: 'up' | 'down') => void;
  addGroup: (kind: TagCatalogKind, categoryId: string, title: string) => void;
  updateGroup: (kind: TagCatalogKind, categoryId: string, groupIndex: number, title: string) => void;
  removeGroup: (kind: TagCatalogKind, categoryId: string, groupIndex: number) => void;
  addTagName: (kind: TagCatalogKind, categoryId: string, groupIndex: number, name: string) => void;
  removeTagName: (kind: TagCatalogKind, categoryId: string, groupIndex: number, nameIndex: number) => void;
}

const TagCatalogContext = createContext<TagCatalogContextValue | null>(null);

function patchCatalog(
  list: CatalogCategory[],
  categoryId: string,
  updater: (cat: CatalogCategory) => CatalogCategory,
): CatalogCategory[] {
  return list.map((c) => (c.id === categoryId ? updater(c) : c));
}

export function TagCatalogProvider({ children }: { children: ReactNode }) {
  const [skillCatalog, setSkillCatalog] = useState<CatalogCategory[]>(() =>
    cloneCatalog(SKILL_TAG_CATALOG),
  );
  const [interestCatalog, setInterestCatalog] = useState<CatalogCategory[]>(() =>
    cloneCatalog(INTEREST_TAG_CATALOG),
  );

  const getCatalog = useCallback(
    (kind: TagCatalogKind) => (kind === 'skill' ? skillCatalog : interestCatalog),
    [skillCatalog, interestCatalog],
  );

  const setCatalog = useCallback((kind: TagCatalogKind, next: CatalogCategory[]) => {
    if (kind === 'skill') setSkillCatalog(next);
    else setInterestCatalog(next);
  }, []);

  const addCategory = useCallback(
    (kind: TagCatalogKind, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return '';
      const id = newCatalogCategoryId(kind === 'skill' ? 'skill-cat' : 'interest-cat');
      setCatalog(kind, [...getCatalog(kind), { id, name: trimmed, groups: [] }]);
      return id;
    },
    [getCatalog, setCatalog],
  );

  const updateCategory = useCallback(
    (kind: TagCatalogKind, id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setCatalog(
        kind,
        getCatalog(kind).map((c) => (c.id === id ? { ...c, name: trimmed } : c)),
      );
    },
    [getCatalog, setCatalog],
  );

  const removeCategory = useCallback(
    (kind: TagCatalogKind, id: string) => {
      setCatalog(
        kind,
        getCatalog(kind).filter((c) => c.id !== id),
      );
    },
    [getCatalog, setCatalog],
  );

  const moveCategory = useCallback(
    (kind: TagCatalogKind, id: string, direction: 'up' | 'down') => {
      setCatalog(kind, moveCatalogCategory(getCatalog(kind), id, direction));
    },
    [getCatalog, setCatalog],
  );

  const addGroup = useCallback(
    (kind: TagCatalogKind, categoryId: string, title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      setCatalog(
        kind,
        patchCatalog(getCatalog(kind), categoryId, (cat) => ({
          ...cat,
          groups: [...cat.groups, { title: trimmed, items: [] }],
        })),
      );
    },
    [getCatalog, setCatalog],
  );

  const updateGroup = useCallback(
    (kind: TagCatalogKind, categoryId: string, groupIndex: number, title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      setCatalog(
        kind,
        patchCatalog(getCatalog(kind), categoryId, (cat) => ({
          ...cat,
          groups: cat.groups.map((g, i) => (i === groupIndex ? { ...g, title: trimmed } : g)),
        })),
      );
    },
    [getCatalog, setCatalog],
  );

  const removeGroup = useCallback(
    (kind: TagCatalogKind, categoryId: string, groupIndex: number) => {
      setCatalog(
        kind,
        patchCatalog(getCatalog(kind), categoryId, (cat) => ({
          ...cat,
          groups: cat.groups.filter((_, i) => i !== groupIndex),
        })),
      );
    },
    [getCatalog, setCatalog],
  );

  const addTagName = useCallback(
    (kind: TagCatalogKind, categoryId: string, groupIndex: number, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setCatalog(
        kind,
        patchCatalog(getCatalog(kind), categoryId, (cat) => ({
          ...cat,
          groups: cat.groups.map((g, i) =>
            i === groupIndex ? { ...g, items: [...g.items, trimmed] } : g,
          ),
        })),
      );
    },
    [getCatalog, setCatalog],
  );

  const removeTagName = useCallback(
    (kind: TagCatalogKind, categoryId: string, groupIndex: number, nameIndex: number) => {
      setCatalog(
        kind,
        patchCatalog(getCatalog(kind), categoryId, (cat) => ({
          ...cat,
          groups: cat.groups.map((g, i) =>
            i === groupIndex ? { ...g, items: g.items.filter((_, j) => j !== nameIndex) } : g,
          ),
        })),
      );
    },
    [getCatalog, setCatalog],
  );

  const skillTagNames = useMemo(() => flattenCatalogNames(skillCatalog), [skillCatalog]);
  const interestTagNames = useMemo(() => flattenCatalogNames(interestCatalog), [interestCatalog]);

  const value = useMemo(
    () => ({
      skillCatalog,
      interestCatalog,
      skillTagNames,
      interestTagNames,
      getCatalog,
      addCategory,
      updateCategory,
      removeCategory,
      moveCategory,
      addGroup,
      updateGroup,
      removeGroup,
      addTagName,
      removeTagName,
    }),
    [
      skillCatalog,
      interestCatalog,
      skillTagNames,
      interestTagNames,
      getCatalog,
      addCategory,
      updateCategory,
      removeCategory,
      moveCategory,
      addGroup,
      updateGroup,
      removeGroup,
      addTagName,
      removeTagName,
    ],
  );

  return <TagCatalogContext.Provider value={value}>{children}</TagCatalogContext.Provider>;
}

export function useTagCatalog() {
  const ctx = useContext(TagCatalogContext);
  if (!ctx) throw new Error('useTagCatalog must be used within TagCatalogProvider');
  return ctx;
}

export function useTagCatalogKind(kind: TagCatalogKind) {
  const ctx = useTagCatalog();
  return useMemo(
    () => ({
      catalog: kind === 'skill' ? ctx.skillCatalog : ctx.interestCatalog,
      tagNames: kind === 'skill' ? ctx.skillTagNames : ctx.interestTagNames,
      addCategory: (name: string) => ctx.addCategory(kind, name),
      updateCategory: (id: string, name: string) => ctx.updateCategory(kind, id, name),
      removeCategory: (id: string) => ctx.removeCategory(kind, id),
      moveCategory: (id: string, direction: 'up' | 'down') => ctx.moveCategory(kind, id, direction),
      addGroup: (categoryId: string, title: string) => ctx.addGroup(kind, categoryId, title),
      updateGroup: (categoryId: string, groupIndex: number, title: string) =>
        ctx.updateGroup(kind, categoryId, groupIndex, title),
      removeGroup: (categoryId: string, groupIndex: number) =>
        ctx.removeGroup(kind, categoryId, groupIndex),
      addTagName: (categoryId: string, groupIndex: number, name: string) =>
        ctx.addTagName(kind, categoryId, groupIndex, name),
      removeTagName: (categoryId: string, groupIndex: number, nameIndex: number) =>
        ctx.removeTagName(kind, categoryId, groupIndex, nameIndex),
    }),
    [ctx, kind],
  );
}
