import type { Employee } from '../../types';
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
                <th>状态</th>
                <th>项目级别</th>
                <th>优先级</th>
                <th>主责部门</th>
                <th>负责人</th>
                <th>参与人</th>
                <th>开始日期</th>
                <th>结束日期</th>
                <th>我的角色</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, index) => (
                <tr key={p.projectId} className={index % 2 === 1 ? styles.stripe : undefined}>
                  <td className={styles.nameCell} title={p.projectName}>
                    {p.projectName}
                  </td>
                  <td>{p.status}</td>
                  <td>{p.level}</td>
                  <td>{p.priority}</td>
                  <td>{p.departmentName}</td>
                  <td className={styles.cellNowrap}>{p.leaderName}</td>
                  <td className={styles.cellEllipsis} title={p.membersSummary}>
                    {p.membersSummary}
                  </td>
                  <td className={styles.cellNowrap}>{p.startDate}</td>
                  <td className={styles.cellNowrap}>{p.endDate ?? '—'}</td>
                  <td>{p.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
