import type { ProjectLevel, ProjectPriority } from '../types';
import styles from './StatusBadge.module.css';

type Meta = ProjectLevel | ProjectPriority;

const config: Record<Meta, { bg: string; color: string }> = {
  公司级: { bg: '#ede7ff', color: '#5b3fd6' },
  部门级: { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  团队级: { bg: '#e8fffb', color: '#0aa5a0' },
  高: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)' },
  中: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
  低: { bg: '#f2f3f5', color: 'var(--color-text-secondary)' },
};

export function ProjectMetaBadge({ label }: { label: Meta }) {
  const style = config[label];
  return (
    <span className={styles.badge} style={{ background: style.bg, color: style.color }}>
      {label}
    </span>
  );
}
