import { Button } from '../../components/Button';
import type { AccountStatus, EmployeeStatus } from '../../types';
import filterStyles from '../../styles/filterBar.module.css';
import {
  emptyEmployeeListFilters,
  SEARCH_FIELD_OPTIONS,
  TENURE_OPTIONS,
  type EmployeeListFilters,
  type SearchFieldType,
  type TenureRange,
} from '../../utils/employeeFilters';
import styles from './EmployeeList.module.css';

const ACCOUNT_STATUS_OPTIONS: { value: AccountStatus | ''; label: string }[] = [
  { value: '', label: '用户状态' },
  { value: '正常', label: '正常' },
  { value: '已禁用', label: '已禁用' },
  { value: '待激活', label: '待激活' },
];

interface Props {
  value: EmployeeListFilters;
  onChange: (next: EmployeeListFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function EmployeeFilterBar({ value, onChange, onSearch, onReset }: Props) {
  const patch = (partial: Partial<EmployeeListFilters>) => onChange({ ...value, ...partial });

  return (
    <div className={filterStyles.filterForm}>
      <div className={filterStyles.filterRow}>
        <div className={`${filterStyles.filterField} ${filterStyles.filterFieldGrow}`}>
          <span className={filterStyles.filterLabel}>关键词</span>
          <div className={styles.searchCombo}>
            <select
              className={styles.searchType}
              value={value.searchType}
              onChange={(e) => patch({ searchType: e.target.value as SearchFieldType })}
            >
              {SEARCH_FIELD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              className={styles.searchInput}
              placeholder="请输入姓名、工号、邮箱或电话"
              value={value.keyword}
              onChange={(e) => patch({ keyword: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
          </div>
        </div>

        <label className={filterStyles.filterField}>
          <span className={filterStyles.filterLabel}>在职状态</span>
          <select
            className={filterStyles.filterControl}
            value={value.status}
            onChange={(e) => patch({ status: e.target.value as EmployeeStatus | '' })}
          >
            <option value="">请选择</option>
            <option value="在职">在职</option>
            <option value="离职">离职</option>
          </select>
        </label>

        <label className={filterStyles.filterField}>
          <span className={filterStyles.filterLabel}>账号状态</span>
          <select
            className={filterStyles.filterControl}
            value={value.accountStatus}
            onChange={(e) => patch({ accountStatus: e.target.value as AccountStatus | '' })}
          >
            {ACCOUNT_STATUS_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={filterStyles.filterRow}>
        <div className={`${filterStyles.filterField} ${filterStyles.filterFieldWide}`}>
          <span className={filterStyles.filterLabel}>创建时间</span>
          <div className={styles.dateRange}>
            <span className={styles.dateIcon} aria-hidden>
              📅
            </span>
            <input
              type="date"
              className={styles.dateInput}
              value={value.createdStart}
              onChange={(e) => patch({ createdStart: e.target.value })}
              aria-label="创建开始日期"
            />
            <span className={styles.dateSep}>-</span>
            <input
              type="date"
              className={styles.dateInput}
              value={value.createdEnd}
              onChange={(e) => patch({ createdEnd: e.target.value })}
              aria-label="创建结束日期"
            />
          </div>
        </div>

        <div className={`${filterStyles.filterField} ${filterStyles.filterFieldWide}`}>
          <span className={filterStyles.filterLabel}>生日</span>
          <div className={styles.dateRange}>
            <span className={styles.dateIcon} aria-hidden>
              📅
            </span>
            <input
              type="date"
              className={styles.dateInput}
              value={value.birthdayStart}
              onChange={(e) => patch({ birthdayStart: e.target.value })}
              aria-label="生日开始日期"
            />
            <span className={styles.dateSep}>-</span>
            <input
              type="date"
              className={styles.dateInput}
              value={value.birthdayEnd}
              onChange={(e) => patch({ birthdayEnd: e.target.value })}
              aria-label="生日结束日期"
            />
          </div>
        </div>

        <label className={filterStyles.filterField}>
          <span className={filterStyles.filterLabel}>司龄</span>
          <select
            className={filterStyles.filterControl}
            value={value.tenure}
            onChange={(e) => patch({ tenure: e.target.value as TenureRange | '' })}
          >
            {TENURE_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={filterStyles.filterActions}>
        <Button variant="primary" onClick={onSearch}>
          搜索
        </Button>
        <Button
          variant="default"
          onClick={() => {
            onChange(emptyEmployeeListFilters());
            onReset();
          }}
        >
          重置
        </Button>
      </div>
    </div>
  );
}
