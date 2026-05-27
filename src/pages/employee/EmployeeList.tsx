import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { DepartmentTreeFilter } from '../../components/DepartmentTreeFilter';
import { EmptyState } from '../../components/EmptyState';
import { EmployeeFilterBar } from './EmployeeFilterBar';
import { PageHeader } from '../../components/PageHeader';
import {
  DEPARTMENT_OPTIONS,
  useEmployees,
  type EmployeeStatus,
} from '../../context/EmployeeContext';
import { departments } from '../../mock/data';
import type { AccountStatus, Department, Employee } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import {
  cloneDepartmentTree,
  collectSubtree,
  findDepartmentNode,
} from '../../utils/departmentTree';
import {
  emptyEmployeeListFilters,
  filterEmployees,
  type EmployeeListFilters,
} from '../../utils/employeeFilters';
import formStyles from '../../styles/modalForm.module.css';
import styles from './EmployeeList.module.css';

const departmentTree = cloneDepartmentTree(departments);

const PAGE_SIZE = 20;

type BatchModal = 'dept' | 'status' | null;
export function EmployeeList() {
  const { employees, updateEmployee } = useEmployees();
  const [draftFilters, setDraftFilters] = useState<EmployeeListFilters>(emptyEmployeeListFilters);
  const [appliedFilters, setAppliedFilters] = useState<EmployeeListFilters>(emptyEmployeeListFilters);
  const [treeDeptId, setTreeDeptId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [batchModal, setBatchModal] = useState<BatchModal>(null);
  const [batchDept, setBatchDept] = useState<string>(DEPARTMENT_OPTIONS[0].name);
  const [batchStatus, setBatchStatus] = useState<EmployeeStatus>('在职');
  const [toast, setToast] = useState<string | null>(null);
  const [openMoreId, setOpenMoreId] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMoreId) return;
    const onPointerDown = (e: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) {
        setOpenMoreId(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [openMoreId]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const treeDeptScope = useMemo(() => {
    if (!treeDeptId) return null;
    const node = findDepartmentNode(departmentTree, treeDeptId);
    if (!node) return null;
    const { ids, names } = collectSubtree(node);
    return { ids: new Set(ids), names: new Set(names) };
  }, [treeDeptId]);

  const filtered = useMemo(
    () => filterEmployees(employees, appliedFilters, treeDeptScope),
    [employees, appliedFilters, treeDeptScope],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedIds = useMemo(() => [...selected], [selected]);

  const handleTreeSelect = (dept: Department | null) => {
    setTreeDeptId(dept?.id ?? null);
    setPage(1);
  };

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters });
    setPage(1);
  };

  const handleReset = () => {
    setTreeDeptId(null);
    setAppliedFilters(emptyEmployeeListFilters());
    setPage(1);
  };

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(pageData.map((e) => e.id)) : new Set());
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const applyBatchDept = () => {
    const dept = DEPARTMENT_OPTIONS.find((d) => d.name === batchDept);
    if (!dept) return;
    selectedIds.forEach((id) => {
      updateEmployee(id, { departmentId: dept.id, departmentName: dept.name });
    });
    setBatchModal(null);
    showToast(`已更新 ${selectedIds.length} 人的部门`);
  };

  const applyBatchStatus = () => {
    selectedIds.forEach((id) => updateEmployee(id, { status: batchStatus }));
    setBatchModal(null);
    showToast(`已更新 ${selectedIds.length} 人的状态`);
  };

  if (employees.length === 0) {
    return (
      <Card>
        <EmptyState
          title="暂无员工数据"
          description={'快速开始：\n1. 下载导入模板，批量导入员工数据\n2. 点击右上角「新增」单个添加'}
          actions={[
            { label: '下载导入模板', onClick: () => window.alert('已下载员工导入模板（演示）') },
            { label: '新增员工', primary: true, href: '/employee/form' },
          ]}
        />
      </Card>
    );
  }

  return (
    <>
      <PageHeader title="员工管理" />

      <div className={styles.split}>
        <aside className={styles.treeAside}>
          <DepartmentTreeFilter
            tree={departmentTree}
            selectedId={treeDeptId}
            onSelect={handleTreeSelect}
            compact
          />
        </aside>

        <div className={styles.mainCol}>
          <Card className={styles.filterCard}>
            <EmployeeFilterBar
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </Card>

          <div className={styles.tableToolbar}>
            <div className={styles.toolbarLeft}>
              <Link to="/employee/form">
                <Button variant="primary">+ 新增</Button>
              </Link>
              <Button variant="default" disabled className={styles.toolbarPlaceholderBtn}>
                <span className={styles.toolbarBtnIcon} aria-hidden>
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M11.5 2.5a1.5 1.5 0 0 1 0 2.12L5.62 10.5l-2.12 2.12a1.5 1.5 0 0 1-2.12-2.12L3.5 8.38l5.88-5.88a1.5 1.5 0 0 1 2.12 0ZM12 1.5a.5.5 0 0 0-.7 0L10.5 2.3 13.7 5.5l.8-.8a.5.5 0 0 0 0-.7L12 1.5Z" />
                  </svg>
                </span>
                修改
              </Button>
              <Button variant="default" disabled className={styles.toolbarPlaceholderBtn}>
                <span className={styles.toolbarBtnIcon} aria-hidden>
                  <UploadIcon />
                </span>
                批量导入
              </Button>
              <Button variant="default" disabled className={styles.toolbarPlaceholderBtn}>
                <span className={styles.toolbarBtnIcon} aria-hidden>
                  <UploadIcon />
                </span>
                批量离职
              </Button>
              <Button variant="default" disabled className={styles.toolbarPlaceholderBtn}>
                <span className={styles.toolbarBtnIcon} aria-hidden>
                  <UploadIcon />
                </span>
                批量修改
              </Button>
            </div>
            <div className={styles.toolbarIconGroup} aria-hidden>
              <span className={styles.toolbarIconBtn}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="M10.5 10.5 14 14" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.toolbarIconBtn}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path
                    d="M13 3.5A5.5 5.5 0 0 0 3.9 5.3M3 3.5v2.5h2.5M3 12.5a5.5 5.5 0 0 0 9.1-1.8M13 12.5V10H10.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={styles.toolbarIconBtn}>
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2.5 3h3v3h-3V3Zm4.5 0h3v3H7V3Zm4.5 0h3v3h-3V3ZM2.5 6.5h3v3h-3v-3Zm4.5 0h3v3H7v-3Zm4.5 0h3v3h-3v-3ZM2.5 10h3v3h-3v-3Zm4.5 0h3v3H7v-3Zm4.5 0h3v3h-3v-3Z" />
                </svg>
              </span>
            </div>
          </div>

      {selected.size > 0 && (
        <div className={styles.batchBar}>
          已选择 {selected.size} 项:
          <Button variant="default" onClick={() => setBatchModal('dept')}>
            批量编辑部门
          </Button>
          <Button variant="default" onClick={() => setBatchModal('status')}>
            批量设置状态
          </Button>
          <Button variant="text" onClick={() => setSelected(new Set())}>
            取消选择
          </Button>
        </div>
      )}

      <Card className={styles.tableCard}>
        {pageData.length === 0 ? (
          <p className={styles.previewHint} style={{ padding: 24 }}>
            没有匹配的员工，请调整筛选条件
          </p>
        ) : (
          <div className={styles.tableScroll} ref={tableRef}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={pageData.length > 0 && pageData.every((e) => selected.has(e.id))}
                      onChange={(e) => toggleAll(e.target.checked)}
                    />
                  </th>
                  <th>员工姓名</th>
                  <th>工号</th>
                  <th>员工生日</th>
                  <th>入职时间</th>
                  <th>部门</th>
                  <th>手机号码</th>
                  <th>邮箱</th>
                  <th>试用截止</th>
                  <th>是否绑定微信小程序</th>
                  <th>最近登录时间</th>
                  <th>角色</th>
                  <th>在职状态</th>
                  <th>账号状态</th>
                  <th style={{ width: 120 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((emp, i) => (
                  <EmployeeRow
                    key={emp.id}
                    emp={emp}
                    stripe={i % 2 === 1}
                    checked={selected.has(emp.id)}
                    onToggle={() => toggleOne(emp.id)}
                    moreOpen={openMoreId === emp.id}
                    onMoreToggle={() =>
                      setOpenMoreId((id) => (id === emp.id ? null : emp.id))
                    }
                    onMoreClose={() => setOpenMoreId(null)}
                    onAccountChange={(status: AccountStatus) => {
                      updateEmployee(emp.id, { accountStatus: status });
                      showToast(
                        status === '正常' ? `已启用 ${emp.name} 的账号` : `已禁用 ${emp.name} 的账号`,
                      );
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={styles.pagination}>
          <span>
            共 {filtered.length} 条 · 每页 {PAGE_SIZE} 条
          </span>
          <div className={styles.pages}>
            <Button variant="text" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ◀
            </Button>
            <span>
              {page} / {totalPages}
            </span>
            <Button variant="text" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              ▶
            </Button>
          </div>
        </div>
      </Card>
        </div>
      </div>

      {batchModal === 'dept' && (
        <div className={styles.modalOverlay} onClick={() => setBatchModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>批量编辑部门</h3>
            <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
              <span>新部门</span>
              <select value={batchDept} onChange={(e) => setBatchDept(e.target.value)}>
                {DEPARTMENT_OPTIONS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.modalActions}>
              <Button variant="default" onClick={() => setBatchModal(null)}>
                取消
              </Button>
              <Button variant="primary" onClick={applyBatchDept}>
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {batchModal === 'status' && (
        <div className={styles.modalOverlay} onClick={() => setBatchModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>批量设置状态</h3>
            <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
              <span>状态</span>
              <select
                value={batchStatus}
                onChange={(e) => setBatchStatus(e.target.value as EmployeeStatus)}
              >
                <option value="在职">在职</option>
                <option value="离职">离职</option>
              </select>
            </label>
            <div className={styles.modalActions}>
              <Button variant="default" onClick={() => setBatchModal(null)}>
                取消
              </Button>
              <Button variant="primary" onClick={applyBatchStatus}>
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}

function EmployeeRow({
  emp,
  stripe,
  checked,
  onToggle,
  moreOpen,
  onMoreToggle,
  onMoreClose,
  onAccountChange,
}: {
  emp: Employee;
  stripe: boolean;
  checked: boolean;
  onToggle: () => void;
  moreOpen: boolean;
  onMoreToggle: () => void;
  onMoreClose: () => void;
  onAccountChange: (status: AccountStatus) => void;
}) {
  const accountEnabled = emp.accountStatus === '正常';

  return (
    <tr className={stripe ? styles.stripe : ''}>
      <td>
        <input type="checkbox" checked={checked} onChange={onToggle} />
      </td>
      <td>{emp.name}</td>
      <td className={styles.cellNowrap}>{emp.empNo || '—'}</td>
      <td className={styles.cellNowrap}>{formatDate(emp.birthday)}</td>
      <td className={styles.cellNowrap}>{formatDate(emp.joinDate)}</td>
      <td>{emp.departmentName}</td>
      <td className={styles.cellNowrap}>{emp.phone || '—'}</td>
      <td>{emp.email || '—'}</td>
      <td className={styles.cellNowrap}>{formatDate(emp.probationEndDate)}</td>
      <td>{emp.wechatBound ? '是' : '否'}</td>
      <td className={styles.cellNowrap}>{formatDateTime(emp.lastLoginAt)}</td>
      <td>{emp.role}</td>
      <td>{emp.status}</td>
      <td>
        <label className={styles.accountSwitch} title={emp.accountStatus}>
          <input
            type="checkbox"
            checked={accountEnabled}
            onChange={(e) => onAccountChange(e.target.checked ? '正常' : '已禁用')}
          />
          <span className={styles.accountSlider} />
        </label>
      </td>
      <td className={styles.ops}>
        <Link to={`/employee/form/${emp.id}`}>
          <Button variant="text">修改</Button>
        </Link>
        <div className={styles.moreWrap}>
          <Button variant="text" type="button" onClick={onMoreToggle}>
            更多
          </Button>
          {moreOpen && (
            <div className={styles.moreMenu} role="menu">
              <Link
                to={`/employee/detail/${emp.id}`}
                className={styles.moreMenuItem}
                onClick={onMoreClose}
              >
                查看详情
              </Link>
              <span className={`${styles.moreMenuItem} ${styles.moreMenuPlaceholder}`} role="presentation">
                <span className={styles.moreMenuIcon} aria-hidden>
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M10.5 2a3.5 3.5 0 0 0-2.45 6l-3.3 3.3a1 1 0 1 0 1.42 1.42l3.3-3.3A3.5 3.5 0 1 0 10.5 2Zm0 1.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 13.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5Z" />
                  </svg>
                </span>
                重置密码
              </span>
              <span className={`${styles.moreMenuItem} ${styles.moreMenuPlaceholder}`} role="presentation">
                <span className={styles.moreMenuIcon} aria-hidden>
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 1a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm2.53 3.03a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0L5.72 8.28a.75.75 0 1 1 1.06-1.06l.72.72 1.97-1.97a.75.75 0 0 1 1.06 0Z" />
                  </svg>
                </span>
                分配角色
              </span>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 2.5a.5.5 0 0 1 .5.5v5.79l1.65-1.65a.5.5 0 0 1 .7.7l-2.5 2.5a.5.5 0 0 1-.7 0l-2.5-2.5a.5.5 0 1 1 .7-.7L7.5 8.79V3a.5.5 0 0 1 .5-.5Z" />
      <path d="M3 11.5a.5.5 0 0 0-.5.5v1A1.5 1.5 0 0 0 4 14.5h8a1.5 1.5 0 0 0 1.5-1.5v-1a.5.5 0 0 0-1 0v1a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 0-1 0Z" />
    </svg>
  );
}
