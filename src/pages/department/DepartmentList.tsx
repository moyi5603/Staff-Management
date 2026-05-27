import { useCallback, useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { departments, employees } from '../../mock/data';
import type { Department } from '../../types';
import {
  ROOT_DEPARTMENT_ID,
  addDepartment,
  cloneDepartmentTree,
  flattenDepartmentTree,
  getAllExpandableIds,
  getDropPosition,
  moveDepartment,
  removeDepartment,
  updateDepartment,
  type DropPosition,
} from '../../utils/departmentTree';
import { DepartmentFormModal, type DepartmentFormValues } from './DepartmentFormModal';
import styles from './DepartmentList.module.css';

interface DropHint {
  targetId: string;
  position: DropPosition;
}

type FormModalState =
  | { type: 'create'; parentId: string }
  | { type: 'createChild'; parentId: string }
  | { type: 'edit'; department: Department };

export function DepartmentList() {
  const [tree, setTree] = useState<Department[]>(() => cloneDepartmentTree(departments));
  const [selectedId, setSelectedId] = useState<string | null>(departments[0]?.children?.[0]?.id ?? null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(getAllExpandableIds(cloneDepartmentTree(departments))),
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropHint, setDropHint] = useState<DropHint | null>(null);
  const [formModal, setFormModal] = useState<FormModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flatDepts = useMemo(() => flattenDepartmentTree(tree), [tree]);
  const deptById = useMemo(() => new Map(flatDepts.map((d) => [d.id, d])), [flatDepts]);
  const selected = selectedId ? deptById.get(selectedId) ?? null : null;
  const parentDept = selected?.parentId ? deptById.get(selected.parentId) : undefined;
  const root = tree[0];

  const parentOptions = useMemo(
    () => flatDepts.map((d) => ({ id: d.id, name: d.name })),
    [flatDepts],
  );

  const showToastMsg = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const handleMove = useCallback((dragId: string, targetId: string, position: DropPosition) => {
    setTree((prev) => moveDepartment(prev, dragId, targetId, position));
    showToastMsg('部门位置已更新');
  }, [showToastMsg]);

  const clearDrag = useCallback(() => {
    setDraggingId(null);
    setDropHint(null);
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = () => setExpandedIds(new Set(getAllExpandableIds(tree)));
  const collapseAll = () => setExpandedIds(new Set([ROOT_DEPARTMENT_ID]));

  const handleSaveForm = (values: DepartmentFormValues) => {
    if (!formModal) return;

    if (formModal.type === 'edit') {
      setTree((prev) =>
        updateDepartment(prev, formModal.department.id, {
          name: values.name,
          leaderId: values.leaderId || undefined,
          leaderName: values.leaderName || undefined,
          email: values.email || undefined,
          phone: values.phone || undefined,
          description: values.description || undefined,
          culture: values.culture || undefined,
          functionDetail: values.functionDetail || undefined,
          status: values.status,
          performanceIndicators: values.performanceIndicators || undefined,
        }),
      );
      showToastMsg('部门信息已保存');
    } else {
      const parentId = formModal.type === 'createChild' ? formModal.parentId : values.parentId;
      setTree((prev) => {
        const next = addDepartment(prev, parentId, {
          name: values.name,
          leaderId: values.leaderId || undefined,
          leaderName: values.leaderName || undefined,
          email: values.email || undefined,
          phone: values.phone || undefined,
          description: values.description || undefined,
          culture: values.culture || undefined,
          functionDetail: values.functionDetail || undefined,
          status: values.status,
          performanceIndicators: values.performanceIndicators || undefined,
          employeeCount: 0,
        });
        const created = flattenDepartmentTree(next).find(
          (d) => d.name === values.name && d.parentId === parentId,
        );
        if (created) setSelectedId(created.id);
        return next;
      });
      setExpandedIds((prev) => new Set([...prev, parentId]));
      showToastMsg('部门已创建');
    }
    setFormModal(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const name = deleteTarget.name;
    setTree((prev) => {
      const next = removeDepartment(prev, deleteTarget.id);
      if (selectedId === deleteTarget.id) {
        setSelectedId(next[0]?.children?.[0]?.id ?? null);
      }
      return next;
    });
    setDeleteTarget(null);
    showToastMsg(`已删除「${name}」`);
  };

  const tryDelete = (dept: Department) => {
    if (dept.id === ROOT_DEPARTMENT_ID) {
      showToastMsg('公司总部不可删除');
      return;
    }
    if (dept.employeeCount > 0) {
      showToastMsg(`「${dept.name}」仍有 ${dept.employeeCount} 名在职员工，请先转移后再删除`);
      return;
    }
    if (dept.children?.length) {
      showToastMsg(`「${dept.name}」下仍有 ${dept.children.length} 个子部门，请先删除或移走子部门`);
      return;
    }
    setDeleteTarget(dept);
  };

  const getFormModalProps = () => {
    if (!formModal) return null;
    if (formModal.type === 'edit') {
      return {
        title: `编辑部门：${formModal.department.name}`,
        initial: formModal.department,
        parentId: formModal.department.parentId ?? ROOT_DEPARTMENT_ID,
        lockParent: formModal.department.id === ROOT_DEPARTMENT_ID,
      };
    }
    if (formModal.type === 'createChild') {
      const parent = deptById.get(formModal.parentId);
      return {
        title: `新增子部门（上级：${parent?.name ?? ''}）`,
        parentId: formModal.parentId,
        lockParent: true,
      };
    }
    return {
      title: '新增部门',
      parentId: ROOT_DEPARTMENT_ID,
      lockParent: false,
    };
  };

  const formProps = getFormModalProps();

  return (
    <>
      {toast && <div className={styles.toast}>{toast}</div>}

      <PageHeader
        title="部门管理"
        actions={
          <Button variant="primary" onClick={() => setFormModal({ type: 'create', parentId: ROOT_DEPARTMENT_ID })}>
            + 新增部门
          </Button>
        }
      />

      <div className={styles.split}>
        <Card className={styles.treePanel}>
          <div className={styles.treeActions}>
            <Button variant="text" onClick={expandAll}>
              展开全部
            </Button>
            <Button variant="text" onClick={collapseAll}>
              收起全部
            </Button>
          </div>
          <p className={styles.dragHint}>拖拽 ⋮⋮ 可调整同级排序；拖入部门名称上可变为子部门</p>
          {root && (
            <DeptTree
              node={root}
              selectedId={selectedId ?? undefined}
              onSelect={(d) => setSelectedId(d.id)}
              depth={0}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              draggingId={draggingId}
              dropHint={dropHint}
              onDragStart={setDraggingId}
              onDragHint={setDropHint}
              onDragEnd={clearDrag}
              onMove={handleMove}
            />
          )}
        </Card>

        <Card className={styles.detailPanel}>
          {selected ? (
            <>
              <h3 className={styles.detailTitle}>部门详情</h3>
              <dl className={styles.dl}>
                <dt>部门名称</dt>
                <dd>{selected.name}</dd>
                <dt>上级部门</dt>
                <dd>{parentDept?.name ?? (selected.parentId ? '—' : '无')}</dd>
                <dt>部门负责人</dt>
                <dd>
                  {selected.leaderName ??
                    employees.find((e) => e.id === selected.leaderId)?.name ??
                    '—'}
                </dd>
                <dt>部门邮箱</dt>
                <dd>
                  {selected.email ? (
                    <a href={`mailto:${selected.email}`} className={styles.emailLink}>
                      {selected.email}
                    </a>
                  ) : (
                    '—'
                  )}
                </dd>
                <dt>联系电话</dt>
                <dd>{selected.phone ?? '—'}</dd>
                <dt>部门简介</dt>
                <dd>{selected.description ?? '—'}</dd>
                <dt>部门文化</dt>
                <dd className={styles.textBlock}>{selected.culture ?? '—'}</dd>
                <dt>部门职能详细介绍</dt>
                <dd className={styles.textBlock}>{selected.functionDetail ?? '—'}</dd>
                <dt>部门绩效指标</dt>
                <dd className={styles.textBlock}>{selected.performanceIndicators ?? '—'}</dd>
                <dt>状态</dt>
                <dd>{selected.status}</dd>
              </dl>
              <p className={styles.stats}>
                在职员工：{selected.employeeCount} 人 · 子部门：{selected.children?.length ?? 0} 个
              </p>
              <div className={styles.detailActions}>
                <Button
                  variant="primary"
                  onClick={() => setFormModal({ type: 'edit', department: selected })}
                  disabled={selected.id === ROOT_DEPARTMENT_ID}
                >
                  编辑部门
                </Button>
                <Button
                  variant="default"
                  onClick={() => setFormModal({ type: 'createChild', parentId: selected.id })}
                >
                  新增子部门
                </Button>
                <Button
                  variant="danger"
                  onClick={() => tryDelete(selected)}
                  disabled={selected.id === ROOT_DEPARTMENT_ID}
                >
                  删除部门
                </Button>
              </div>
            </>
          ) : (
            <p className={styles.placeholder}>请选择左侧部门查看详情</p>
          )}
        </Card>
      </div>

      {formProps && (
        <DepartmentFormModal
          {...formProps}
          parentOptions={parentOptions}
          onSave={handleSaveForm}
          onClose={() => setFormModal(null)}
        />
      )}


      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>确认删除部门</h3>
            <p className={styles.confirmText}>
              确定要删除「{deleteTarget.name}」吗？删除后不可恢复。
            </p>
            <div className={styles.modalActions}>
              <Button variant="default" onClick={() => setDeleteTarget(null)}>
                取消
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                确认删除
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DeptTree({
  node,
  selectedId,
  onSelect,
  depth,
  expandedIds,
  onToggleExpand,
  draggingId,
  dropHint,
  onDragStart,
  onDragHint,
  onDragEnd,
  onMove,
}: {
  node: Department;
  selectedId?: string;
  onSelect: (d: Department) => void;
  depth: number;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  draggingId: string | null;
  dropHint: DropHint | null;
  onDragStart: (id: string) => void;
  onDragHint: (hint: DropHint | null) => void;
  onDragEnd: () => void;
  onMove: (dragId: string, targetId: string, position: DropPosition) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isRoot = node.id === ROOT_DEPARTMENT_ID;
  const isExpanded = !hasChildren || expandedIds.has(node.id);

  const isDragging = draggingId === node.id;
  const isDropTarget = dropHint?.targetId === node.id;
  const dropPosition = isDropTarget ? dropHint.position : null;

  const rowClass = [
    styles.treeRow,
    selectedId === node.id ? styles.selected : '',
    isDragging ? styles.dragging : '',
    dropPosition === 'before' ? styles.dropBefore : '',
    dropPosition === 'after' ? styles.dropAfter : '',
    dropPosition === 'inside' ? styles.dropInside : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggingId || draggingId === node.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const position = getDropPosition(e, e.currentTarget, isRoot);
    onDragHint({ targetId: node.id, position });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggingId || draggingId === node.id) return;
    const position = getDropPosition(e, e.currentTarget, isRoot);
    onMove(draggingId, node.id, position);
    onDragEnd();
  };

  return (
    <div className={styles.treeNode} style={{ paddingLeft: depth * 16 }}>
      <div
        className={rowClass}
        onDragOver={handleDragOver}
        onDragLeave={() => onDragHint(null)}
        onDrop={handleDrop}
      >
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

        {!isRoot && (
          <span
            className={styles.dragHandle}
            draggable
            title="拖拽调整顺序或层级"
            onDragStart={(e) => {
              e.stopPropagation();
              onDragStart(node.id);
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', node.id);
            }}
            onDragEnd={onDragEnd}
          >
            ⋮⋮
          </span>
        )}

        <button type="button" className={styles.deptBtn} onClick={() => onSelect(node)}>
          🏢 {node.name}
        </button>
      </div>

      {hasChildren &&
        isExpanded &&
        node.children?.map((child) => (
          <DeptTree
            key={child.id}
            node={child}
            selectedId={selectedId}
            onSelect={onSelect}
            depth={depth + 1}
            expandedIds={expandedIds}
            onToggleExpand={onToggleExpand}
            draggingId={draggingId}
            dropHint={dropHint}
            onDragStart={onDragStart}
            onDragHint={onDragHint}
            onDragEnd={onDragEnd}
            onMove={onMove}
          />
        ))}
    </div>
  );
}
