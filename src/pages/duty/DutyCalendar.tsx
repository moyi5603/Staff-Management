import { useCallback, useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { departments, dutyRecords as initialDutyRecords, employees } from '../../mock/data';
import type { DutyRecord } from '../../types';
import { cloneDepartmentTree, flattenDepartmentTree } from '../../utils/departmentTree';
import { addDays, formatMonthLabel, getMonday, getWeekDays } from '../../utils/dutyCalendar';
import { DutyBatchModal } from './DutyBatchModal';
import { DutyFormModal, type DutyFormValues } from './DutyFormModal';
import styles from './DutyCalendar.module.css';

type FormModalState =
  | { type: 'create'; defaultDate?: string }
  | { type: 'edit'; record: DutyRecord };

function buildRecord(values: DutyFormValues, deptName: string, existing?: DutyRecord): DutyRecord {
  const emp = employees.find((e) => e.id === values.employeeId)!;
  return {
    id: existing?.id ?? `duty-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    departmentId: values.departmentId,
    departmentName: deptName,
    date: values.date,
    employeeId: emp.id,
    employeeName: emp.name,
    phone: emp.phone,
    note: values.note || undefined,
  };
}

export function DutyCalendar() {
  const [records, setRecords] = useState<DutyRecord[]>(() =>
    initialDutyRecords.map((r) => ({ ...r })),
  );
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [deptFilter, setDeptFilter] = useState('');
  const [formModal, setFormModal] = useState<FormModalState | null>(null);
  const [showBatch, setShowBatch] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const departmentOptions = useMemo(() => {
    const flat = flattenDepartmentTree(cloneDepartmentTree(departments));
    return flat.filter((d) => d.id !== 'dept-root').map((d) => ({ id: d.id, name: d.name }));
  }, []);

  const deptNameById = useMemo(
    () => new Map(departmentOptions.map((d) => [d.id, d.name])),
    [departmentOptions],
  );

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const monthLabel = useMemo(() => formatMonthLabel(weekStart), [weekStart]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => !deptFilter || r.departmentId === deptFilter);
  }, [records, deptFilter]);

  const calendarData = useMemo(() => {
    const map = new Map<string, DutyRecord[]>();
    for (const d of filteredRecords) {
      if (!map.has(d.date)) map.set(d.date, []);
      map.get(d.date)!.push(d);
    }
    for (const list of map.values()) {
      list.sort(
        (a, b) =>
          a.departmentName.localeCompare(b.departmentName, 'zh-CN') ||
          a.employeeName.localeCompare(b.employeeName, 'zh-CN'),
      );
    }
    return map;
  }, [filteredRecords]);

  const handleFormSave = (values: DutyFormValues) => {
    const deptName = deptNameById.get(values.departmentId) ?? '—';
    if (formModal?.type === 'edit') {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === formModal.record.id ? buildRecord(values, deptName, formModal.record) : r,
        ),
      );
      showToast('值班已更新');
    } else {
      setRecords((prev) => [...prev, buildRecord(values, deptName)]);
      showToast('值班已新增');
    }
    setFormModal(null);
  };

  const handleDelete = () => {
    if (formModal?.type !== 'edit') return;
    setRecords((prev) => prev.filter((r) => r.id !== formModal.record.id));
    setFormModal(null);
    showToast('值班已删除');
  };

  const handleBatchImport = (fileName: string) => {
    setShowBatch(false);
    showToast(`已上传排班表「${fileName}」（演示，未解析写入日历）`);
  };

  return (
    <>
      <PageHeader
        title="值班管理"
        actions={
          <>
            <Button variant="primary" onClick={() => setFormModal({ type: 'create' })}>
              + 新增值班
            </Button>
            <Button variant="default" onClick={() => setShowBatch(true)}>
              批量排班
            </Button>
          </>
        }
      />

      <Card className={styles.toolbar}>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          <option value="">部门 [全部]</option>
          {departmentOptions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <div className={styles.monthNav}>
          <Button variant="text" onClick={() => setWeekStart((w) => addDays(w, -7))}>
            ‹
          </Button>
          <span>{monthLabel}</span>
          <Button variant="text" onClick={() => setWeekStart((w) => addDays(w, 7))}>
            ›
          </Button>
          <Button variant="text" onClick={() => setWeekStart(getMonday(new Date()))}>
            本周
          </Button>
        </div>
      </Card>

      <Card className={styles.calendar}>
        <div className={styles.weekHeader}>
          {weekDays.map(({ iso, label, weekday }) => (
            <div key={iso} className={styles.dayCol}>
              <div className={styles.weekLabel}>
                {weekday} {label}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.weekBody}>
          {weekDays.map(({ iso }) => {
            const duties = calendarData.get(iso) ?? [];
            return (
              <div key={iso} className={styles.dayCol}>
                {duties.length === 0 ? (
                  <button
                    type="button"
                    className={styles.emptyCell}
                    onClick={() => setFormModal({ type: 'create', defaultDate: iso })}
                  >
                    + 添加值班
                  </button>
                ) : (
                  <>
                    {duties.map((d) => (
                      <div key={d.id} className={styles.dutyCell}>
                        <div className={styles.deptName}>{d.departmentName}</div>
                        <div className={styles.dutyPerson}>👤 {d.employeeName}</div>
                        {d.note && <div className={styles.note}>{d.note}</div>}
                        <Button variant="text" onClick={() => setFormModal({ type: 'edit', record: d })}>
                          编辑
                        </Button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className={styles.addMore}
                      onClick={() => setFormModal({ type: 'create', defaultDate: iso })}
                    >
                      + 添加
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {formModal && (
        <DutyFormModal
          title={formModal.type === 'create' ? '新增值班' : '编辑值班'}
          initial={formModal.type === 'edit' ? formModal.record : undefined}
          defaultDate={formModal.type === 'create' ? formModal.defaultDate : undefined}
          departmentOptions={departmentOptions}
          onSave={handleFormSave}
          onDelete={formModal.type === 'edit' ? handleDelete : undefined}
          onClose={() => setFormModal(null)}
        />
      )}

      {showBatch && (
        <DutyBatchModal onImport={handleBatchImport} onClose={() => setShowBatch(false)} />
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
