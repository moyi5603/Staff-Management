import { useState } from 'react';
import { Button } from '../../components/Button';
import { TagPill } from '../../components/TagPill';
import type { Certificate } from '../../types';
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

      {!readOnly && (
        <p className={styles.emptyHint}>
          从「证书标签管理」维护的分类库中选择；自定义证书仅保存在本员工档案。
        </p>
      )}

      {certificates.length === 0 ? (
        <p className={styles.empty}>
          {readOnly ? '暂无个人证书。' : '暂无个人证书，点击「添加证书」选择。'}
        </p>
      ) : (
        <div className={styles.tagList}>
          {certificates.map((c) => (
            <TagPill
              key={c.id}
              label={c.name}
              onRemove={
                readOnly ? undefined : () => onChange?.(certificates.filter((x) => x.id !== c.id))
              }
            />
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
    </div>
  );
}
