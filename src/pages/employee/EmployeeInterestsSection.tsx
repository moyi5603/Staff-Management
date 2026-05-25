import { useState } from 'react';
import { Button } from '../../components/Button';
import { TagPill } from '../../components/TagPill';
import styles from './EmployeeCertificatesSection.module.css';
import { InterestPickerModal } from './InterestPickerModal';

interface Props {
  interests: string[];
  onChange: (next: string[]) => void;
}

export function EmployeeInterestsSection({ interests, onChange }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handlePickerConfirm = (names: string[]) => {
    const existing = new Set(interests.map((i) => i.toLowerCase()));
    const added = names.filter((n) => !existing.has(n.toLowerCase()));
    if (added.length > 0) onChange([...interests, ...added]);
    setPickerOpen(false);
  };

  return (
    <div>
      <div className={styles.header}>
        <h4>兴趣列表</h4>
        <Button variant="primary" onClick={() => setPickerOpen(true)}>
          + 添加兴趣
        </Button>
      </div>

      <p className={styles.emptyHint}>
        从「兴趣标签管理」维护的分类库中选择；自定义兴趣仅保存在本员工档案。
      </p>

      {interests.length === 0 ? (
        <p className={styles.empty}>暂无兴趣爱好，点击「添加兴趣」选择。</p>
      ) : (
        <div className={styles.tagList}>
          {interests.map((i) => (
            <TagPill key={i} label={i} onRemove={() => onChange(interests.filter((x) => x !== i))} />
          ))}
        </div>
      )}

      {pickerOpen && (
        <InterestPickerModal
          existingNames={interests}
          onConfirm={handlePickerConfirm}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
