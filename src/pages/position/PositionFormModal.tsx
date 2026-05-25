import { useState } from 'react';
import { Button } from '../../components/Button';
import type { Position } from '../../types';
import styles from './PositionList.module.css';

export interface PositionFormValues {
  name: string;
  departmentId: string;
  coreDuties: string;
  detailDuty: string;
  performanceIndicators: string;
}

interface Props {
  title: string;
  initial?: Position;
  departmentOptions: { id: string; name: string }[];
  defaultDepartmentId?: string;
  onSave: (values: PositionFormValues) => void;
  onClose: () => void;
}

export function PositionFormModal({
  title,
  initial,
  departmentOptions,
  defaultDepartmentId,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [departmentId, setDepartmentId] = useState(
    initial?.departmentId ?? defaultDepartmentId ?? departmentOptions[0]?.id ?? '',
  );
  const [coreDuties, setCoreDuties] = useState(initial?.coreDuties ?? '');
  const [detailDuty, setDetailDuty] = useState(initial?.detailDuty ?? '');
  const [performanceIndicators, setPerformanceIndicators] = useState(
    initial?.performanceIndicators ?? '',
  );
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('请填写岗位名称');
      return;
    }
    if (!departmentId) {
      setError('请选择所属部门');
      return;
    }
    if (!coreDuties.trim()) {
      setError('请填写核心职责');
      return;
    }
    onSave({
      name: name.trim(),
      departmentId,
      coreDuties: coreDuties.trim(),
      detailDuty: detailDuty.trim(),
      performanceIndicators: performanceIndicators.trim(),
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {error && <p className={styles.formError}>{error}</p>}

        <div className={styles.formGrid}>
          <label className={styles.formField}>
            <span>岗位名称 *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：产品经理" />
          </label>
          <label className={styles.formField}>
            <span>所属部门 *</span>
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
              {departmentOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className={`${styles.formField} ${styles.formFieldFull}`}>
            <span>核心职责 *</span>
            <textarea
              value={coreDuties}
              onChange={(e) => setCoreDuties(e.target.value)}
              rows={3}
              placeholder="可换行填写，如：需求分析、产品规划"
            />
          </label>
          <label className={`${styles.formField} ${styles.formFieldFull}`}>
            <span>岗位职责详细介绍</span>
            <textarea
              value={detailDuty}
              onChange={(e) => setDetailDuty(e.target.value)}
              rows={4}
              placeholder="每条职责可换行填写"
            />
          </label>
          <label className={`${styles.formField} ${styles.formFieldFull}`}>
            <span>岗位绩效指标</span>
            <textarea
              value={performanceIndicators}
              onChange={(e) => setPerformanceIndicators(e.target.value)}
              rows={3}
              placeholder="选填，可简要填写本岗位绩效指标或考核要点"
            />
          </label>
        </div>

        <div className={styles.modalActions}>
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
