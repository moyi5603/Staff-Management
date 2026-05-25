import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { DepartmentTreeFilter } from '../../components/DepartmentTreeFilter';
import { EmptyState } from '../../components/EmptyState';
import { EmployeeFilterBar } from './EmployeeFilterBar';
import { PageHeader } from '../../components/PageHeader';
import {
  DEPARTMENT_OPTIONS,
  exportEmployeesCsv,
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
import styles from './EmployeeList.module.css';

const departmentTree = cloneDepartmentTree(departments);

const PAGE_SIZE = 20;

type BatchModal = 'dept' | 'status' | 'delete' | null;
type DeleteTarget = { ids: string[]; names: string[] };

export function EmployeeList() {
  const { employees, removeEmployees, updateEmployee } = useEmployees();
  const [draftFilters, setDraftFilters] = useState<EmployeeListFilters>(emptyEmployeeListFilters);
  const [appliedFilters, setAppliedFilters] = useState<EmployeeListFilters>(emptyEmployeeListFilters);
  const [treeDeptId, setTreeDeptId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [showImport, setShowImport] = useState(false);
  const [batchModal, setBatchModal] = useState<BatchModal>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [batchDept, setBatchDept] = useState<string>(DEPARTMENT_OPTIONS[0].name);
  const [batchStatus, setBatchStatus] = useState<EmployeeStatus>('在职');
  const [toast, setToast] = useState<string | null>(null);

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

  const handleExport = () => {
    exportEmployeesCsv(filtered);
    showToast(`已导出 ${filtered.length} 条员工数据`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    removeEmployees(deleteTarget.ids);
    setSelected((prev) => {
      const next = new Set(prev);
      deleteTarget.ids.forEach((id) => next.delete(id));
      return next;
    });
    setDeleteTarget(null);
    showToast(`已删除 ${deleteTarget.ids.length} 名员工`);
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

  const requestDelete = (ids: string[], names: string[]) => {
    setDeleteTarget({ ids, names });
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
      <PageHeader
        title="员工管理"
        actions={
          <>
            <Link to="/employee/form">
              <Button variant="primary">新增</Button>
            </Link>
            <Button variant="default" onClick={() => setShowImport(true)}>
              + 导入
            </Button>
            <Button variant="default" onClick={handleExport}>
              ↑ 导出
            </Button>
          </>
        }
      />

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
          <Card className={styles.toolbar}>
            <EmployeeFilterBar
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </Card>

      {selected.size > 0 && (
        <div className={styles.batchBar}>
          已选择 {selected.size} 项:
          <Button variant="default" onClick={() => setBatchModal('dept')}>
            批量编辑部门
          </Button>
          <Button variant="default" onClick={() => setBatchModal('status')}>
            批量设置状态
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              requestDelete(
                selectedIds,
                employees.filter((e) => selected.has(e.id)).map((e) => e.name),
              )
            }
          >
            批量删除
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
          <div className={styles.tableScroll}>
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

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onDone={() => showToast('导入完成（演示数据）')}
        />
      )}

      {batchModal === 'dept' && (
        <div className={styles.modalOverlay} onClick={() => setBatchModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>批量编辑部门</h3>
            <label className={styles.formField}>
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
            <label className={styles.formField}>
              <span>状态</span>
              <select
                value={batchStatus}
                onChange={(e) => setBatchStatus(e.target.value as EmployeeStatus)}
              >
                <option value="在职">在职</option>
                <option value="休假">休假</option>
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

      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p className={styles.confirmText}>
              确定删除 {deleteTarget.names.slice(0, 3).join('、')}
              {deleteTarget.names.length > 3 ? ` 等 ${deleteTarget.names.length} 人` : ''}？
              此操作为演示，刷新页面将恢复 Mock 数据。
            </p>
            <div className={styles.modalActions}>
              <Button variant="default" onClick={() => setDeleteTarget(null)}>
                取消
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                删除
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
  onAccountChange,
}: {
  emp: Employee;
  stripe: boolean;
  checked: boolean;
  onToggle: () => void;
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
          <Button variant="text" type="button">
            更多
          </Button>
        </div>
      </td>
    </tr>
  );
}

function ImportModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [step, setStep] = useState(1);
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>批量导入员工 · 步骤 {step}/3</h3>
        {step === 1 && (
          <>
            <p>
              <Button variant="text" onClick={() => window.alert('已下载员工导入模板（演示）')}>
                下载模板.xlsx
              </Button>
            </p>
            <div
              className={`${styles.uploadZone} ${styles.uploadZoneBtn}`}
              role="button"
              tabIndex={0}
              onClick={() => window.alert('已选择文件（演示，未实际上传解析）')}
              onKeyDown={(e) => e.key === 'Enter' && window.alert('已选择文件（演示）')}
            >
              拖拽上传或点击上传 (.xlsx / .xls)
            </div>
          </>
        )}
        {step === 2 && (
          <p className={styles.previewHint}>预览前 10 条数据，冲突行将高亮显示（演示占位）</p>
        )}
        {step === 3 && <p>导入完成：成功 998 条 / 失败 2 条（演示结果）</p>}
        <div className={styles.modalActions}>
          <Button variant="default" onClick={onClose}>
            取消
          </Button>
          {step > 1 && (
            <Button variant="default" onClick={() => setStep((s) => s - 1)}>
              返回
            </Button>
          )}
          {step < 3 ? (
            <Button variant="primary" onClick={() => setStep((s) => s + 1)}>
              下一步
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                onDone();
                onClose();
              }}
            >
              完成
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
