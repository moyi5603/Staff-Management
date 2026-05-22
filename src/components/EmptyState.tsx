import { Button } from './Button';
import styles from './EmptyState.module.css';

interface Props {
  title?: string;
  description?: string;
  actions?: { label: string; onClick?: () => void; primary?: boolean }[];
}

export function EmptyState({
  title = '暂无数据',
  description,
  actions = [],
}: Props) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>👥</div>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.desc}>{description}</p>}
      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((a) => (
            <Button key={a.label} variant={a.primary ? 'primary' : 'default'} onClick={a.onClick}>
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
