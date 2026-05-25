import { useCallback, useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { departments, positions as initialPositions } from '../../mock/data';
import type { Position } from '../../types';
import { cloneDepartmentTree, flattenDepartmentTree } from '../../utils/departmentTree';
import { PositionDetailModal } from './PositionDetailModal';
import { PositionFormModal, type PositionFormValues } from './PositionFormModal';
import styles from '../employee/EmployeeList.module.css';
import positionStyles from './PositionList.module.css';

type FormModalState = { type: 'create' } | { type: 'edit'; position: Position };

function buildPosition(values: PositionFormValues, deptName: string, existing?: Position): Position {
  return {
    id: existing?.id ?? `pos-${Date.now()}`,
    name: values.name,
    departmentId: values.departmentId,
    departmentName: deptName,
    employeeCount: existing?.employeeCount ?? 0,
    coreDuties: values.coreDuties,
    detailDuty: values.detailDuty || undefined,
    performanceIndicators: values.performanceIndicators || undefined,
  };
}

export function PositionList() {
  const [list, setList] = useState<Position[]>(() => initialPositions.map((p) => ({ ...p })));
  const [formModal, setFormModal] = useState<FormModalState | null>(null);
  const [detailPosition, setDetailPosition] = useState<Position | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const departmentOptions = useMemo(() => {
    const flat = flattenDepartmentTree(cloneDepartmentTree(departments));
    return flat
      .filter((d) => d.id !== 'dept-root')
      .map((d) => ({ id: d.id, name: d.name }));
  }, []);

  const deptNameById = useMemo(
    () => new Map(departmentOptions.map((d) => [d.id, d.name])),
    [departmentOptions],
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSave = (values: PositionFormValues) => {
    const deptName = deptNameById.get(values.departmentId) ?? '—';

    if (formModal?.type === 'edit') {
      setList((prev) =>
        prev.map((p) =>
          p.id === formModal.position.id ? buildPosition(values, deptName, formModal.position) : p,
        ),
      );
      setDetailPosition((prev) =>
        prev?.id === formModal.position.id
          ? buildPosition(values, deptName, formModal.position)
          : prev,
      );
      showToast('岗位信息已保存');
    } else {
      const created = buildPosition(values, deptName);
      setList((prev) => [...prev, created]);
      showToast('岗位已新增');
    }
    setFormModal(null);
  };

  const openEdit = (position: Position) => {
    setDetailPosition(null);
    setFormModal({ type: 'edit', position });
  };

  return (
    <>
      <PageHeader
        title="岗位管理"
        actions={
          <Button variant="primary" onClick={() => setFormModal({ type: 'create' })}>
            + 新增岗位
          </Button>
        }
      />
      <Card className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>序号</th>
              <th>岗位名称</th>
              <th>所属部门</th>
              <th>员工人数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p, i) => (
              <tr key={p.id} className={i % 2 === 1 ? styles.stripe : ''}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.departmentName}</td>
                <td>{p.employeeCount}人</td>
                <td className={styles.ops}>
                  <Button variant="text" onClick={() => setDetailPosition(p)}>
                    详情
                  </Button>
                  <Button variant="text" onClick={() => openEdit(p)}>
                    编辑
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {formModal && (
        <PositionFormModal
          title={formModal.type === 'create' ? '新增岗位' : '编辑岗位'}
          initial={formModal.type === 'edit' ? formModal.position : undefined}
          departmentOptions={departmentOptions}
          defaultDepartmentId={departmentOptions[0]?.id}
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

      {toast && <div className={positionStyles.toast}>{toast}</div>}
    </>
  );
}
