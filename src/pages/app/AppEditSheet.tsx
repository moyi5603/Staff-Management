import { useEffect, useState } from 'react';
import styles from './AppEditSheet.module.css';

type SheetMode = 'text' | 'textarea' | 'select';

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  title: string;
  mode: SheetMode;
  value: string;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  options?: SelectOption[];
  onConfirm: (value: string) => void;
  onClose: () => void;
}

export function AppEditSheet({
  title,
  mode,
  value,
  placeholder,
  hint,
  maxLength,
  options = [],
  onConfirm,
  onClose,
}: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleConfirm = () => {
    onConfirm(draft.trim());
    onClose();
  };

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-edit-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <button type="button" className={`${styles.headerBtn} ${styles.cancel}`} onClick={onClose}>
            取消
          </button>
          <span id="app-edit-sheet-title" className={styles.title}>
            {title}
          </span>
          {mode === 'select' ? (
            <button type="button" className={`${styles.headerBtn} ${styles.cancel}`} onClick={onClose}>
              关闭
            </button>
          ) : (
            <button type="button" className={`${styles.headerBtn} ${styles.confirm}`} onClick={handleConfirm}>
              完成
            </button>
          )}
        </div>
        <div className={styles.body}>
          {mode === 'text' && (
            <>
              <input
                className={styles.input}
                value={draft}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
              />
              {hint && <p className={styles.hint}>{hint}</p>}
            </>
          )}
          {mode === 'textarea' && (
            <>
              <textarea
                className={styles.textarea}
                value={draft}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
              />
              {hint && <p className={styles.hint}>{hint}</p>}
            </>
          )}
          {mode === 'select' && (
            <div className={styles.optionList}>
              {options.map((opt) => {
                const active = draft === opt.value;
                return (
                  <button
                    key={opt.value || '__empty'}
                    type="button"
                    className={`${styles.option} ${active ? styles.optionActive : ''}`}
                    onClick={() => {
                      setDraft(opt.value);
                      onConfirm(opt.value);
                      onClose();
                    }}
                  >
                    <span>{opt.label}</span>
                    {active && <span className={styles.check}>✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
