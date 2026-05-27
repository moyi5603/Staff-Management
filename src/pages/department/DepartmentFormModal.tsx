import { useState } from 'react';
import { Button } from '../../components/Button';
import { EmployeeSearchCombo } from '../../components/EmployeeSearchCombo';
import { employees } from '../../mock/data';
import type { Department, DepartmentStatus } from '../../types';
import formStyles from '../../styles/modalForm.module.css';
import styles from './DepartmentList.module.css';

const STATUS_OPTIONS: DepartmentStatus[] = ['正常', '停用'];

export interface DepartmentFormValues {
  name: string;
  parentId: string;
  leaderId: string;
  leaderName: string;
  email: string;
  phone: string;
  description: string;
  culture: string;
  functionDetail: string;
  status: DepartmentStatus;
  performanceIndicators: string;
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
  const resolveInitialLeader = () => {
    if (!initial) return { id: '', name: '' };
    if (initial.leaderId) {
      const emp = employees.find((e) => e.id === initial.leaderId);
      return { id: initial.leaderId, name: emp?.name ?? initial.leaderName ?? '' };
    }
    if (initial.leaderName) {
      const emp = employees.find((e) => e.name === initial.leaderName);
      return { id: emp?.id ?? '', name: initial.leaderName };
    }
    return { id: '', name: '' };
  };
  const initialLeader = resolveInitialLeader();
  const [leaderId, setLeaderId] = useState(initialLeader.id);
  const [leaderName, setLeaderName] = useState(initialLeader.name);
  const [email, setEmail] = useState(initial?.email ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [culture, setCulture] = useState(initial?.culture ?? '');
  const [functionDetail, setFunctionDetail] = useState(initial?.functionDetail ?? '');
  const [status, setStatus] = useState<DepartmentStatus>(initial?.status ?? '正常');
  const [performanceIndicators, setPerformanceIndicators] = useState(
    initial?.performanceIndicators ?? '',
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
      leaderName: leaderName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      description: description.trim(),
      culture: culture.trim(),
      functionDetail: functionDetail.trim(),
      status,
      performanceIndicators: performanceIndicators.trim(),
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {error && <p className={formStyles.formError}>{error}</p>}

        <div className={formStyles.formGrid}>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>部门名称 *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：产品部" />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>上级部门 *</span>
            <select value={parent} disabled={lockParent} onChange={(e) => setParent(e.target.value)}>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <div
            className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}
            role="group"
          >
            <span>部门负责人</span>
            <EmployeeSearchCombo
              employees={employees}
              valueId={leaderId}
              placeholder="输入姓名、工号、部门等搜索"
              onChange={(emp) => {
                setLeaderId(emp?.id ?? '');
                setLeaderName(emp?.name ?? '');
              }}
            />
          </div>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>部门邮箱</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="product@company.com"
            />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>联系电话</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入联系电话"
            />
          </label>
          <div
            className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}
            role="group"
          >
            <span>状态</span>
            <div className={formStyles.radioGroup} role="radiogroup" aria-label="部门状态">
              {STATUS_OPTIONS.map((s) => (
                <label key={s} className={formStyles.radioItem}>
                  <input
                    type="radio"
                    name="department-status"
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
            <span>部门简介</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="一句话描述部门定位"
            />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull}`}>
            <span>部门文化</span>
            <textarea
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
              rows={2}
              placeholder="价值观与协作方式"
            />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull}`}>
            <span>部门职能详细介绍</span>
            <textarea
              value={functionDetail}
              onChange={(e) => setFunctionDetail(e.target.value)}
              rows={4}
              placeholder="每条职责可换行填写"
            />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull}`}>
            <span>部门绩效指标</span>
            <textarea
              value={performanceIndicators}
              onChange={(e) => setPerformanceIndicators(e.target.value)}
              rows={3}
              placeholder="选填，可简要填写本部门绩效指标或考核要点"
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
