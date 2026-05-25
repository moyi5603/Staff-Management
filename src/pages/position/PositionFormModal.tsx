import { useState } from 'react';
import { Button } from '../../components/Button';
import type { Position, PositionKpi } from '../../types';
import styles from './PositionList.module.css';

export interface PositionFormValues {
  name: string;
  departmentId: string;
  coreDuties: string[];
  detailDuty: string;
  kpis: PositionKpi[];
}

interface Props {
  title: string;
  initial?: Position;
  departmentOptions: { id: string; name: string }[];
  defaultDepartmentId?: string;
  onSave: (values: PositionFormValues) => void;
  onClose: () => void;
}

const emptyKpi = (): PositionKpi => ({ name: '', target: '', period: '季度' });

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
  const [coreDuties, setCoreDuties] = useState<string[]>(
    initial?.coreDuties?.length ? [...initial.coreDuties] : [''],
  );
  const [detailDuty, setDetailDuty] = useState(initial?.detailDuty ?? '');
  const [kpis, setKpis] = useState<PositionKpi[]>(
    initial?.kpis?.length ? initial.kpis.map((k) => ({ ...k })) : [emptyKpi()],
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
    const duties = coreDuties.map((d) => d.trim()).filter(Boolean);
    if (duties.length === 0) {
      setError('请至少填写一条核心职责');
      return;
    }
    onSave({
      name: name.trim(),
      departmentId,
      coreDuties: duties,
      detailDuty: detailDuty.trim(),
      kpis: kpis.filter((k) => k.name.trim()),
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
            <span>岗位职责详细介绍</span>
            <textarea
              value={detailDuty}
              onChange={(e) => setDetailDuty(e.target.value)}
              rows={4}
              placeholder="每条职责可换行填写"
            />
          </label>
        </div>

        <div className={styles.dutyEditor}>
          <div className={styles.dutyEditorHead}>
            <span>核心职责 *</span>
            <Button variant="text" onClick={() => setCoreDuties((d) => [...d, ''])}>
              + 添加职责
            </Button>
          </div>
          {coreDuties.map((duty, index) => (
            <div key={index} className={styles.dutyRow}>
              <input
                placeholder="如：需求分析"
                value={duty}
                onChange={(e) => {
                  const next = [...coreDuties];
                  next[index] = e.target.value;
                  setCoreDuties(next);
                }}
              />
              {coreDuties.length > 1 && (
                <Button variant="danger" onClick={() => setCoreDuties((d) => d.filter((_, i) => i !== index))}>
                  删除
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className={styles.kpiEditor}>
          <div className={styles.kpiEditorHead}>
            <span>岗位绩效指标</span>
            <Button variant="text" onClick={() => setKpis((k) => [...k, emptyKpi()])}>
              + 添加指标
            </Button>
          </div>
          {kpis.map((kpi, index) => (
            <div key={index} className={styles.kpiRow}>
              <input
                placeholder="指标名称"
                value={kpi.name}
                onChange={(e) => {
                  const next = [...kpis];
                  next[index] = { ...next[index], name: e.target.value };
                  setKpis(next);
                }}
              />
              <input
                placeholder="目标值"
                value={kpi.target}
                onChange={(e) => {
                  const next = [...kpis];
                  next[index] = { ...next[index], target: e.target.value };
                  setKpis(next);
                }}
              />
              <select
                value={kpi.period}
                onChange={(e) => {
                  const next = [...kpis];
                  next[index] = { ...next[index], period: e.target.value };
                  setKpis(next);
                }}
              >
                <option value="月度">月度</option>
                <option value="季度">季度</option>
                <option value="半年度">半年度</option>
                <option value="年度">年度</option>
              </select>
              {kpis.length > 1 && (
                <Button variant="danger" onClick={() => setKpis((k) => k.filter((_, i) => i !== index))}>
                  删除
                </Button>
              )}
            </div>
          ))}
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
