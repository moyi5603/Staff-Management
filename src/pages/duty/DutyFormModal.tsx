import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { employees } from '../../mock/data';
import type { DutyRecord } from '../../types';
import formStyles from '../../styles/modalForm.module.css';
import styles from './DutyCalendar.module.css';

export interface DutyFormValues {
  date: string;
  departmentId: string;
  employeeId: string;
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
    onSave({ date, departmentId, employeeId, note: note.trim() });
  };

  const fieldRow = `${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {error && <p className={formStyles.formError}>{error}</p>}

        <div className={formStyles.formGrid}>
          <label className={fieldRow}>
            <span>值班日期 *</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className={fieldRow}>
            <span>部门 *</span>
            <select value={departmentId} onChange={(e) => handleDepartmentChange(e.target.value)}>
              {departmentOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className={fieldRow}>
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
          <label className={`${formStyles.formField} ${formStyles.formFieldFull}`}>
            <span>备注</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="选填"
            />
          </label>
        </div>

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
