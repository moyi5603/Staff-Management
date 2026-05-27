import styles from './ListToolbarIcons.module.css';

interface Props {
  filterVisible: boolean;
  onToggleFilter: () => void;
  onRefresh: () => void;
}

export function ListToolbarIcons({ filterVisible, onToggleFilter, onRefresh }: Props) {
  return (
    <div className={styles.group}>
      <button
        type="button"
        className={`${styles.iconBtn} ${filterVisible ? styles.iconBtnActive : ''}`}
        title={filterVisible ? '隐藏搜索' : '显示搜索'}
        aria-pressed={filterVisible}
        onClick={onToggleFilter}
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5 14 14" strokeLinecap="round" />
        </svg>
      </button>
      <button type="button" className={styles.iconBtn} title="刷新" onClick={onRefresh}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path
            d="M13 3.5A5.5 5.5 0 0 0 3.9 5.3M3 3.5v2.5h2.5M3 12.5a5.5 5.5 0 0 0 9.1-1.8M13 12.5V10H10.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
