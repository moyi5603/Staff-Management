import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { TagPill } from '../../components/TagPill';
import { useEmployees } from '../../context/EmployeeContext';
import { EmployeeCertificatesSection } from './EmployeeCertificatesSection';
import { EmployeeInterestsSection } from './EmployeeInterestsSection';
import { EmployeeSkillsSection } from './EmployeeSkillsSection';
import { maskPhone } from '../../mock/data';
import type { Employee } from '../../types';
import { formatEmployeeDisplayName, formatOptionalText } from '../../utils/employeeProfile';
import { formatWorkLocation } from '../../utils/workLocation';
import { formatDate } from '../../utils/formatDate';
import styles from './EmployeeDetail.module.css';

const TABS = ['基础信息', '个人证书', '个人技能', '项目经验', '个人荣誉', '兴趣爱好', '操作日志'] as const;

export function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, removeEmployees, updateEmployee } = useEmployees();
  const emp = getById(id ?? '');
  const [tab, setTab] = useState<(typeof TABS)[number]>('基础信息');

  const handleDelete = () => {
    if (!emp) return;
    if (window.confirm(`确定删除员工「${emp.name}」？刷新页面将恢复 Mock 数据。`)) {
      removeEmployees([emp.id]);
      navigate('/employee/list');
    }
  };

  if (!emp) {
    return (
      <Card>
        <p>员工不存在</p>
        <Link to="/employee/list">
          <Button variant="default">返回列表</Button>
        </Link>
      </Card>
    );
  }

  return (
    <>
      <div className={styles.topBar}>
        <Link to="/employee/list">
          <Button variant="text">← 返回列表</Button>
        </Link>
        <div className={styles.topActions}>
          <Link to={`/employee/form/${emp.id}`}>
            <Button variant="primary">编辑</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            删除
          </Button>
        </div>
      </div>

      <Card className={styles.profileCard}>
        <div className={styles.profile}>
          <div className={styles.avatarLg}>{emp.name.charAt(0)}</div>
          <div className={styles.profileInfo}>
            <h2>{formatEmployeeDisplayName(emp)}</h2>
            <p className={styles.sub}>
              {emp.departmentName} · {emp.positionName} · {formatWorkLocation(emp)}
            </p>
            <p className={styles.meta}>
              工号: {emp.empNo} · <StatusBadge status={emp.status} /> · 入职 {emp.joinDate}
            </p>
            <p className={styles.contact}>
              📱 {maskPhone(emp.phone)} · 📧 {emp.email}
            </p>
          </div>
        </div>
      </Card>

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <Card>
        {renderTab(tab, emp, {
          onCertificatesChange: (certificates) => updateEmployee(emp.id, { certificates }),
          onSkillsChange: (skills) => updateEmployee(emp.id, { skills }),
          onInterestsChange: (interests) => updateEmployee(emp.id, { interests }),
        })}
      </Card>
    </>
  );
}

function renderTab(
  tab: string,
  emp: Employee,
  handlers: {
    onCertificatesChange: (certificates: Employee['certificates']) => void;
    onSkillsChange: (skills: Employee['skills']) => void;
    onInterestsChange: (interests: Employee['interests']) => void;
  },
) {
  switch (tab) {
    case '基础信息':
      return (
        <dl className={styles.dl}>
          <Row label="工号" value={emp.empNo} />
          <Row label="姓名" value={emp.name} />
          <Row label="花名" value={formatOptionalText(emp.nickname)} />
          <Row label="性别" value={formatOptionalText(emp.gender)} />
          <Row label="出生日期" value={formatDate(emp.birthday)} />
          <Row label="试用期截止" value={formatDate(emp.probationEndDate)} />
          <Row label="籍贯" value={formatOptionalText(emp.nativePlace)} />
          <Row label="政治面貌" value={formatOptionalText(emp.politicalStatus)} />
          <Row
            label="个人介绍"
            value={<span className={styles.preWrap}>{formatOptionalText(emp.bio)}</span>}
          />
          <Row label="手机号" value={maskPhone(emp.phone)} />
          <Row label="手机尾号" value={emp.phoneSuffix} />
          <Row label="邮箱" value={emp.email} />
          <Row label="部门" value={emp.departmentName} />
          <Row label="岗位" value={emp.positionName} />
          <Row label="工作地点" value={formatWorkLocation(emp)} />
          <Row label="入职日期" value={emp.joinDate} />
          <Row label="离职日期" value={emp.leaveDate ?? '—'} />
          <Row label="状态" value={<StatusBadge status={emp.status} />} />
        </dl>
      );
    case '个人技能':
      return <EmployeeSkillsSection skills={emp.skills} onChange={handlers.onSkillsChange} />;
    case '个人证书':
      return (
        <EmployeeCertificatesSection
          certificates={emp.certificates}
          onChange={handlers.onCertificatesChange}
        />
      );
    case '项目经验':
      return (
        <div className={styles.projectList}>
          {emp.projects.map((p) => (
            <div key={p.projectId} className={styles.projectCard}>
              <div className={styles.projectHead}>
                <strong>{p.projectName}</strong>
                <StatusBadge status={p.status} />
              </div>
              <p>我的角色：{p.role}</p>
              <div className={styles.certOps}>
                <Button variant="text">编辑</Button>
                <Button variant="danger">移除</Button>
              </div>
            </div>
          ))}
          <Button variant="text">+ 添加项目</Button>
        </div>
      );
    case '个人荣誉':
      return (
        <div>
          {emp.honors.map((h) => (
            <div key={h.id} className={styles.honorCard}>
              <strong>🏆 {h.name}</strong>
              <p>
                {h.date} · {h.issuer}
              </p>
              {h.description && <p className={styles.desc}>{h.description}</p>}
            </div>
          ))}
          <Button variant="text">+ 添加荣誉</Button>
        </div>
      );
    case '兴趣爱好':
      return (
        <div>
          <EmployeeInterestsSection
            interests={emp.interests}
            onChange={handlers.onInterestsChange}
          />
          {emp.interestGroups.length > 0 && (
            <Section title="兴趣小组">
              <div className={styles.interestGrid}>
                {emp.interestGroups.map((g) => (
                  <TagPill key={g} label={g} />
                ))}
              </div>
            </Section>
          )}
        </div>
      );
    case '操作日志':
      return (
        <table className={styles.logTable}>
          <thead>
            <tr>
              <th>操作人</th>
              <th>操作类型</th>
              <th>操作时间</th>
              <th>变更内容</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>张三（本人）</td>
              <td>编辑基础信息</td>
              <td>2026-05-22 14:30</td>
              <td>手机号变更</td>
            </tr>
            <tr>
              <td>HR-李华</td>
              <td>新增证书</td>
              <td>2026-05-18 09:00</td>
              <td>添加证书: PMP 项目管理专业人士</td>
            </tr>
          </tbody>
        </table>
      );
    default:
      return null;
  }
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h4>{title}</h4>
      {children}
    </section>
  );
}
