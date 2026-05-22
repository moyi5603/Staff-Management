import type { EmployeeStatus, ProjectStatus } from '../types';
import styles from './StatusBadge.module.css';

type Status = EmployeeStatus | ProjectStatus | '正常' | '已撤销';

const config: Record<string, { bg: string; color: string }> = {
  在职: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' },
  正常: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' },
  休假: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
  离职: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)' },
  进行中: { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  筹备中: { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  已结束: { bg: '#f2f3f5', color: 'var(--color-text-secondary)' },
  已撤销: { bg: '#f2f3f5', color: 'var(--color-text-secondary)' },
};

export function StatusBadge({ status }: { status: Status }) {
  const style = config[status] ?? config['已结束'];
  return (
    <span className={styles.badge} style={{ background: style.bg, color: style.color }}>
      {status}
    </span>
  );
}
