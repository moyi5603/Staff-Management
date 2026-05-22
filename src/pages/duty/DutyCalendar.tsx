import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { dutyRecords } from '../../mock/data';
import styles from './DutyCalendar.module.css';

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export function DutyCalendar() {
  const [month] = useState('2026年5月');
  const [showBatch, setShowBatch] = useState(false);

  const weekDates = ['5/18', '5/19', '5/20', '5/21', '5/22', '5/23', '5/24'];

  const calendarData = useMemo(() => {
    const map = new Map<string, typeof dutyRecords>();
    for (const d of dutyRecords) {
      const key = d.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return map;
  }, []);

  return (
    <>
      <PageHeader
        title="值班管理"
        actions={
          <>
            <Button variant="primary">+ 新增值班</Button>
            <Button variant="default" onClick={() => setShowBatch(true)}>
              批量排班
            </Button>
          </>
        }
      />

      <Card className={styles.toolbar}>
        <select defaultValue="">
          <option value="">部门 [全部]</option>
          <option>产品部</option>
          <option>技术部</option>
        </select>
        <select defaultValue="">
          <option value="">时段 [全部]</option>
          <option>白班</option>
          <option>夜班</option>
        </select>
        <div className={styles.monthNav}>
          <Button variant="text">‹</Button>
          <span>{month}</span>
          <Button variant="text">›</Button>
        </div>
      </Card>

      <Card className={styles.calendar}>
        <div className={styles.weekHeader}>
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={styles.dayCol}>
              <div className={styles.weekLabel}>
                {w} {weekDates[i]}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.weekBody}>
          {weekDates.map((_, colIdx) => {
            const dateKey = `2026-05-${18 + colIdx}`;
            const duties = calendarData.get(dateKey) ?? [];
            return (
              <div key={dateKey} className={styles.dayCol}>
                {duties.length === 0 ? (
                  <div className={styles.emptyCell}>—</div>
                ) : (
                  duties.map((d) => (
                    <div key={d.id} className={styles.dutyCell}>
                      <div className={styles.deptName}>{d.departmentName}</div>
                      <div className={styles.dutyPerson}>👤 {d.employeeName}</div>
                      <div className={styles.shift}>{d.shift}</div>
                      <Button variant="text">编辑</Button>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {showBatch && (
        <div className={styles.modalOverlay} onClick={() => setShowBatch(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>批量排班</h3>
            <label>
              部门选择*
              <select>
                <option>产品部</option>
              </select>
            </label>
            <label>
              排班周期
              <input type="text" defaultValue="2026-05-01 → 2026-05-31" />
            </label>
            <p>或上传排班表：<Button variant="text">下载模板</Button></p>
            <div className={styles.uploadZone}>拖拽上传 .xlsx</div>
            <div className={styles.modalActions}>
              <Button variant="default" onClick={() => setShowBatch(false)}>
                取消
              </Button>
              <Button variant="primary" onClick={() => setShowBatch(false)}>
                确认排班
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
