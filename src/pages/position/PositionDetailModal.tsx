import { Button } from '../../components/Button';
import type { Position } from '../../types';
import styles from './PositionList.module.css';

interface Props {
  position: Position;
  onEdit: () => void;
  onClose: () => void;
}

export function PositionDetailModal({ position, onEdit, onClose }: Props) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
        <h3>岗位详情</h3>
        <dl className={styles.dl}>
          <dt>岗位名称</dt>
          <dd>{position.name}</dd>
          <dt>所属部门</dt>
          <dd>{position.departmentName}</dd>
          <dt>核心职责</dt>
          <dd>
            {position.coreDuties.length > 0 ? (
              <ul className={styles.dutyList}>
                {position.coreDuties.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : (
              '—'
            )}
          </dd>
          <dt>岗位职责详细介绍</dt>
          <dd className={styles.textBlock}>{position.detailDuty ?? '—'}</dd>
          <dt>岗位绩效指标</dt>
          <dd>
            {position.kpis && position.kpis.length > 0 ? (
              <table className={styles.kpiTable}>
                <thead>
                  <tr>
                    <th>指标名称</th>
                    <th>目标值</th>
                    <th>衡量周期</th>
                  </tr>
                </thead>
                <tbody>
                  {position.kpis.map((kpi) => (
                    <tr key={kpi.name}>
                      <td>{kpi.name}</td>
                      <td>{kpi.target}</td>
                      <td>{kpi.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              '—'
            )}
          </dd>
        </dl>
        <p className={styles.stats}>
          在职员工：{position.employeeCount} 人 · KPI：{position.kpiCount} 条
        </p>
        <div className={styles.modalActions}>
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
