import { useMemo, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import type { Employee, ProjectMember } from '../../types';
import styles from './ProjectList.module.css';

const DEFAULT_ROLE = '一般成员' as const;

interface Props {
  availableEmployees: Employee[];
  disabled?: boolean;
  onAdd: (member: ProjectMember) => void;
}

export function MemberSearchCombo({ availableEmployees, disabled, onAdd }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return availableEmployees.slice(0, 12);
    return availableEmployees.filter((e) => e.name.includes(q)).slice(0, 12);
  }, [query, availableEmployees]);

  const exactEmployee = useMemo(() => {
    const q = query.trim();
    if (!q) return undefined;
    return availableEmployees.find((e) => e.name === q);
  }, [query, availableEmployees]);

  const addMember = (member: ProjectMember) => {
    onAdd(member);
    setQuery('');
    setOpen(false);
    setActiveIndex(0);
  };

  const handleAdd = () => {
    const q = query.trim();
    if (!q) return;
    if (exactEmployee) {
      addMember({
        employeeId: exactEmployee.id,
        name: exactEmployee.name,
        role: DEFAULT_ROLE,
      });
      return;
    }
    addMember({ employeeId: `manual-${Date.now()}`, name: q, role: DEFAULT_ROLE });
  };

  const pickEmployee = (emp: Employee) => {
    addMember({ employeeId: emp.id, name: emp.name, role: DEFAULT_ROLE });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIndex]) pickEmployee(filtered[activeIndex]);
      else handleAdd();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showDropdown = open && filtered.length > 0;
  const showManualHint = open && query.trim().length > 0 && filtered.length === 0;

  return (
    <div className={styles.memberAddRow}>
      <div
        className={styles.comboWrap}
        ref={wrapRef}
        onBlur={(e) => {
          if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
        }}
      >
        <input
          className={styles.memberAddInput}
          placeholder="输入姓名搜索并添加成员"
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {showDropdown && (
          <ul className={styles.comboDropdown} role="listbox">
            {filtered.map((emp, i) => (
              <li key={emp.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  className={i === activeIndex ? styles.comboOptionActive : styles.comboOption}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pickEmployee(emp)}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <span className={styles.comboOptionName}>{emp.name}</span>
                  <span className={styles.comboOptionMeta}>
                    {emp.departmentName} · {emp.empNo}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {showManualHint && (
          <p className={styles.comboHint}>无匹配员工，点击「添加」将按输入姓名录入（默认一般成员）</p>
        )}
      </div>
      <Button variant="primary" onClick={handleAdd} disabled={disabled || !query.trim()}>
        添加
      </Button>
    </div>
  );
}
