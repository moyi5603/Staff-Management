import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { employees, maskPhone } from '../../mock/data';
import type { Employee, EmployeeStatus } from '../../types';
import styles from './EmployeeList.module.css';

const PAGE_SIZE = 20;

export function EmployeeList() {
  const [keyword, setKeyword] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | ''>('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [showImport, setShowImport] = useState(false);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const kw = keyword.trim().toLowerCase();
      const matchKw =
        !kw ||
        e.name.toLowerCase().includes(kw) ||
        e.empNo.toLowerCase().includes(kw) ||
        e.phone.includes(kw) ||
        e.email.toLowerCase().includes(kw);
      const matchDept = !deptFilter || e.departmentName === deptFilter;
      const matchStatus = !statusFilter || e.status === statusFilter;
      return matchKw && matchDept && matchStatus;
    });
  }, [keyword, deptFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const deptOptions = [...new Set(employees.map((e) => e.departmentName))];

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(pageData.map((e) => e.id)) : new Set());
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  if (employees.length === 0) {
    return (
      <Card>
        <EmptyState
          title="暂无员工数据"
          description={'快速开始：\n1. 下载导入模板，批量导入员工数据\n2. 点击右上角「新增」单个添加'}
          actions={[
            { label: '下载导入模板' },
            { label: '新增员工', primary: true },
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
            <Button variant="default">↑ 导出</Button>
          </>
        }
      />

      <Card className={styles.toolbar}>
        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            placeholder="搜索姓名、工号、手机号、邮箱..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
          />
          <Button variant="primary">🔍 搜索</Button>
        </div>
        <div className={styles.filters}>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">部门 ▼</option>
            {deptOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as EmployeeStatus | '')}>
            <option value="">状态 ▼</option>
            <option value="在职">在职</option>
            <option value="休假">休假</option>
            <option value="离职">离职</option>
          </select>
          <Button
            variant="text"
            onClick={() => {
              setDeptFilter('');
              setStatusFilter('');
              setKeyword('');
            }}
          >
            清除筛选
          </Button>
        </div>
      </Card>

      {selected.size > 0 && (
        <div className={styles.batchBar}>
          已选择 {selected.size} 项:
          <Button variant="default">批量编辑部门</Button>
          <Button variant="default">批量设置状态</Button>
          <Button variant="danger">批量删除</Button>
          <Button variant="text" onClick={() => setSelected(new Set())}>
            取消选择
          </Button>
        </div>
      )}

      <Card className={styles.tableCard}>
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
              <th>姓名</th>
              <th>工号</th>
              <th>部门</th>
              <th>岗位</th>
              <th>手机号</th>
              <th>邮箱</th>
              <th>入职日期</th>
              <th>状态</th>
              <th style={{ width: 180 }}>操作</th>
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
              />
            ))}
          </tbody>
        </table>
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

      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </>
  );
}

function EmployeeRow({
  emp,
  stripe,
  checked,
  onToggle,
}: {
  emp: Employee;
  stripe: boolean;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <tr className={stripe ? styles.stripe : ''}>
      <td>
        <input type="checkbox" checked={checked} onChange={onToggle} />
      </td>
      <td>
        <div className={styles.nameCell}>
          <span className={styles.avatarSm}>{emp.name.charAt(0)}</span>
          <span title={`手机尾号：${emp.phoneSuffix}`}>{emp.name}</span>
        </div>
      </td>
      <td>{emp.empNo}</td>
      <td>{emp.departmentName}</td>
      <td>{emp.positionName}</td>
      <td title={`手机尾号：${emp.phoneSuffix}`}>{maskPhone(emp.phone)}</td>
      <td>{emp.email}</td>
      <td>{emp.joinDate}</td>
      <td>
        <StatusBadge status={emp.status} />
      </td>
      <td className={styles.ops}>
        <Link to={`/employee/detail/${emp.id}`}>
          <Button variant="text">详情</Button>
        </Link>
        <Link to={`/employee/form/${emp.id}`}>
          <Button variant="text">编辑</Button>
        </Link>
        <Button variant="danger">删除</Button>
      </td>
    </tr>
  );
}

function ImportModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>批量导入员工 · 步骤 {step}/3</h3>
        {step === 1 && (
          <>
            <p>
              <Button variant="text">下载模板.xlsx</Button>
            </p>
            <div className={styles.uploadZone}>拖拽上传或点击上传 (.xlsx / .xls)</div>
          </>
        )}
        {step === 2 && (
          <p className={styles.previewHint}>预览前 10 条数据，冲突行将高亮显示</p>
        )}
        {step === 3 && <p>导入完成：成功 998 条 / 失败 2 条</p>}
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
            <Button variant="primary" onClick={onClose}>
              完成
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
