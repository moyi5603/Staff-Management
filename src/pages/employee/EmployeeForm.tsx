import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { WorkLocationPicker } from '../../components/WorkLocationPicker';
import {
  DEPARTMENT_OPTIONS,
  POSITION_OPTIONS,
  phoneSuffixFromPhone,
  useEmployees,
} from '../../context/EmployeeContext';
import {
  EMPLOYEE_GENDER_OPTIONS,
  EMPLOYEE_ROLE_OPTIONS,
  POLITICAL_STATUS_OPTIONS,
  type Certificate,
  type Employee,
  type EmployeeGender,
  type EmployeeRole,
  type EmployeeStatus,
  type PoliticalStatus,
} from '../../types';
import { isWorkLocationComplete } from '../../utils/workLocation';
import { EmployeeCertificatesSection } from './EmployeeCertificatesSection';
import { EmployeeInterestsSection } from './EmployeeInterestsSection';
import { EmployeeSkillsSection } from './EmployeeSkillsSection';
import styles from './EmployeeForm.module.css';

const FORM_TABS = ['基础信息', '个人证书', '个人技能', '兴趣爱好'] as const;
type FormTab = (typeof FORM_TABS)[number];

export function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, addEmployee, updateEmployee } = useEmployees();
  const emp = id ? getById(id) : undefined;
  const isEdit = Boolean(emp);

  const [name, setName] = useState(emp?.name ?? '');
  const [nickname, setNickname] = useState(emp?.nickname ?? '');
  const [gender, setGender] = useState(emp?.gender ?? '');
  const [birthday, setBirthday] = useState(emp?.birthday ?? '');
  const [probationEndDate, setProbationEndDate] = useState(emp?.probationEndDate ?? '');
  const [nativePlace, setNativePlace] = useState(emp?.nativePlace ?? '');
  const [politicalStatus, setPoliticalStatus] = useState(emp?.politicalStatus ?? '');
  const [bio, setBio] = useState(emp?.bio ?? '');
  const [empNo, setEmpNo] = useState(emp?.empNo ?? '');
  const [phone, setPhone] = useState(emp?.phone ?? '');
  const [email, setEmail] = useState(emp?.email ?? '');
  const [departmentName, setDepartmentName] = useState(emp?.departmentName ?? DEPARTMENT_OPTIONS[0].name);
  const [positionName, setPositionName] = useState(emp?.positionName ?? POSITION_OPTIONS[0].name);
  const [workLocation, setWorkLocation] = useState({
    workLocationProvince: emp?.workLocationProvince ?? '',
    workLocationCity: emp?.workLocationCity ?? '',
    workLocationDistrict: emp?.workLocationDistrict ?? '',
  });
  const [joinDate, setJoinDate] = useState(emp?.joinDate ?? new Date().toISOString().slice(0, 10));
  const [leaveDate, setLeaveDate] = useState(emp?.leaveDate ?? '');
  const [status, setStatus] = useState<EmployeeStatus>(emp?.status ?? '在职');
  const [role, setRole] = useState<EmployeeRole>(emp?.role ?? '普通员工');
  const [remark, setRemark] = useState(emp?.remark ?? '');
  const [certificates, setCertificates] = useState<Certificate[]>(
    () => emp?.certificates.map((c) => ({ ...c })) ?? [],
  );
  const [skills, setSkills] = useState<string[]>(() => [...(emp?.skills ?? [])]);
  const [interests, setInterests] = useState<string[]>(() => [...(emp?.interests ?? [])]);
  const [tab, setTab] = useState<FormTab>('基础信息');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('请填写姓名');
      setTab('基础信息');
      return;
    }
    if (!empNo.trim()) {
      setError('请填写工号');
      setTab('基础信息');
      return;
    }
    if (!phone.trim()) {
      setError('请填写手机号');
      setTab('基础信息');
      return;
    }
    if (!email.trim()) {
      setError('请填写邮箱');
      setTab('基础信息');
      return;
    }
    if (!isWorkLocationComplete(workLocation)) {
      setError('请选择完整的工作地点（省、市、区/县）');
      setTab('基础信息');
      return;
    }
    if (status === '离职' && !leaveDate.trim()) {
      setError('离职状态请填写离职日期');
      setTab('基础信息');
      return;
    }

    const dept = DEPARTMENT_OPTIONS.find((d) => d.name === departmentName);
    const pos = POSITION_OPTIONS.find((p) => p.name === positionName);
    const phoneSuffix = phoneSuffixFromPhone(phone);
    const base = {
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      gender: gender ? (gender as EmployeeGender) : undefined,
      birthday: birthday || undefined,
      probationEndDate: probationEndDate || undefined,
      nativePlace: nativePlace.trim() || undefined,
      politicalStatus: politicalStatus ? (politicalStatus as PoliticalStatus) : undefined,
      bio: bio.trim() || undefined,
      empNo: empNo.trim(),
      phone: phone.trim(),
      phoneSuffix,
      email: email.trim(),
      departmentId: dept?.id ?? 'dept-product',
      departmentName,
      positionId: pos?.id ?? 'pos-1',
      positionName,
      ...workLocation,
      joinDate,
      leaveDate: status === '离职' && leaveDate.trim() ? leaveDate.trim() : undefined,
      status,
      role,
      remark: remark.trim() || undefined,
      certificates,
      skills,
      interests,
    };

    if (isEdit && emp) {
      updateEmployee(emp.id, { ...base, interestGroups: emp.interestGroups });
      navigate(`/employee/detail/${emp.id}`);
    } else {
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        ...base,
        role,
        accountStatus: '正常',
        createdAt: new Date().toISOString().slice(0, 10),
        wechatBound: false,
        skills,
        interests,
        interestGroups: emp?.interestGroups ?? [],
        certificates,
        honors: [],
        projects: [],
      };
      addEmployee(newEmp);
      navigate(`/employee/detail/${newEmp.id}`);
    }
  };

  return (
    <>
      <PageHeader
        title={isEdit ? `编辑员工：${emp?.name}` : '新增员工'}
        actions={
          <>
            <Button variant="primary" onClick={handleSave}>
              保存
            </Button>
            <Link to={isEdit ? `/employee/detail/${id}` : '/employee/list'}>
              <Button variant="default">取消</Button>
            </Link>
          </>
        }
      />

      {error && <p className={styles.formError}>{error}</p>}

      <Card className={styles.formCard}>
        <div className={styles.tabs} role="tablist">
          {FORM_TABS.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className={styles.tabPanel} role="tabpanel">
          {tab === '基础信息' && (
            <>
              <div className={styles.grid}>
                <Field label="姓名*" value={name} onChange={setName} />
                <Field label="花名" value={nickname} onChange={setNickname} placeholder="选填" />
                <Field label="工号*" value={empNo} onChange={setEmpNo} />
                <Field
                  label="性别"
                  type="select"
                  value={gender}
                  onChange={setGender}
                  options={EMPLOYEE_GENDER_OPTIONS}
                  placeholderOption="请选择"
                />
                <Field label="出生日期" type="date" value={birthday} onChange={setBirthday} />
                <Field
                  label="试用期截止"
                  type="date"
                  value={probationEndDate}
                  onChange={setProbationEndDate}
                />
                <Field
                  label="籍贯"
                  value={nativePlace}
                  onChange={setNativePlace}
                  placeholder="如：浙江省杭州市"
                />
                <Field
                  label="政治面貌"
                  type="select"
                  value={politicalStatus}
                  onChange={setPoliticalStatus}
                  options={POLITICAL_STATUS_OPTIONS}
                  placeholderOption="请选择"
                />
                <Field label="手机号*" value={phone} onChange={setPhone} />
                <Field label="邮箱*" value={email} onChange={setEmail} />
                <Field
                  label="部门*"
                  type="select"
                  value={departmentName}
                  onChange={setDepartmentName}
                  options={DEPARTMENT_OPTIONS.map((d) => d.name)}
                />
                <Field
                  label="岗位*"
                  type="select"
                  value={positionName}
                  onChange={setPositionName}
                  options={POSITION_OPTIONS.map((p) => p.name)}
                />
                <Field label="入职日期*" type="date" value={joinDate} onChange={setJoinDate} />
                <Field
                  label="状态"
                  type="select"
                  value={status}
                  onChange={(v) => {
                    const next = v as EmployeeStatus;
                    setStatus(next);
                    if (next !== '离职') setLeaveDate('');
                  }}
                  options={['在职', '离职']}
                />
                <Field
                  label="角色"
                  type="select"
                  value={role}
                  onChange={(v) => setRole(v as EmployeeRole)}
                  options={EMPLOYEE_ROLE_OPTIONS}
                />
                <Field
                  label={status === '离职' ? '离职日期*' : '离职日期'}
                  type="date"
                  value={leaveDate}
                  onChange={setLeaveDate}
                />
                <label className={styles.field}>
                  <span>工作地点 *</span>
                  <WorkLocationPicker value={workLocation} onChange={setWorkLocation} />
                </label>
                <Field
                  label="个人介绍"
                  type="textarea"
                  value={bio}
                  onChange={setBio}
                  placeholder="选填，简要介绍工作经历、专长等"
                  className={styles.fieldFull}
                />
                <Field
                  label="备注"
                  type="textarea"
                  value={remark}
                  onChange={setRemark}
                  placeholder="选填"
                  className={styles.fieldFull}
                />
              </div>
              <div className={styles.upload}>
                <span>个人照片</span>
                <Button variant="default" onClick={() => window.alert('个人照片上传为演示占位')}>
                  上传个人照片
                </Button>
                <span className={styles.hint}>JPG/PNG，建议 200×200px，最大 2MB</span>
              </div>
            </>
          )}

          {tab === '个人证书' && (
            <EmployeeCertificatesSection certificates={certificates} onChange={setCertificates} />
          )}

          {tab === '个人技能' && (
            <EmployeeSkillsSection skills={skills} onChange={setSkills} />
          )}

          {tab === '兴趣爱好' && (
            <EmployeeInterestsSection interests={interests} onChange={setInterests} />
          )}
        </div>
      </Card>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  options,
  placeholderOption,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'date' | 'select' | 'textarea';
  options?: readonly string[];
  /** select 首项占位文案 */
  placeholderOption?: string;
  className?: string;
}) {
  const isFullWidth = type === 'textarea' || className === styles.fieldFull;
  return (
    <label className={`${styles.field} ${isFullWidth ? styles.fieldFull : ''} ${className ?? ''}`}>
      <span>{label}</span>
      {type === 'select' ? (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {placeholderOption !== undefined && (
            <option value="">{placeholderOption}</option>
          )}
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}
