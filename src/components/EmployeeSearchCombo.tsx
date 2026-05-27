import { useEffect, useMemo, useRef, useState } from 'react';
import type { Employee } from '../types';
import styles from './EmployeeSearchCombo.module.css';

function filterEmployees(list: Employee[], query: string): Employee[] {
  const q = query.trim();
  if (!q) return list.slice(0, 12);
  const lower = q.toLowerCase();
  return list
    .filter(
      (e) =>
        e.name.includes(q) ||
        e.empNo.includes(q) ||
        (e.nickname?.includes(q) ?? false) ||
        e.departmentName.includes(q) ||
        e.phone.includes(q) ||
        e.email.toLowerCase().includes(lower),
    )
    .slice(0, 12);
}

interface Props {
  employees: Employee[];
  valueId: string;
  onChange: (employee: Employee | null) => void;
  placeholder?: string;
  disabled?: boolean;
  /** 仅展示在职员工，默认 true */
  activeOnly?: boolean;
}

export function EmployeeSearchCombo({
  employees,
  valueId,
  onChange,
  placeholder = '输入姓名、工号、部门等搜索',
  disabled = false,
  activeOnly = true,
}: Props) {
  const pool = useMemo(
    () => (activeOnly ? employees.filter((e) => e.status === '在职') : employees),
    [employees, activeOnly],
  );
  const selected = useMemo(() => pool.find((e) => e.id === valueId), [pool, valueId]);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(selected?.name ?? '');
  }, [selected?.id, selected?.name]);

  const filtered = useMemo(() => filterEmployees(pool, query), [pool, query]);

  const pickEmployee = (emp: Employee) => {
    onChange(emp);
    setQuery(emp.name);
    setOpen(false);
    setActiveIndex(0);
  };

  const syncOnBlur = () => {
    const q = query.trim();
    if (!q) {
      onChange(null);
      setQuery('');
      return;
    }
    const exact = pool.find((e) => e.name === q);
    if (exact) {
      onChange(exact);
      setQuery(exact.name);
      return;
    }
    if (selected) setQuery(selected.name);
    else setQuery('');
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
      else syncOnBlur();
    } else if (e.key === 'Escape') {
      setOpen(false);
      if (selected) setQuery(selected.name);
      else setQuery('');
    }
  };

  const showDropdown = open && !disabled;
  const showList = showDropdown && filtered.length > 0;
  const showEmpty = showDropdown && query.trim().length > 0 && filtered.length === 0;

  return (
    <div
      className={styles.comboWrap}
      ref={wrapRef}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
          syncOnBlur();
        }
      }}
    >
      <input
        type="text"
        className={styles.comboInput}
        placeholder={placeholder}
        value={query}
        disabled={disabled}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(0);
          if (!e.target.value.trim()) onChange(null);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {showList && (
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
      {showEmpty && <p className={styles.comboEmpty}>无匹配员工</p>}
    </div>
  );
}
