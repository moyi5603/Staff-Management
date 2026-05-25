import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CERTIFICATE_CATALOG as initialCatalog } from '../data/certificateCatalog';
import type { CatalogCategory } from '../data/catalogTypes';
import { cloneCatalog, newCatalogCategoryId } from '../utils/catalogUtils';

interface CertificateCatalogContextValue {
  catalog: CatalogCategory[];
  addCategory: (name: string) => string;
  updateCategory: (id: string, name: string) => void;
  removeCategory: (id: string) => void;
  addGroup: (categoryId: string, title: string) => void;
  updateGroup: (categoryId: string, groupIndex: number, title: string) => void;
  removeGroup: (categoryId: string, groupIndex: number) => void;
  addCertificateName: (categoryId: string, groupIndex: number, name: string) => void;
  removeCertificateName: (categoryId: string, groupIndex: number, nameIndex: number) => void;
}

const CertificateCatalogContext = createContext<CertificateCatalogContextValue | null>(null);

export function CertificateCatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogCategory[]>(() => cloneCatalog(initialCatalog));

  const patchCategory = useCallback(
    (categoryId: string, updater: (cat: CatalogCategory) => CatalogCategory) => {
      setCatalog((prev) => prev.map((c) => (c.id === categoryId ? updater(c) : c)));
    },
    [],
  );

  const addCategory = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return '';
    const id = newCatalogCategoryId('cert-cat');
    setCatalog((prev) => [...prev, { id, name: trimmed, groups: [] }]);
    return id;
  }, []);

  const updateCategory = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCatalog((prev) => prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c)));
  }, []);

  const removeCategory = useCallback((id: string) => {
    setCatalog((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addGroup = useCallback(
    (categoryId: string, title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      patchCategory(categoryId, (cat) => ({
        ...cat,
        groups: [...cat.groups, { title: trimmed, items: [] }],
      }));
    },
    [patchCategory],
  );

  const updateGroup = useCallback(
    (categoryId: string, groupIndex: number, title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      patchCategory(categoryId, (cat) => ({
        ...cat,
        groups: cat.groups.map((g, i) => (i === groupIndex ? { ...g, title: trimmed } : g)),
      }));
    },
    [patchCategory],
  );

  const removeGroup = useCallback(
    (categoryId: string, groupIndex: number) => {
      patchCategory(categoryId, (cat) => ({
        ...cat,
        groups: cat.groups.filter((_, i) => i !== groupIndex),
      }));
    },
    [patchCategory],
  );

  const addCertificateName = useCallback(
    (categoryId: string, groupIndex: number, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      patchCategory(categoryId, (cat) => ({
        ...cat,
        groups: cat.groups.map((g, i) =>
          i === groupIndex ? { ...g, items: [...g.items, trimmed] } : g,
        ),
      }));
    },
    [patchCategory],
  );

  const removeCertificateName = useCallback(
    (categoryId: string, groupIndex: number, nameIndex: number) => {
      patchCategory(categoryId, (cat) => ({
        ...cat,
        groups: cat.groups.map((g, i) =>
          i === groupIndex ? { ...g, items: g.items.filter((_, j) => j !== nameIndex) } : g,
        ),
      }));
    },
    [patchCategory],
  );

  const value = useMemo(
    () => ({
      catalog,
      addCategory,
      updateCategory,
      removeCategory,
      addGroup,
      updateGroup,
      removeGroup,
      addCertificateName,
      removeCertificateName,
    }),
    [
      catalog,
      addCategory,
      updateCategory,
      removeCategory,
      addGroup,
      updateGroup,
      removeGroup,
      addCertificateName,
      removeCertificateName,
    ],
  );

  return (
    <CertificateCatalogContext.Provider value={value}>{children}</CertificateCatalogContext.Provider>
  );
}

export function useCertificateCatalog() {
  const ctx = useContext(CertificateCatalogContext);
  if (!ctx) throw new Error('useCertificateCatalog must be used within CertificateCatalogProvider');
  return ctx;
}
