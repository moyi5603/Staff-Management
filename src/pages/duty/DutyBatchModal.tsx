import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { employees } from '../../mock/data';
import { HOUR_OPTIONS } from '../../utils/dutyTime';
import styles from './DutyCalendar.module.css';

export interface DutyBatchValues {
  departmentId: string;
  startDate: string;
  endDate: string;
  startHour: number;
  endHour: number;
  employeeId: string;
}

interface Props {
  departmentOptions: { id: string; name: string }[];
  defaultStart?: string;
  defaultEnd?: string;
  onConfirm: (values: DutyBatchValues) => void;
  onClose: () => void;
}

export function DutyBatchModal({
  departmentOptions,
  defaultStart,
  defaultEnd,
  onConfirm,
  onClose,
}: Props) {
  const [departmentId, setDepartmentId] = useState(departmentOptions[0]?.id ?? '');
  const [startDate, setStartDate] = useState(defaultStart ?? '');
  const [endDate, setEndDate] = useState(defaultEnd ?? '');
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(18);
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');

  const employeeOptions = useMemo(
    () =>
      employees.filter((e) => e.status === '在职' && e.departmentId === departmentId),
    [departmentId],
  );

  const handleSubmit = () => {
    if (!departmentId) {
      setError('请选择部门');
      return;
    }
    if (!startDate || !endDate) {
      setError('请填写排班周期');
      return;
    }
    if (startDate > endDate) {
      setError('结束日期不能早于开始日期');
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
    onConfirm({ departmentId, startDate, endDate, startHour, endHour, employeeId });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>批量排班</h3>
        {error && <p className={styles.formError}>{error}</p>}

        <label className={styles.formField}>
          <span>部门 *</span>
          <select
            value={departmentId}
            onChange={(e) => {
              setDepartmentId(e.target.value);
              setEmployeeId('');
            }}
          >
            {departmentOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.formField}>
          <span>开始日期 *</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label className={styles.formField}>
          <span>结束日期 *</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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

        <p className={styles.batchHint}>
          将为周期内每一天生成一条相同时间的排班（允许与已有排班重叠）。Excel 导入为演示占位，本期不解析文件。
        </p>
        <p className={styles.batchUpload}>
          或上传排班表：
          <Button variant="text" onClick={() => window.alert('已下载排班模板（演示）')}>
            下载模板
          </Button>
        </p>
        <div
          className={styles.uploadZone}
          onClick={() => window.alert('已选择文件（演示，未实际上传解析）')}
          onKeyDown={(e) => e.key === 'Enter' && window.alert('已选择文件（演示）')}
          role="button"
          tabIndex={0}
        >
          拖拽或点击上传 .xlsx
        </div>

        <div className={styles.modalActions}>
          <Button variant="default" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            确认排班
          </Button>
        </div>
      </div>
    </div>
  );
}
