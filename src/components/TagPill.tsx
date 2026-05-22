import styles from './TagPill.module.css';

export function TagPill({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className={styles.pill}>
      {label}
      {onRemove && (
        <button type="button" className={styles.remove} onClick={onRemove} aria-label="移除">
          ×
        </button>
      )}
    </span>
  );
}
