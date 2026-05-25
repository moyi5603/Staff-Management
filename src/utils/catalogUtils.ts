import type { CatalogCategory } from '../data/catalogTypes';

export function cloneCatalog(list: CatalogCategory[]): CatalogCategory[] {
  return list.map((c) => ({
    ...c,
    groups: c.groups.map((g) => ({ ...g, items: [...g.items] })),
  }));
}

export function countCatalogItems(catalog: CatalogCategory[]): number {
  return catalog.reduce((sum, c) => sum + c.groups.reduce((s, g) => s + g.items.length, 0), 0);
}

export function flattenCatalogNames(catalog: CatalogCategory[]): string[] {
  const names: string[] = [];
  for (const cat of catalog) {
    for (const group of cat.groups) {
      for (const name of group.items) {
        if (!names.some((n) => n.toLowerCase() === name.toLowerCase())) {
          names.push(name);
        }
      }
    }
  }
  return names;
}

export function newCatalogCategoryId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

export function moveCatalogCategory(
  list: CatalogCategory[],
  categoryId: string,
  direction: 'up' | 'down',
): CatalogCategory[] {
  const index = list.findIndex((c) => c.id === categoryId);
  if (index < 0) return list;
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
