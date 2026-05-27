import { useCallback, useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { ListToolbarIcons } from '../../components/ListToolbarIcons';
import { PageHeader } from '../../components/PageHeader';
import { positions as initialPositions } from '../../mock/data';
import type { Position } from '../../types';
import {
  emptyPositionListFilters,
  exportPositionsCsv,
  filterPositions,
  type PositionListFilters,
} from '../../utils/positionFilters';
import { PositionDetailModal } from './PositionDetailModal';
import { PositionFilterBar } from './PositionFilterBar';
import { PositionFormModal, type PositionFormValues } from './PositionFormModal';
import styles from '../employee/EmployeeList.module.css';
import positionStyles from './PositionList.module.css';

type FormModalState = { type: 'create' } | { type: 'edit'; position: Position };

type DeleteTarget =
  | { type: 'single'; position: Position }
  | { type: 'batch'; positions: Position[] };

function formatDateTime(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function nextPositionNo(list: Position[]): number {
  if (list.length === 0) return 1;
  return Math.max(...list.map((p) => p.positionNo)) + 1;
}

function buildPosition(values: PositionFormValues, list: Position[], existing?: Position): Position {
  return {
    id: existing?.id ?? `pos-${Date.now()}`,
    positionNo: existing?.positionNo ?? nextPositionNo(list),
    code: values.code,
    name: values.name,
    sortOrder: values.sortOrder,
    status: values.status,
    createdAt: existing?.createdAt ?? formatDateTime(),
    departmentId: existing?.departmentId ?? '',
    departmentName: existing?.departmentName ?? '—',
    employeeCount: existing?.employeeCount ?? 0,
    coreDuties: values.coreDuties,
    detailDuty: values.detailDuty || undefined,
    performanceIndicators: values.performanceIndicators || undefined,
    remark: values.remark || undefined,
  };
}

export function PositionList() {
  const [list, setList] = useState<Position[]>(() => initialPositions.map((p) => ({ ...p })));
  const [draftFilters, setDraftFilters] = useState<PositionListFilters>(emptyPositionListFilters);
  const [appliedFilters, setAppliedFilters] = useState<PositionListFilters>(emptyPositionListFilters);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [formModal, setFormModal] = useState<FormModalState | null>(null);
  const [detailPosition, setDetailPosition] = useState<Position | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [filterVisible, setFilterVisible] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const filteredList = useMemo(
    () => filterPositions(list, appliedFilters),
    [list, appliedFilters],
  );

  const sortedList = useMemo(
    () =>
      [...filteredList].sort(
        (a, b) => a.sortOrder - b.sortOrder || a.positionNo - b.positionNo,
      ),
    [filteredList],
  );

  const selectedPositions = useMemo(
    () => sortedList.filter((p) => selected.has(p.id)),
    [sortedList, selected],
  );

  const allSelected = sortedList.length > 0 && selected.size === sortedList.length;
  const canBatchEdit = selected.size === 1;
  const canBatchDelete = selected.size > 0;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(sortedList.map((p) => p.id)));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters });
    setSelected(new Set());
  };

  const handleReset = () => {
    const empty = emptyPositionListFilters();
    setDraftFilters(empty);
    setAppliedFilters(empty);
    setSelected(new Set());
  };

  const handleRefresh = () => {
    setList(initialPositions.map((p) => ({ ...p })));
    handleReset();
    showToast('列表已刷新');
  };

  const handleExport = () => {
    exportPositionsCsv(sortedList);
    showToast(`已导出 ${sortedList.length} 条岗位数据`);
  };

  const handleSave = (values: PositionFormValues) => {
    if (formModal?.type === 'edit') {
      const updated = buildPosition(values, list, formModal.position);
      setList((prev) => prev.map((p) => (p.id === formModal.position.id ? updated : p)));
      setDetailPosition((prev) => (prev?.id === updated.id ? updated : prev));
      showToast('岗位信息已保存');
    } else {
      const created = buildPosition(values, list);
      setList((prev) => [...prev, created]);
      showToast('岗位已新增');
    }
    setFormModal(null);
  };

  const openEdit = (position: Position) => {
    setDetailPosition(null);
    setFormModal({ type: 'edit', position });
  };

  const handleBatchEdit = () => {
    if (selectedPositions.length !== 1) return;
    openEdit(selectedPositions[0]);
  };

  const handleBatchDelete = () => {
    if (selectedPositions.length === 0) return;
    setDeleteTarget({ type: 'batch', positions: selectedPositions });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    const targets =
      deleteTarget.type === 'single' ? [deleteTarget.position] : deleteTarget.positions;

    const blocked = targets.filter((p) => p.employeeCount > 0);
    if (blocked.length > 0) {
      showToast(
        blocked.length === 1
          ? `岗位「${blocked[0].name}」下有员工，无法删除`
          : `${blocked.length} 个岗位下有员工，无法删除`,
      );
      setDeleteTarget(null);
      return;
    }

    const ids = new Set(targets.map((p) => p.id));
    setList((prev) => prev.filter((p) => !ids.has(p.id)));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    if (detailPosition && ids.has(detailPosition.id)) setDetailPosition(null);
    showToast(
      targets.length === 1 ? `已删除岗位「${targets[0].name}」` : `已删除 ${targets.length} 个岗位`,
    );
    setDeleteTarget(null);
  };

  const deleteConfirmText = () => {
    if (!deleteTarget) return '';
    if (deleteTarget.type === 'single') {
      const p = deleteTarget.position;
      return `确定删除岗位「${p.name}」（${p.code}）？`;
    }
    const names = deleteTarget.positions.map((p) => p.name).slice(0, 3).join('、');
    const more =
      deleteTarget.positions.length > 3 ? ` 等 ${deleteTarget.positions.length} 项` : '';
    return `确定删除 ${deleteTarget.positions.length} 个岗位：${names}${more}？`;
  };

  return (
    <>
      <PageHeader title="岗位管理" />

      {filterVisible && (
        <Card className={positionStyles.filterCard}>
          <PositionFilterBar
            value={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </Card>
      )}

      <div className={positionStyles.tableToolbar}>
        <div className={positionStyles.toolbarLeft}>
          <Button variant="primary" onClick={() => setFormModal({ type: 'create' })}>
            + 新增
          </Button>
          <Button variant="default" disabled={!canBatchEdit} onClick={handleBatchEdit}>
            修改
          </Button>
          <Button variant="default" disabled={!canBatchDelete} onClick={handleBatchDelete}>
            删除
          </Button>
          <Button variant="default" onClick={handleExport}>
            导出
          </Button>
        </div>
        <ListToolbarIcons
          filterVisible={filterVisible}
          onToggleFilter={() => setFilterVisible((v) => !v)}
          onRefresh={handleRefresh}
        />
      </div>

      {sortedList.length === 0 ? (
        <EmptyState
          title="暂无岗位"
          description="调整筛选条件或新增岗位"
          actions={[
            {
              label: '+ 新增',
              onClick: () => setFormModal({ type: 'create' }),
              primary: true,
            },
          ]}
        />
      ) : (
        <Card className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={`${styles.table} ${positionStyles.positionTable}`}>
              <thead>
                <tr>
                  <th style={{ width: 44 }}>
                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                  </th>
                  <th>岗位编号</th>
                  <th>岗位编码</th>
                  <th>岗位名称</th>
                  <th>所属部门</th>
                  <th>岗位排序</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th className={positionStyles.opsColHead}>操作</th>
                </tr>
              </thead>
              <tbody>
                {sortedList.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 1 ? styles.stripe : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td>{p.positionNo}</td>
                    <td>{p.code}</td>
                    <td>{p.name}</td>
                    <td>{p.departmentName}</td>
                    <td>{p.sortOrder}</td>
                    <td>{p.status}</td>
                    <td className={positionStyles.cellNowrap}>{p.createdAt}</td>
                    <td className={`${styles.ops} ${positionStyles.opsCol}`}>
                      <button type="button" className={positionStyles.opLink} onClick={() => openEdit(p)}>
                        <span className={positionStyles.opIcon} aria-hidden>
                          <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M11.5 1.9a1.2 1.2 0 0 1 1.7 0l1 1a1.2 1.2 0 0 1 0 1.7L5.6 12.2 2.8 13l.8-2.8L11.5 1.9zm1-1a2.2 2.2 0 0 0-3.1 0L2.1 9.2a.6.6 0 0 0-.15.26l-1.2 4.2a.6.6 0 0 0 .74.74l4.2-1.2a.6.6 0 0 0 .26-.15l7.3-7.3a2.2 2.2 0 0 0 0-3.1l-1-1z" />
                          </svg>
                        </span>
                        修改
                      </button>
                      <button
                        type="button"
                        className={positionStyles.opLink}
                        onClick={() => setDeleteTarget({ type: 'single', position: p })}
                      >
                        <span className={positionStyles.opIcon} aria-hidden>
                          <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5.5 6.1v5.8a.6.6 0 0 0 1.2 0V6.1a.6.6 0 0 0-1.2 0zm3 0v5.8a.6.6 0 0 0 1.2 0V6.1a.6.6 0 0 0-1.2 0zm2.5-4.2H4.8l-.7-1.4a.6.6 0 0 0-.54-.4H2.6a.6.6 0 0 0 0 1.2h1.1l.9 1.8h7.1a.6.6 0 0 0 0-1.2zM3.4 6.1v6.4A2.2 2.2 0 0 0 5.6 14.7h4.8a2.2 2.2 0 0 0 2.2-2.2V6.1a.6.6 0 1 0-1.2 0v6.4a1 1 0 0 1-1 1H5.6a1 1 0 0 1-1-1V6.1a.6.6 0 0 0-1.2 0z" />
                          </svg>
                        </span>
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {formModal && (
        <PositionFormModal
          title={formModal.type === 'create' ? '新增岗位' : '编辑岗位'}
          initial={formModal.type === 'edit' ? formModal.position : undefined}
          onSave={handleSave}
          onClose={() => setFormModal(null)}
        />
      )}

      {detailPosition && (
        <PositionDetailModal
          position={detailPosition}
          onEdit={() => openEdit(detailPosition)}
          onClose={() => setDetailPosition(null)}
        />
      )}

      {deleteTarget && (
        <div className={positionStyles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={positionStyles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p className={positionStyles.confirmText}>{deleteConfirmText()}</p>
            <div className={positionStyles.modalActions}>
              <Button variant="default" onClick={() => setDeleteTarget(null)}>
                取消
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                删除
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={positionStyles.toast}>{toast}</div>}
    </>
  );
}
