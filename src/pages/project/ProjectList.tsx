import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { projects } from '../../mock/data';
import type { ProjectStatus } from '../../types';
import styles from './ProjectList.module.css';

export function ProjectList() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | '全部'>('全部');
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchStatus = statusFilter === '全部' || p.status === statusFilter;
      const matchKw = !keyword || p.name.includes(keyword);
      return matchStatus && matchKw;
    });
  }, [statusFilter, keyword]);

  return (
    <>
      <PageHeader title="项目管理" actions={<Button variant="primary">+ 新增项目</Button>} />
      <Card className={styles.filters}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | '全部')}>
          <option value="全部">全部</option>
          <option value="进行中">进行中</option>
          <option value="已结束">已结束</option>
        </select>
        <input
          placeholder="搜索项目名称..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className={styles.search}
        />
      </Card>

      <div className={styles.cards}>
        {filtered.map((p) => (
          <Card key={p.id} className={styles.projectCard}>
            <div className={styles.cardHead}>
              <strong>{p.status === '进行中' ? '🟢' : '⬡'} {p.name}</strong>
              <div className={styles.cardHeadRight}>
                <StatusBadge status={p.status} />
                <Button variant="text">编辑</Button>
              </div>
            </div>
            <p>
              主责部门：{p.departmentName} | 负责人：{p.leaderName} | 成员：{p.members.length}人
            </p>
            {p.relatedDepartments.length > 0 && <p>参与部门：{p.relatedDepartments.join('、')}</p>}
            <p>
              开始：{p.startDate}
              {p.endDate && ` | 结束：${p.endDate}`}
            </p>
            {p.description && <p className={styles.desc}>{p.description}</p>}
            <div className={styles.members}>
              {p.members.slice(0, 4).map((m) => (
                <span key={m.employeeId} className={styles.memberAvatar} title={m.name}>
                  {m.name.charAt(0)}
                </span>
              ))}
              {p.members.length > 4 && <span className={styles.more}>+{p.members.length - 4}</span>}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
