import type { Department } from '../types';

export type DropPosition = 'before' | 'after' | 'inside';

export const ROOT_DEPARTMENT_ID = 'dept-root';

export function cloneDepartmentTree(tree: Department[]): Department[] {
  return JSON.parse(JSON.stringify(tree)) as Department[];
}

export function flattenDepartmentTree(nodes: Department[], result: Department[] = []): Department[] {
  for (const node of nodes) {
    result.push(node);
    if (node.children?.length) flattenDepartmentTree(node.children, result);
  }
  return result;
}

export function findDepartment(
  tree: Department[],
  id: string,
): { node: Department; parent: Department | null; siblings: Department[]; index: number } | null {
  function search(
    nodes: Department[],
    parent: Department | null,
  ): { node: Department; parent: Department | null; siblings: Department[]; index: number } | null {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        return { node: nodes[i], parent, siblings: nodes, index: i };
      }
      if (nodes[i].children?.length) {
        const found = search(nodes[i].children!, nodes[i]);
        if (found) return found;
      }
    }
    return null;
  }
  return search(tree, null);
}

export function isDescendant(tree: Department[], ancestorId: string, nodeId: string): boolean {
  const ancestor = findDepartment(tree, ancestorId);
  if (!ancestor?.node.children?.length) return false;

  function walk(nodes: Department[]): boolean {
    for (const n of nodes) {
      if (n.id === nodeId) return true;
      if (n.children?.length && walk(n.children)) return true;
    }
    return false;
  }

  return walk(ancestor.node.children);
}

export function moveDepartment(
  tree: Department[],
  dragId: string,
  targetId: string,
  position: DropPosition,
): Department[] {
  if (dragId === targetId) return tree;
  if (dragId === ROOT_DEPARTMENT_ID) return tree;

  const next = cloneDepartmentTree(tree);
  if (isDescendant(next, dragId, targetId)) return tree;

  const dragInfo = findDepartment(next, dragId);
  if (!dragInfo) return tree;

  const [removed] = dragInfo.siblings.splice(dragInfo.index, 1);
  const moved: Department = { ...removed };

  const targetInfo = findDepartment(next, targetId);
  if (!targetInfo) return tree;

  if (position === 'inside') {
    if (!targetInfo.node.children) targetInfo.node.children = [];
    moved.parentId = targetInfo.node.id;
    targetInfo.node.children.push(moved);
  } else {
    moved.parentId = targetInfo.parent?.id ?? null;
    const insertIndex = position === 'before' ? targetInfo.index : targetInfo.index + 1;
    targetInfo.siblings.splice(insertIndex, 0, moved);
  }

  return next;
}

export function createDepartmentId(): string {
  return `dept-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function collectSubtree(node: Department): { ids: string[]; names: string[] } {
  const ids: string[] = [node.id];
  const names: string[] = [node.name];
  if (node.children?.length) {
    for (const child of node.children) {
      const sub = collectSubtree(child);
      ids.push(...sub.ids);
      names.push(...sub.names);
    }
  }
  return { ids, names };
}

export function findDepartmentNode(tree: Department[], id: string): Department | null {
  for (const node of flattenDepartmentTree(tree)) {
    if (node.id === id) return node;
  }
  return null;
}

/** 按关键词过滤树，保留匹配节点及其祖先路径 */
export function filterDepartmentTreeByKeyword(nodes: Department[], keyword: string): Department[] {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return nodes;

  function filterList(list: Department[]): Department[] {
    const result: Department[] = [];
    for (const node of list) {
      const nameMatch = node.name.toLowerCase().includes(kw);
      const filteredChildren = node.children?.length ? filterList(node.children) : [];
      if (nameMatch || filteredChildren.length > 0) {
        result.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
        });
      }
    }
    return result;
  }

  return filterList(nodes);
}

export function getAllExpandableIds(tree: Department[]): string[] {
  const ids: string[] = [];
  function walk(nodes: Department[]) {
    for (const n of nodes) {
      if (n.children?.length) {
        ids.push(n.id);
        walk(n.children);
      }
    }
  }
  walk(tree);
  return ids;
}

export function addDepartment(
  tree: Department[],
  parentId: string,
  dept: Omit<Department, 'id' | 'parentId' | 'children'> & { id?: string },
): Department[] {
  const next = cloneDepartmentTree(tree);
  const parent = findDepartment(next, parentId);
  if (!parent) return tree;

  const newDept: Department = {
    id: dept.id ?? createDepartmentId(),
    name: dept.name,
    parentId,
    leaderId: dept.leaderId,
    email: dept.email,
    description: dept.description,
    culture: dept.culture,
    functionDetail: dept.functionDetail,
    performanceIndicators: dept.performanceIndicators,
    status: dept.status ?? '正常',
    employeeCount: dept.employeeCount ?? 0,
    children: [],
  };

  if (!parent.node.children) parent.node.children = [];
  parent.node.children.push(newDept);
  return next;
}

export function updateDepartment(
  tree: Department[],
  id: string,
  updates: Partial<Omit<Department, 'id' | 'parentId'>>,
): Department[] {
  const next = cloneDepartmentTree(tree);
  const info = findDepartment(next, id);
  if (!info) return tree;

  const { children: _c, ...rest } = updates;
  Object.assign(info.node, rest);
  return next;
}

export function removeDepartment(tree: Department[], id: string): Department[] {
  if (id === ROOT_DEPARTMENT_ID) return tree;
  const next = cloneDepartmentTree(tree);
  const info = findDepartment(next, id);
  if (!info) return tree;
  info.siblings.splice(info.index, 1);
  return next;
}

export function getDropPosition(
  event: { clientY: number },
  rowEl: HTMLElement,
  isRoot: boolean,
): DropPosition {
  if (isRoot) return 'inside';

  const rect = rowEl.getBoundingClientRect();
  const offsetY = event.clientY - rect.top;
  const ratio = offsetY / rect.height;

  if (ratio < 0.28) return 'before';
  if (ratio > 0.72) return 'after';
  return 'inside';
}
