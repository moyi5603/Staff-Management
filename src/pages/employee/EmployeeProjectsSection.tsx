import { StatusBadge } from '../../components/StatusBadge';
import type { Employee } from '../../types';
import { formatDate } from '../../utils/formatDate';
import styles from './EmployeeProjectsSection.module.css';

type EmployeeProject = Employee['projects'][number];

interface Props {
  projects: EmployeeProject[];
}

export function EmployeeProjectsSection({ projects }: Props) {
  return (
    <div>
      <h4 className={styles.title}>项目列表</h4>

      {projects.length === 0 ? (
        <p className={styles.empty}>暂无参与项目。</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>项目名称</th>
                <th>我的角色</th>
                <th>项目状态</th>
                <th>开始时间</th>
                <th>结束时间</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, index) => (
                <tr key={p.projectId} className={index % 2 === 1 ? styles.stripe : undefined}>
                  <td className={styles.nameCell} title={p.projectName}>
                    {p.projectName}
                  </td>
                  <td>{p.role}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className={styles.dateCell}>{formatDate(p.startDate)}</td>
                  <td className={styles.dateCell}>{formatDate(p.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
