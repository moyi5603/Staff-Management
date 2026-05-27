import { useState } from 'react';
import { Button } from '../../components/Button';
import type { Position, PositionStatus } from '../../types';
import formStyles from '../../styles/modalForm.module.css';
import styles from './PositionList.module.css';

const STATUS_OPTIONS: PositionStatus[] = ['正常', '停用'];

export interface PositionFormValues {
  code: string;
  name: string;
  sortOrder: number;
  status: PositionStatus;
  coreDuties: string;
  detailDuty: string;
  performanceIndicators: string;
  remark: string;
}

interface Props {
  title: string;
  initial?: Position;
  onSave: (values: PositionFormValues) => void;
  onClose: () => void;
}

export function PositionFormModal({ title, initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [code, setCode] = useState(initial?.code ?? '');
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [status, setStatus] = useState<PositionStatus>(initial?.status ?? '正常');
  const [coreDuties, setCoreDuties] = useState(initial?.coreDuties ?? '');
  const [detailDuty, setDetailDuty] = useState(initial?.detailDuty ?? '');
  const [performanceIndicators, setPerformanceIndicators] = useState(
    initial?.performanceIndicators ?? '',
  );
  const [remark, setRemark] = useState(initial?.remark ?? '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('请填写岗位名称');
      return;
    }
    if (!code.trim()) {
      setError('请填写岗位编码');
      return;
    }
    if (!coreDuties.trim()) {
      setError('请填写核心职责');
      return;
    }
    const sort = Number(sortOrder);
    if (Number.isNaN(sort)) {
      setError('岗位排序须为数字');
      return;
    }
    onSave({
      code: code.trim(),
      name: name.trim(),
      sortOrder: sort,
      status,
      coreDuties: coreDuties.trim(),
      detailDuty: detailDuty.trim(),
      performanceIndicators: performanceIndicators.trim(),
      remark: remark.trim(),
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {error && <p className={formStyles.formError}>{error}</p>}

        <div className={formStyles.formGrid}>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>岗位名称 *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：产品经理" />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>岗位编码 *</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="如：product_manager"
            />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>岗位排序</span>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="0"
            />
          </label>
          <div
            className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}
            role="group"
          >
            <span>状态 *</span>
            <div className={formStyles.radioGroup} role="radiogroup" aria-label="岗位状态">
              {STATUS_OPTIONS.map((s) => (
                <label key={s} className={formStyles.radioItem}>
                  <input
                    type="radio"
                    name="position-status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull}`}>
            <span>核心职责 *</span>
            <textarea
              value={coreDuties}
              onChange={(e) => setCoreDuties(e.target.value)}
              rows={3}
              placeholder="可换行填写，如：需求分析、产品规划"
            />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull}`}>
            <span>岗位职责详细介绍</span>
            <textarea
              value={detailDuty}
              onChange={(e) => setDetailDuty(e.target.value)}
              rows={4}
              placeholder="每条职责可换行填写"
            />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull}`}>
            <span>岗位绩效指标</span>
            <textarea
              value={performanceIndicators}
              onChange={(e) => setPerformanceIndicators(e.target.value)}
              rows={3}
              placeholder="选填，可简要填写本岗位绩效指标或考核要点"
            />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull}`}>
            <span>备注</span>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={2}
              placeholder="选填"
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
