import { Button } from '../../components/Button';
import type { PositionStatus } from '../../types';
import type { PositionListFilters } from '../../utils/positionFilters';
import filterStyles from '../../styles/filterBar.module.css';

const STATUS_OPTIONS: { value: '' | PositionStatus; label: string }[] = [
  { value: '', label: '岗位状态' },
  { value: '正常', label: '正常' },
  { value: '停用', label: '停用' },
];

interface Props {
  value: PositionListFilters;
  onChange: (next: PositionListFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function PositionFilterBar({ value, onChange, onSearch, onReset }: Props) {
  const patch = (partial: Partial<PositionListFilters>) => onChange({ ...value, ...partial });

  return (
    <div className={filterStyles.filterGrid}>
        <label className={filterStyles.filterField}>
          <span className={filterStyles.filterLabel}>岗位编码</span>
          <input
            className={filterStyles.filterControl}
            placeholder="请输入岗位编码"
            value={value.code}
            onChange={(e) => patch({ code: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </label>
        <label className={filterStyles.filterField}>
          <span className={filterStyles.filterLabel}>岗位名称</span>
          <input
            className={filterStyles.filterControl}
            placeholder="请输入岗位名称"
            value={value.name}
            onChange={(e) => patch({ name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </label>
        <label className={filterStyles.filterField}>
          <span className={filterStyles.filterLabel}>状态</span>
          <select
            className={filterStyles.filterControl}
            value={value.status}
            onChange={(e) => patch({ status: e.target.value as PositionListFilters['status'] })}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <div className={filterStyles.filterActionsInline}>
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
