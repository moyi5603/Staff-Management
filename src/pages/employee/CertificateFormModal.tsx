import { useState } from 'react';
import { Button } from '../../components/Button';
import type { Certificate } from '../../types';
import styles from './CertificateFormModal.module.css';

export type CertificateFormValues = Omit<Certificate, 'id'>;

interface Props {
  title: string;
  initial?: Certificate;
  onSave: (values: CertificateFormValues) => void;
  onClose: () => void;
}

export function CertificateFormModal({ title, initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [issueDate, setIssueDate] = useState(initial?.issueDate ?? '');
  const [expireDate, setExpireDate] = useState(initial?.expireDate ?? '');
  const [issuer, setIssuer] = useState(initial?.issuer ?? '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('请填写证书名称');
      return;
    }
    if (issueDate && expireDate && expireDate < issueDate) {
      setError('到期日期不能早于发证日期');
      return;
    }
    onSave({
      name: name.trim(),
      issueDate: issueDate || undefined,
      expireDate: expireDate || undefined,
      issuer: issuer.trim() || undefined,
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {error && <p className={styles.formError}>{error}</p>}

        <label className={styles.formField}>
          <span>证书名称 *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="如：PMP 项目管理专业人士"
          />
        </label>
        <label className={styles.formField}>
          <span>发证日期</span>
          <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
        </label>
        <label className={styles.formField}>
          <span>到期日期</span>
          <input type="date" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} />
        </label>
        <label className={styles.formField}>
          <span>颁发机构</span>
          <input
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="选填"
          />
        </label>

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
