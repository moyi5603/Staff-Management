import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { interestGroups, skillTags } from '../../mock/data';
import styles from '../employee/EmployeeList.module.css';

type TagMode = 'skill' | 'interest' | 'group';

const titles: Record<TagMode, string> = {
  skill: '技能标签管理',
  interest: '兴趣标签管理',
  group: '兴趣小组管理',
};

export function TagList({ mode }: { mode: TagMode }) {
  const isGroup = mode === 'group';

  return (
    <>
      <PageHeader
        title={titles[mode]}
        actions={
          <>
            <Button variant="primary">+ 新增{isGroup ? '小组' : '标签'}</Button>
            {!isGroup && <Button variant="default">批量导入</Button>}
          </>
        }
      />
      <Card>
        {!isGroup && (
          <input
            placeholder="标签名称搜索..."
            style={{ width: '100%', padding: '8px 12px', marginBottom: 16, border: '1px solid var(--color-border)', borderRadius: 6 }}
          />
        )}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>{isGroup ? '小组名称' : '标签名称'}</th>
              {!isGroup && <th>类型</th>}
              <th>{isGroup ? '成员数' : '关联员工数'}</th>
              {!isGroup && <th>使用场景</th>}
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {isGroup
              ? interestGroups.map((g, i) => (
                  <tr key={g.id} className={i % 2 === 1 ? styles.stripe : ''}>
                    <td>{i + 1}</td>
                    <td>{g.name}</td>
                    <td>{g.memberCount}人</td>
                    <td className={styles.ops}>
                      <Button variant="text">编辑</Button>
                      <Button variant="danger">删除</Button>
                    </td>
                  </tr>
                ))
              : skillTags
                  .filter((t) => (mode === 'skill' ? t.type === '技能' : t.type === '兴趣'))
                  .map((t, i) => (
                    <tr key={t.id} className={i % 2 === 1 ? styles.stripe : ''}>
                      <td>{i + 1}</td>
                      <td>{t.name}</td>
                      <td>{t.type}</td>
                      <td>{t.employeeCount}人</td>
                      <td>{t.scene}</td>
                      <td className={styles.ops}>
                        <Button variant="text">编辑</Button>
                        <Button variant="text">合并</Button>
                        <Button variant="danger">删除</Button>
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
        {!isGroup && (
          <p style={{ marginTop: 16, fontSize: 12, color: 'var(--color-text-secondary)' }}>
            标签合并：将「Python」「python」等合并为统一标签。删除前需确认无员工关联。
          </p>
        )}
      </Card>
    </>
  );
}
