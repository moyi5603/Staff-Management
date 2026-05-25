import { useState } from 'react';
import { Button } from '../../components/Button';
import type { Certificate } from '../../types';
import { CertificateFormModal, type CertificateFormValues } from './CertificateFormModal';
import { CertificatePickerModal } from './CertificatePickerModal';
import styles from './EmployeeCertificatesSection.module.css';

function newCertificateId() {
  return `cert-${Date.now()}`;
}

interface Props {
  certificates: Certificate[];
  onChange?: (next: Certificate[]) => void;
  readOnly?: boolean;
}

export function EmployeeCertificatesSection({ certificates, onChange, readOnly = false }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);

  const closeEditModal = () => setEditing(null);

  const handlePickerConfirm = (names: string[]) => {
    if (!onChange) return;
    const existing = new Set(certificates.map((c) => c.name.toLowerCase()));
    const added = names
      .filter((n) => !existing.has(n.toLowerCase()))
      .map((name) => ({
        id: newCertificateId(),
        name,
      }));
    if (added.length > 0) onChange([...certificates, ...added]);
    setPickerOpen(false);
  };

  const handleSave = (values: CertificateFormValues) => {
    if (!onChange || !editing) return;
    onChange(certificates.map((c) => (c.id === editing.id ? { ...c, ...values } : c)));
    closeEditModal();
  };

  const handleDelete = (id: string) => {
    if (!onChange) return;
    const target = certificates.find((c) => c.id === id);
    if (!target) return;
    if (!window.confirm(`确定删除证书「${target.name}」？`)) return;
    onChange(certificates.filter((c) => c.id !== id));
  };

  return (
    <div>
      {readOnly ? (
        <h4 className={styles.title}>证书列表</h4>
      ) : (
        <div className={styles.header}>
          <h4>证书列表</h4>
          <Button variant="primary" onClick={() => setPickerOpen(true)}>
            + 添加证书
          </Button>
        </div>
      )}

      {certificates.length === 0 ? (
        <p className={styles.empty}>
          {readOnly ? '暂无个人证书。' : '暂无个人证书，点击「添加证书」录入。'}
        </p>
      ) : (
        <div className={styles.certGrid}>
          {certificates.map((c) => (
            <div key={c.id} className={styles.certCard}>
              <strong className={styles.certName} title={c.name}>
                {c.name}
              </strong>
              {(c.issueDate || c.expireDate) && (
                <p className={styles.certMeta}>
                  {c.issueDate && c.expireDate
                    ? `${c.issueDate} → ${c.expireDate}`
                    : c.issueDate
                      ? c.issueDate
                      : `到期 ${c.expireDate}`}
                </p>
              )}
              {c.issuer && (
                <p className={styles.certIssuer} title={c.issuer}>
                  {c.issuer}
                </p>
              )}
              {!readOnly && (
                <div className={styles.certOps}>
                  <Button variant="text" onClick={() => setEditing(c)}>
                    编辑
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(c.id)}>
                    删除
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!readOnly && pickerOpen && (
        <CertificatePickerModal
          existingNames={certificates.map((c) => c.name)}
          onConfirm={handlePickerConfirm}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {!readOnly && editing !== null && (
        <CertificateFormModal
          title="编辑证书"
          initial={editing}
          onSave={handleSave}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}
