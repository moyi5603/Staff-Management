import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useEmployees } from '../../context/EmployeeContext';
import { EmployeeCertificatesSection } from './EmployeeCertificatesSection';
import { EmployeeInterestsSection } from './EmployeeInterestsSection';
import { EmployeeProjectsSection } from './EmployeeProjectsSection';
import { EmployeeSkillsSection } from './EmployeeSkillsSection';
import type { Employee } from '../../types';
import { formatEmployeeDisplayName, formatOptionalText } from '../../utils/employeeProfile';
import { formatWorkLocation } from '../../utils/workLocation';
import { formatDate } from '../../utils/formatDate';
import styles from './EmployeeDetail.module.css';

const TABS = ['个人证书', '个人技能', '兴趣爱好', '参与项目'] as const;

export function EmployeeDetail() {
  const { id } = useParams();
  const { getById } = useEmployees();
  const emp = getById(id ?? '');
  const [tab, setTab] = useState<(typeof TABS)[number]>('个人证书');

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

      <Card>{renderTab(tab, emp)}</Card>
    </>
  );
}

function renderTab(tab: string, emp: Employee) {
  switch (tab) {
    case '个人技能':
      return <EmployeeSkillsSection skills={emp.skills} readOnly />;
    case '个人证书':
      return <EmployeeCertificatesSection certificates={emp.certificates} readOnly />;
    case '兴趣爱好':
      return <EmployeeInterestsSection interests={emp.interests} readOnly />;
    case '参与项目':
      return <EmployeeProjectsSection projects={emp.projects} />;
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
      <InfoItem label="手机号" value={emp.phone || '—'} />
      <InfoItem label="邮箱" value={emp.email} />
      <InfoItem label="部门" value={emp.departmentName} />
      <InfoItem label="岗位" value={emp.positionName} />
      <InfoItem label="角色" value={emp.role} />
      <InfoItem label="入职日期" value={emp.joinDate} />
      <InfoItem label="在职状态" value={emp.status} />
      <InfoItem label="账号状态" value={emp.accountStatus} />
      <InfoItem label="离职日期" value={formatDate(emp.leaveDate)} />
      <InfoItem label="工作地点" value={formatWorkLocation(emp)} />
      <InfoItem
        label="个人介绍"
        value={<span className={styles.preWrap}>{formatOptionalText(emp.bio)}</span>}
        fullWidth
      />
      <InfoItem
        label="备注"
        value={<span className={styles.preWrap}>{formatOptionalText(emp.remark)}</span>}
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

