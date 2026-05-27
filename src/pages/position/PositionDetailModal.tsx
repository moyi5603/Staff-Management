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
          <dt>岗位编号</dt>
          <dd>{position.positionNo}</dd>
          <dt>岗位编码</dt>
          <dd>{position.code}</dd>
          <dt>岗位名称</dt>
          <dd>{position.name}</dd>
          <dt>岗位排序</dt>
          <dd>{position.sortOrder}</dd>
          <dt>状态</dt>
          <dd>{position.status}</dd>
          <dt>创建时间</dt>
          <dd>{position.createdAt}</dd>
          <dt>核心职责</dt>
          <dd className={styles.textBlock}>{position.coreDuties || '—'}</dd>
          <dt>岗位职责详细介绍</dt>
          <dd className={styles.textBlock}>{position.detailDuty ?? '—'}</dd>
          <dt>岗位绩效指标</dt>
          <dd className={styles.textBlock}>{position.performanceIndicators ?? '—'}</dd>
          <dt>备注</dt>
          <dd className={styles.textBlock}>{position.remark ?? '—'}</dd>
        </dl>
        <p className={styles.stats}>在职员工：{position.employeeCount} 人</p>
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
