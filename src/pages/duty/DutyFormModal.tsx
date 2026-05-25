import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { employees } from '../../mock/data';
import type { DutyRecord } from '../../types';
import { HOUR_OPTIONS } from '../../utils/dutyTime';
import styles from './DutyCalendar.module.css';

export interface DutyFormValues {
  date: string;
  departmentId: string;
  employeeId: string;
  startHour: number;
  endHour: number;
  note: string;
}

interface Props {
  title: string;
  initial?: DutyRecord;
  defaultDate?: string;
  departmentOptions: { id: string; name: string }[];
  onSave: (values: DutyFormValues) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function DutyFormModal({
  title,
  initial,
  defaultDate,
  departmentOptions,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const [date, setDate] = useState(initial?.date ?? defaultDate ?? '');
  const [departmentId, setDepartmentId] = useState(
    initial?.departmentId ?? departmentOptions[0]?.id ?? '',
  );
  const [employeeId, setEmployeeId] = useState(initial?.employeeId ?? '');
  const [startHour, setStartHour] = useState(initial?.startHour ?? 9);
  const [endHour, setEndHour] = useState(initial?.endHour ?? 18);
  const [note, setNote] = useState(initial?.note ?? '');
  const [error, setError] = useState('');

  const employeeOptions = useMemo(
    () =>
      employees.filter((e) => e.status === '在职' && e.departmentId === departmentId),
    [departmentId],
  );

  const handleDepartmentChange = (id: string) => {
    setDepartmentId(id);
    const stillValid = employees.some((e) => e.id === employeeId && e.departmentId === id);
    if (!stillValid) setEmployeeId('');
  };

  const handleSubmit = () => {
    if (!date) {
      setError('请选择值班日期');
      return;
    }
    if (!departmentId) {
      setError('请选择部门');
      return;
    }
    if (!employeeId) {
      setError('请选择值班人');
      return;
    }
    if (startHour === endHour) {
      setError('结束小时须与开始小时不同');
      return;
    }
    onSave({ date, departmentId, employeeId, startHour, endHour, note: note.trim() });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {error && <p className={styles.formError}>{error}</p>}

        <label className={styles.formField}>
          <span>值班日期 *</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className={styles.formField}>
          <span>部门 *</span>
          <select value={departmentId} onChange={(e) => handleDepartmentChange(e.target.value)}>
            {departmentOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.formField}>
          <span>值班人 *</span>
          <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
            <option value="">请选择</option>
            {employeeOptions.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} · {e.empNo}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.timeRow}>
          <label className={styles.formField}>
            <span>开始小时 *</span>
            <select value={startHour} onChange={(e) => setStartHour(Number(e.target.value))}>
              {HOUR_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h}:00
                </option>
              ))}
            </select>
          </label>
          <label className={styles.formField}>
            <span>结束小时 *</span>
            <select value={endHour} onChange={(e) => setEndHour(Number(e.target.value))}>
              {HOUR_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h}:00
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className={styles.timeHint}>结束小时不含该整点；小于开始小时表示跨天。允许多条值班时间重叠。</p>
        <label className={styles.formField}>
          <span>备注</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="选填"
          />
        </label>

        <div className={styles.modalActions}>
          {onDelete && (
            <Button variant="danger" onClick={onDelete} className={styles.deleteBtn}>
              删除
            </Button>
          )}
          <span className={styles.modalActionsSpacer} />
          <Button variant="default" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}
