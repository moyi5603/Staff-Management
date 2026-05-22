import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { operationLogs } from '../../mock/data';
import styles from '../employee/EmployeeList.module.css';

export function SystemLog() {
  return (
    <>
      <PageHeader title="操作日志" />
      <Card className={styles.toolbar}>
        <select defaultValue="">
          <option>模块 [全部]</option>
          <option>员工管理</option>
          <option>项目管理</option>
        </select>
        <input placeholder="操作人" style={{ padding: '6px 12px', border: '1px solid var(--color-border)', borderRadius: 6 }} />
        <Button variant="primary">搜索</Button>
      </Card>
      <Card className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>操作时间</th>
              <th>操作人</th>
              <th>操作模块</th>
              <th>变更内容</th>
            </tr>
          </thead>
          <tbody>
            {operationLogs.map((log, i) => (
              <tr key={log.id} className={i % 2 === 1 ? styles.stripe : ''}>
                <td>{log.time}</td>
                <td>{log.operator}</td>
                <td>
                  {log.module}
                  <br />
                  <small>{log.action}</small>
                </td>
                <td>{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
