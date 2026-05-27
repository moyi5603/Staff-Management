import { Button } from '../../components/Button';
import { ProjectMetaBadge } from '../../components/ProjectMetaBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { useMemo } from 'react';
import type { Employee, Project, ProjectMember } from '../../types';
import { getProjectDisplayStatus } from '../../utils/projectStatus';
import modalStyles from '../position/PositionList.module.css';
import styles from './ProjectList.module.css';

function memberDepartment(m: ProjectMember, employeeById: Map<string, Employee>): string {
  return m.departmentName ?? employeeById.get(m.employeeId)?.departmentName ?? '—';
}

interface Props {
  project: Project;
  employees: Employee[];
  onEdit: () => void;
  onClose: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  onDelete?: () => void;
}

export function ProjectDetailModal({
  project,
  employees,
  onEdit,
  onClose,
  onStart,
  onEnd,
  onDelete,
}: Props) {
  const employeeById = useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);

  return (
    <div className={modalStyles.modalOverlay} onClick={onClose}>
      <div className={`${modalStyles.modal} ${modalStyles.modalWide}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.detailHead}>
          <h3>{project.name}</h3>
          <div className={styles.detailBadges}>
            <ProjectMetaBadge label={project.level} />
            <ProjectMetaBadge label={project.priority} />
            <StatusBadge status={getProjectDisplayStatus(project)} />
          </div>
        </div>

        <dl className={modalStyles.dl}>
          <dt>项目级别</dt>
          <dd>{project.level}</dd>
          <dt>项目优先级</dt>
          <dd>{project.priority}</dd>
          <dt>主责部门</dt>
          <dd>{project.departmentName}</dd>
          <dt>项目负责人</dt>
          <dd>{project.leaderName}</dd>
          <dt>参与部门</dt>
          <dd>{project.relatedDepartments.length > 0 ? project.relatedDepartments.join('、') : '—'}</dd>
          <dt>开始日期</dt>
          <dd>{project.startDate}</dd>
          <dt>结束日期</dt>
          <dd>{project.endDate ?? '—'}</dd>
          <dt>项目简介</dt>
          <dd className={modalStyles.textBlock}>{project.description ?? '—'}</dd>
          <dt>项目成员</dt>
          <dd>
            {project.members.length > 0 ? (
              <table className={modalStyles.kpiTable}>
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>部门</th>
                    <th>角色</th>
                  </tr>
                </thead>
                <tbody>
                  {project.members.map((m) => (
                    <tr key={m.employeeId}>
                      <td>{m.name}</td>
                      <td>{memberDepartment(m, employeeById)}</td>
                      <td>{m.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              '—'
            )}
          </dd>
        </dl>

        <div className={modalStyles.modalActions}>
          {project.status === '未启动' && onStart && (
            <Button variant="default" onClick={onStart}>
              启动项目
            </Button>
          )}
          {project.status === '进行中' && onEnd && (
            <Button variant="default" onClick={onEnd}>
              结束项目
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" onClick={onDelete}>
              删除
            </Button>
          )}
          <Button variant="default" onClick={onClose}>
            关闭
          </Button>
          <Button variant="primary" onClick={onEdit}>
            编辑
          </Button>
        </div>
      </div>
    </div>
  );
}
