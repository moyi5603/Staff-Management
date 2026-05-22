import { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { departments, employees } from '../../mock/data';
import type { Department } from '../../types';
import styles from './DepartmentList.module.css';

export function DepartmentList() {
  const [selected, setSelected] = useState<Department | null>(departments[0]?.children?.[0] ?? null);
  const root = departments[0];

  return (
    <>
      <PageHeader
        title="部门管理"
        actions={
          <>
            <Button variant="primary">+ 新增部门</Button>
            <Button variant="default">+ 导入部门</Button>
          </>
        }
      />

      <div className={styles.split}>
        <Card className={styles.treePanel}>
          <div className={styles.treeActions}>
            <Button variant="text">展开全部</Button>
            <Button variant="text">收起全部</Button>
          </div>
          {root && <DeptTree node={root} selectedId={selected?.id} onSelect={setSelected} depth={0} />}
        </Card>

        <Card className={styles.detailPanel}>
          {selected ? (
            <>
              <h3 className={styles.detailTitle}>部门详情</h3>
              <dl className={styles.dl}>
                <dt>部门名称</dt>
                <dd>{selected.name}</dd>
                <dt>上级部门</dt>
                <dd>{selected.parentId === 'dept-root' ? '公司总部' : '—'}</dd>
                <dt>部门负责人</dt>
                <dd>{employees.find((e) => e.id === selected.leaderId)?.name ?? '—'}</dd>
                <dt>HRBP</dt>
                <dd>{employees.find((e) => e.id === selected.hrbpId)?.name ?? '—'}</dd>
                <dt>行政接口人</dt>
                <dd>{employees.find((e) => e.id === selected.adminContactId)?.name ?? '—'}</dd>
                <dt>部门简介</dt>
                <dd>{selected.description ?? '—'}</dd>
                <dt>状态</dt>
                <dd>
                  <StatusBadge status={selected.status} />
                </dd>
              </dl>
              <p className={styles.stats}>
                在职员工：{selected.employeeCount} 人 · 子部门：{selected.children?.length ?? 0} 个
              </p>
              <div className={styles.detailActions}>
                <Button variant="primary">编辑部门</Button>
                <Button variant="default">新增子部门</Button>
                <Button variant="danger">删除部门</Button>
              </div>
            </>
          ) : (
            <p className={styles.placeholder}>请选择左侧部门查看详情</p>
          )}
        </Card>
      </div>
    </>
  );
}

function DeptTree({
  node,
  selectedId,
  onSelect,
  depth,
}: {
  node: Department;
  selectedId?: string;
  onSelect: (d: Department) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={styles.treeNode} style={{ paddingLeft: depth * 16 }}>
      <div className={`${styles.treeRow} ${selectedId === node.id ? styles.selected : ''}`}>
        {hasChildren && (
          <button type="button" className={styles.expandBtn} onClick={() => setExpanded((e) => !e)}>
            {expanded ? '▾' : '▸'}
          </button>
        )}
        <button type="button" className={styles.deptBtn} onClick={() => onSelect(node)}>
          🏢 {node.name}
        </button>
      </div>
      {expanded &&
        node.children?.map((child) => (
          <DeptTree key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
        ))}
    </div>
  );
}
