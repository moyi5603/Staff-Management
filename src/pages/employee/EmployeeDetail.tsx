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

const TABS = ['个人证书', '个人技能', '参与项目', '兴趣爱好'] as const;

export function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, removeEmployees, updateEmployee } = useEmployees();
  const emp = getById(id ?? '');
  const [tab, setTab] = useState<(typeof TABS)[number]>('个人证书');

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
        <div className={styles.profileMerged}>
          <div className={styles.avatarLg}>{emp.name.charAt(0)}</div>
          <div className={styles.profileMain}>
            <div className={styles.profileHead}>
              <h2>{formatEmployeeDisplayName(emp)}</h2>
            </div>
            <BasicInfoPanel emp={emp} />
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
    case '个人技能':
      return <EmployeeSkillsSection skills={emp.skills} onChange={handlers.onSkillsChange} />;
    case '个人证书':
      return (
        <EmployeeCertificatesSection
          certificates={emp.certificates}
          onChange={handlers.onCertificatesChange}
        />
      );
    case '参与项目':
      return (
        <div className={styles.projectPanel}>
          <div className={styles.projectToolbar}>
            <span className={styles.projectSummary}>
              {emp.projects.length > 0 ? `共 ${emp.projects.length} 个项目` : '暂无参与项目'}
            </span>
            <Button variant="text">+ 添加项目</Button>
          </div>
          {emp.projects.length > 0 && (
            <ul className={styles.projectList}>
              {emp.projects.map((p) => (
                <li key={p.projectId} className={styles.projectRow}>
                  <div className={styles.projectMain}>
                    <span className={styles.projectName}>{p.projectName}</span>
                    <StatusBadge status={p.status} />
                    <span className={styles.projectRole}>角色：{p.role}</span>
                  </div>
                  <div className={styles.projectOps}>
                    <Button variant="text">编辑</Button>
                    <Button variant="danger">移除</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
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
    default:
      return null;
  }
}

function BasicInfoPanel({ emp }: { emp: Employee }) {
  return (
    <div className={styles.infoGrid}>
      <InfoItem label="工号" value={emp.empNo} />
      <InfoItem label="性别" value={formatOptionalText(emp.gender)} />
      <InfoItem label="出生日期" value={formatDate(emp.birthday)} />
      <InfoItem label="试用期截止" value={formatDate(emp.probationEndDate)} />
      <InfoItem label="籍贯" value={formatOptionalText(emp.nativePlace)} />
      <InfoItem label="政治面貌" value={formatOptionalText(emp.politicalStatus)} />
      <InfoItem label="手机号" value={maskPhone(emp.phone)} />
      <InfoItem label="邮箱" value={emp.email} />
      <InfoItem label="部门" value={emp.departmentName} />
      <InfoItem label="岗位" value={emp.positionName} />
      <InfoItem label="入职日期" value={emp.joinDate} />
      <InfoItem label="状态" value={<StatusBadge status={emp.status} />} />
      <InfoItem label="离职日期" value={formatDate(emp.leaveDate)} />
      <InfoItem label="工作地点" value={formatWorkLocation(emp)} />
      <InfoItem
        label="个人介绍"
        value={<span className={styles.preWrap}>{formatOptionalText(emp.bio)}</span>}
        fullWidth
      />
    </div>
  );
}

function InfoItem({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? styles.infoItemFull : styles.infoItem}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
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
