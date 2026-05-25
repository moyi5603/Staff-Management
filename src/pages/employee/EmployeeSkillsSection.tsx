import { useState } from 'react';
import { Button } from '../../components/Button';
import { TagPill } from '../../components/TagPill';
import styles from './EmployeeCertificatesSection.module.css';
import { SkillPickerModal } from './SkillPickerModal';

interface Props {
  skills: string[];
  onChange: (next: string[]) => void;
}

export function EmployeeSkillsSection({ skills, onChange }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handlePickerConfirm = (names: string[]) => {
    const existing = new Set(skills.map((s) => s.toLowerCase()));
    const added = names.filter((n) => !existing.has(n.toLowerCase()));
    if (added.length > 0) onChange([...skills, ...added]);
    setPickerOpen(false);
  };

  return (
    <div>
      <div className={styles.header}>
        <h4>技能列表</h4>
        <Button variant="primary" onClick={() => setPickerOpen(true)}>
          + 添加技能
        </Button>
      </div>

      <p className={styles.emptyHint}>
        从「技能标签管理」维护的分类库中选择；自定义技能仅保存在本员工档案。
      </p>

      {skills.length === 0 ? (
        <p className={styles.empty}>暂无个人技能，点击「添加技能」选择。</p>
      ) : (
        <div className={styles.tagList}>
          {skills.map((s) => (
            <TagPill key={s} label={s} onRemove={() => onChange(skills.filter((x) => x !== s))} />
          ))}
        </div>
      )}

      {pickerOpen && (
        <SkillPickerModal
          existingNames={skills}
          onConfirm={handlePickerConfirm}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
