import { Button } from '../../components/Button';
import type { ProjectListFilters } from '../../utils/projectFilters';
import styles from './ProjectList.module.css';

interface Props {
  value: ProjectListFilters;
  onChange: (next: ProjectListFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function ProjectFilterBar({ value, onChange, onSearch, onReset }: Props) {
  const patch = (partial: Partial<ProjectListFilters>) => onChange({ ...value, ...partial });

  return (
    <div className={styles.filterForm}>
      <div className={styles.filterGrid}>
        <label className={styles.filterField}>
          <span>项目名称</span>
          <input
            placeholder="请输入项目名称"
            value={value.name}
            onChange={(e) => patch({ name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </label>
        <label className={styles.filterField}>
          <span>主负责部门</span>
          <input
            placeholder="请输入主负责部门"
            value={value.department}
            onChange={(e) => patch({ department: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </label>
        <label className={styles.filterField}>
          <span>负责人</span>
          <input
            placeholder="请输入负责人姓名"
            value={value.leader}
            onChange={(e) => patch({ leader: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </label>
        <label className={styles.filterField}>
          <span>参与人</span>
          <input
            placeholder="请输入参与人姓名"
            value={value.member}
            onChange={(e) => patch({ member: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </label>
      </div>
      <div className={styles.filterActions}>
        <Button variant="primary" onClick={onSearch}>
          搜索
        </Button>
        <Button variant="default" onClick={onReset}>
          重置
        </Button>
      </div>
    </div>
  );
}
