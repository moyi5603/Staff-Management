import { useMemo, useState } from 'react';
import { Card } from './Card';
import type { Department } from '../types';
import {
  ROOT_DEPARTMENT_ID,
  filterDepartmentTreeByKeyword,
  getAllExpandableIds,
} from '../utils/departmentTree';
import styles from './DepartmentTreeFilter.module.css';

interface Props {
  tree: Department[];
  selectedId: string | null;
  onSelect: (dept: Department | null) => void;
  compact?: boolean;
}

export function DepartmentTreeFilter({ tree, selectedId, onSelect, compact = false }: Props) {
  const [keyword, setKeyword] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(getAllExpandableIds(tree)),
  );

  const displayTree = useMemo(
    () => filterDepartmentTreeByKeyword(tree, keyword),
    [tree, keyword],
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(getAllExpandableIds(tree)));
  const collapseAll = () => setExpandedIds(new Set([ROOT_DEPARTMENT_ID]));

  return (
    <Card className={`${styles.panel} ${compact ? styles.compact : ''}`}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon} aria-hidden>
          🔍
        </span>
        <input
          className={styles.searchInput}
          placeholder="请输入部门名称"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            if (e.target.value.trim()) expandAll();
          }}
        />
      </div>
      <div className={styles.treeActions}>
        <button type="button" className={styles.linkBtn} onClick={expandAll}>
          展开
        </button>
        <button type="button" className={styles.linkBtn} onClick={collapseAll}>
          收起
        </button>
      </div>
      <button
        type="button"
        className={`${styles.allBtn} ${selectedId === null ? styles.selected : ''}`}
        onClick={() => onSelect(null)}
      >
        全部员工
      </button>
      <div className={styles.treeScroll}>
        {displayTree.map((node) => (
          <DeptFilterNode
            key={node.id}
            node={node}
            selectedId={selectedId}
            onSelect={onSelect}
            depth={0}
            expandedIds={expandedIds}
            onToggleExpand={toggleExpand}
            forceExpand={Boolean(keyword.trim())}
            compact={compact}
          />
        ))}
        {displayTree.length === 0 && (
          <p className={styles.empty}>未找到匹配的部门</p>
        )}
      </div>
    </Card>
  );
}

function DeptFilterNode({
  node,
  selectedId,
  onSelect,
  depth,
  expandedIds,
  onToggleExpand,
  forceExpand,
  compact,
}: {
  node: Department;
  selectedId: string | null;
  onSelect: (dept: Department | null) => void;
  depth: number;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  forceExpand: boolean;
  compact?: boolean;
}) {
  const indent = compact ? 12 : 16;
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = forceExpand || !hasChildren || expandedIds.has(node.id);
  const isRoot = node.id === ROOT_DEPARTMENT_ID;

  const rowClass = [styles.treeRow, selectedId === node.id ? styles.selected : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.treeNode} style={{ paddingLeft: depth * indent }}>
      <div className={rowClass}>
        {hasChildren ? (
          <button
            type="button"
            className={styles.expandBtn}
            onClick={() => onToggleExpand(node.id)}
            aria-label={isExpanded ? '收起' : '展开'}
          >
            {isExpanded ? '▾' : '▸'}
          </button>
        ) : (
          <span className={styles.expandPlaceholder} />
        )}
        <button
          type="button"
          className={styles.deptBtn}
          onClick={() => onSelect(isRoot ? null : node)}
        >
          {node.name}
        </button>
      </div>
      {hasChildren &&
        isExpanded &&
        node.children?.map((child) => (
          <DeptFilterNode
            key={child.id}
            node={child}
            selectedId={selectedId}
            onSelect={onSelect}
            depth={depth + 1}
            expandedIds={expandedIds}
            onToggleExpand={onToggleExpand}
            forceExpand={forceExpand}
            compact={compact}
          />
        ))}
    </div>
  );
}
