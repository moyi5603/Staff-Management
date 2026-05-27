import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import formStyles from '../styles/modalForm.module.css';
import styles from './CatalogNameInputModal.module.css';

interface Props {
  title: string;
  label: string;
  placeholder?: string;
  confirmText?: string;
  initialValue?: string;
  onConfirm: (name: string) => void;
  onClose: () => void;
}

export function CatalogNameInputModal({
  title,
  label,
  placeholder,
  confirmText = '确定',
  initialValue = '',
  onConfirm,
  onClose,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const name = value.trim();
    if (!name) {
      setError('请填写名称');
      return;
    }
    onConfirm(name);
  };

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-name-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="catalog-name-modal-title" className={styles.title}>
          {title}
        </h3>
        {error && <p className={formStyles.formError}>{error}</p>}
        <label
          className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}
        >
          <span>{label}</span>
          <input
            ref={inputRef}
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </label>
        <div className={styles.actions}>
          <Button variant="default" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
