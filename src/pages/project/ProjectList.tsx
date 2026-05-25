import { useCallback, useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { PageHeader } from '../../components/PageHeader';
import { ProjectMetaBadge } from '../../components/ProjectMetaBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { useEmployees } from '../../context/EmployeeContext';
import { useProjects } from '../../context/ProjectContext';
import { departments } from '../../mock/data';
import type { Project, ProjectStatus } from '../../types';
import { cloneDepartmentTree, flattenDepartmentTree } from '../../utils/departmentTree';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ProjectFilterBar } from './ProjectFilterBar';
import { ProjectFormModal, type ProjectFormValues } from './ProjectFormModal';
import {
  emptyProjectListFilters,
  filterProjects,
  hasActiveProjectFilters,
  type ProjectListFilters,
} from '../../utils/projectFilters';
import styles from './ProjectList.module.css';
import toastStyles from '../position/PositionList.module.css';

const STATUS_TABS = ['全部', '未启动', '进行中', '已结束'] as const;
type StatusTab = (typeof STATUS_TABS)[number];

type FormModalState = { type: 'create' } | { type: 'edit'; project: Project };

function projectIcon(status: ProjectStatus): string {
  if (status === '进行中') return '🟢';
  if (status === '未启动') return '○';
  return '⬡';
}

function buildProject(
  values: ProjectFormValues,
  deptName: string,
  leaderName: string,
  existing?: Project,
): Project {
  return {
    id: existing?.id ?? `proj-${Date.now()}`,
    name: values.name,
    description: values.description || undefined,
    departmentId: values.departmentId,
    departmentName: deptName,
    relatedDepartments: values.relatedDepartments,
    leaderId: values.leaderId,
    leaderName,
    members: values.members,
    startDate: values.startDate,
    endDate: values.endDate || undefined,
    status: values.status,
    level: values.level,
    priority: values.priority,
  };
}

export function ProjectList() {
  const { projects, addProject, updateProject, removeProject } = useProjects();
  const { employees } = useEmployees();
  const [statusTab, setStatusTab] = useState<StatusTab>('全部');
  const [draftFilters, setDraftFilters] = useState<ProjectListFilters>(emptyProjectListFilters);
  const [appliedFilters, setAppliedFilters] = useState<ProjectListFilters>(emptyProjectListFilters);
  const [formModal, setFormModal] = useState<FormModalState | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [openMoreId, setOpenMoreId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const departmentOptions = useMemo(() => {
    const flat = flattenDepartmentTree(cloneDepartmentTree(departments));
    return flat.filter((d) => d.id !== 'dept-root').map((d) => ({ id: d.id, name: d.name }));
  }, []);

  const relatedDepartmentNames = useMemo(
    () => departmentOptions.map((d) => d.name),
    [departmentOptions],
  );

  const deptNameById = useMemo(
    () => new Map(departmentOptions.map((d) => [d.id, d.name])),
    [departmentOptions],
  );

  const employeeById = useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const searchFiltered = useMemo(
    () => filterProjects(projects, appliedFilters),
    [projects, appliedFilters],
  );

  const handleSearch = () => setAppliedFilters({ ...draftFilters });

  const handleResetFilters = () => {
    const empty = emptyProjectListFilters();
    setDraftFilters(empty);
    setAppliedFilters(empty);
  };

  const tabCounts = useMemo(() => {
    const counts: Record<StatusTab, number> = {
      全部: searchFiltered.length,
      未启动: 0,
      进行中: 0,
      已结束: 0,
    };
    searchFiltered.forEach((p) => {
      if (p.status === '未启动') counts['未启动'] += 1;
      if (p.status === '进行中') counts['进行中'] += 1;
      if (p.status === '已结束') counts['已结束'] += 1;
    });
    return counts;
  }, [searchFiltered]);

  const filtered = useMemo(() => {
    return searchFiltered.filter((p) => statusTab === '全部' || p.status === statusTab);
  }, [searchFiltered, statusTab]);

  const handleSave = (values: ProjectFormValues) => {
    const deptName = deptNameById.get(values.departmentId) ?? '—';
    const leader = employeeById.get(values.leaderId);
    const leaderName = leader?.name ?? '—';

    if (formModal?.type === 'edit') {
      const prevIds = formModal.project.members.map((m) => m.employeeId);
      const updated = buildProject(values, deptName, leaderName, formModal.project);
      updateProject(updated, prevIds);
      setDetailProject((prev) => (prev?.id === updated.id ? updated : prev));
      showToast('项目信息已保存');
    } else {
      const created = buildProject(values, deptName, leaderName);
      addProject(created);
      showToast('项目已新增');
    }
    setFormModal(null);
  };

  const openEdit = (project: Project) => {
    setDetailProject(null);
    setOpenMoreId(null);
    setFormModal({ type: 'edit', project });
  };

  const changeStatus = (project: Project, status: ProjectStatus, endDate?: string) => {
    const prevIds = project.members.map((m) => m.employeeId);
    const updated: Project = {
      ...project,
      status,
      endDate: status === '已结束' ? endDate ?? new Date().toISOString().slice(0, 10) : project.endDate,
    };
    if (status !== '已结束') {
      updated.endDate = status === '未启动' ? undefined : project.endDate;
    }
    updateProject(updated, prevIds);
    setDetailProject((prev) => (prev?.id === updated.id ? updated : prev));
    showToast(status === '进行中' ? '项目已启动' : '项目已结束');
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    removeProject(deleteTarget.id);
    setDeleteTarget(null);
    setDetailProject(null);
    setOpenMoreId(null);
    showToast(`已删除项目「${deleteTarget.name}」`);
  };

  return (
    <>
      <PageHeader
        title="项目列表"
        actions={
          <Button variant="primary" onClick={() => setFormModal({ type: 'create' })}>
            + 新增项目
          </Button>
        }
      />

      <div className={styles.tabs}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={statusTab === tab ? styles.tabActive : ''}
            onClick={() => setStatusTab(tab)}
          >
            {tab}
            <span className={styles.tabCount}>{tabCounts[tab]}</span>
          </button>
        ))}
      </div>

      <Card className={styles.filterCard}>
        <ProjectFilterBar
          value={draftFilters}
          onChange={setDraftFilters}
          onSearch={handleSearch}
          onReset={handleResetFilters}
        />
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="暂无项目"
          description="调整筛选条件或新增项目"
          actions={
            statusTab === '全部' && !hasActiveProjectFilters(appliedFilters)
              ? [{ label: '+ 新增项目', onClick: () => setFormModal({ type: 'create' }), primary: true }]
              : []
          }
        />
      ) : (
        <div className={styles.cards}>
          {filtered.map((p) => (
            <Card key={p.id} className={styles.projectCard}>
              <div className={styles.cardHead}>
                <button type="button" className={styles.nameBtn} onClick={() => setDetailProject(p)}>
                  <strong>
                    {projectIcon(p.status)} {p.name}
                  </strong>
                </button>
                <div className={styles.cardHeadRight}>
                  <ProjectMetaBadge label={p.level} />
                  <ProjectMetaBadge label={p.priority} />
                  <StatusBadge status={p.status} />
                  <Button variant="text" onClick={() => openEdit(p)}>
                    编辑
                  </Button>
                  <div className={styles.moreWrap}>
                    <Button variant="text" onClick={() => setOpenMoreId((id) => (id === p.id ? null : p.id))}>
                      更多
                    </Button>
                    {openMoreId === p.id && (
                      <div className={styles.moreMenu} role="menu">
                        <button type="button" onClick={() => { setOpenMoreId(null); setDetailProject(p); }}>
                          查看详情
                        </button>
                        {p.status === '未启动' && (
                          <button type="button" onClick={() => { setOpenMoreId(null); changeStatus(p, '进行中'); }}>
                            启动项目
                          </button>
                        )}
                        {p.status === '进行中' && (
                          <button type="button" onClick={() => { setOpenMoreId(null); changeStatus(p, '已结束'); }}>
                            结束项目
                          </button>
                        )}
                        <button
                          type="button"
                          className={styles.dangerItem}
                          onClick={() => {
                            setOpenMoreId(null);
                            setDeleteTarget(p);
                          }}
                        >
                          删除
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p>
                项目级别：{p.level} | 优先级：{p.priority} | 主责部门：{p.departmentName} | 负责人：
                {p.leaderName}
              </p>
              {p.members.length > 0 && (
                <p>参与人：{p.members.map((m) => m.name).join('、')}</p>
              )}
              {p.relatedDepartments.length > 0 && <p>参与部门：{p.relatedDepartments.join('、')}</p>}
              <p>
                开始：{p.startDate}
                {p.endDate && ` | 结束：${p.endDate}`}
              </p>
              {p.description && <p className={styles.desc}>{p.description}</p>}
            </Card>
          ))}
        </div>
      )}

      {formModal && (
        <ProjectFormModal
          title={formModal.type === 'create' ? '新增项目' : '编辑项目'}
          initial={formModal.type === 'edit' ? formModal.project : undefined}
          departmentOptions={departmentOptions}
          relatedDepartmentNames={relatedDepartmentNames}
          employeeOptions={employees}
          defaultDepartmentId={departmentOptions[0]?.id}
          onSave={handleSave}
          onClose={() => setFormModal(null)}
        />
      )}

      {detailProject && (
        <ProjectDetailModal
          project={detailProject}
          onEdit={() => openEdit(detailProject)}
          onClose={() => setDetailProject(null)}
          onStart={
            detailProject.status === '未启动'
              ? () => changeStatus(detailProject, '进行中')
              : undefined
          }
          onEnd={
            detailProject.status === '进行中'
              ? () => changeStatus(detailProject, '已结束')
              : undefined
          }
          onDelete={() => {
            setDeleteTarget(detailProject);
          }}
        />
      )}

      {deleteTarget && (
        <div className={toastStyles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={toastStyles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p className={styles.confirmText}>
              确定删除项目「{deleteTarget.name}」？关联员工的项目经验将同步移除（演示数据，刷新页面恢复 Mock）。
            </p>
            <div className={toastStyles.modalActions}>
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

      {toast && <div className={toastStyles.toast}>{toast}</div>}
    </>
  );
}
