import { useState } from 'react';
import { Button } from '../../components/Button';
import { employees } from '../../mock/data';
import type { Department, DepartmentKpi, DepartmentStatus } from '../../types';
import styles from './DepartmentList.module.css';

export interface DepartmentFormValues {
  name: string;
  parentId: string;
  leaderId: string;
  email: string;
  description: string;
  culture: string;
  functionDetail: string;
  status: DepartmentStatus;
  kpis: DepartmentKpi[];
}

interface Props {
  title: string;
  initial?: Department;
  parentId: string;
  parentOptions: { id: string; name: string }[];
  lockParent?: boolean;
  onSave: (values: DepartmentFormValues) => void;
  onClose: () => void;
}

const emptyKpi = (): DepartmentKpi => ({ name: '', target: '', period: '季度' });

export function DepartmentFormModal({
  title,
  initial,
  parentId,
  parentOptions,
  lockParent = false,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [parent, setParent] = useState(initial?.parentId ?? parentId);
  const [leaderId, setLeaderId] = useState(initial?.leaderId ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [culture, setCulture] = useState(initial?.culture ?? '');
  const [functionDetail, setFunctionDetail] = useState(initial?.functionDetail ?? '');
  const [status, setStatus] = useState<DepartmentStatus>(initial?.status ?? '正常');
  const [kpis, setKpis] = useState<DepartmentKpi[]>(
    initial?.kpis?.length ? initial.kpis.map((k) => ({ ...k })) : [emptyKpi()],
  );
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('请填写部门名称');
      return;
    }
    if (!parent) {
      setError('请选择上级部门');
      return;
    }
    onSave({
      name: name.trim(),
      parentId: parent,
      leaderId,
      email: email.trim(),
      description: description.trim(),
      culture: culture.trim(),
      functionDetail: functionDetail.trim(),
      status,
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
            <span>部门名称 *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：产品部" />
          </label>
          <label className={styles.formField}>
            <span>上级部门 *</span>
            <select value={parent} disabled={lockParent} onChange={(e) => setParent(e.target.value)}>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.formField}>
            <span>部门负责人</span>
            <select value={leaderId} onChange={(e) => setLeaderId(e.target.value)}>
              <option value="">未指定</option>
              {employees
                .filter((e) => e.status === '在职')
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} · {e.departmentName}
                  </option>
                ))}
            </select>
          </label>
          <label className={styles.formField}>
            <span>部门邮箱</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="product@company.com"
            />
          </label>
          <label className={styles.formField}>
            <span>状态</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as DepartmentStatus)}>
              <option value="正常">正常</option>
              <option value="已撤销">已撤销</option>
            </select>
          </label>
          <label className={`${styles.formField} ${styles.formFieldFull}`}>
            <span>部门简介</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="一句话描述部门定位"
            />
          </label>
          <label className={`${styles.formField} ${styles.formFieldFull}`}>
            <span>部门文化</span>
            <textarea
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
              rows={2}
              placeholder="价值观与协作方式"
            />
          </label>
          <label className={`${styles.formField} ${styles.formFieldFull}`}>
            <span>部门职能详细介绍</span>
            <textarea
              value={functionDetail}
              onChange={(e) => setFunctionDetail(e.target.value)}
              rows={4}
              placeholder="每条职责可换行填写"
            />
          </label>
        </div>

        <div className={styles.kpiEditor}>
          <div className={styles.kpiEditorHead}>
            <span>部门绩效指标</span>
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
