import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { positions } from '../../mock/data';
import styles from '../employee/EmployeeList.module.css';

export function PositionList() {
  return (
    <>
      <PageHeader title="岗位管理" actions={<Button variant="primary">+ 新增岗位</Button>} />
      <Card className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>序号</th>
              <th>岗位名称</th>
              <th>所属部门</th>
              <th>员工人数</th>
              <th>KPI数量</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p, i) => (
              <tr key={p.id} className={i % 2 === 1 ? styles.stripe : ''}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.departmentName}</td>
                <td>{p.employeeCount}人</td>
                <td>{p.kpiCount}条</td>
                <td className={styles.ops}>
                  <Button variant="text">详情</Button>
                  <Button variant="text">编辑</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
