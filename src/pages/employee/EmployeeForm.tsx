import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import {
  DEPARTMENT_OPTIONS,
  POSITION_OPTIONS,
  phoneSuffixFromPhone,
  useEmployees,
} from '../../context/EmployeeContext';
import type { Employee, EmployeeStatus } from '../../types';
import styles from './EmployeeForm.module.css';

export function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, addEmployee, updateEmployee } = useEmployees();
  const emp = id ? getById(id) : undefined;
  const isEdit = Boolean(emp);

  const [name, setName] = useState(emp?.name ?? '');
  const [empNo, setEmpNo] = useState(emp?.empNo ?? '');
  const [phone, setPhone] = useState(emp?.phone ?? '');
  const [email, setEmail] = useState(emp?.email ?? '');
  const [departmentName, setDepartmentName] = useState(emp?.departmentName ?? DEPARTMENT_OPTIONS[0].name);
  const [positionName, setPositionName] = useState(emp?.positionName ?? POSITION_OPTIONS[0].name);
  const [joinDate, setJoinDate] = useState(emp?.joinDate ?? new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<EmployeeStatus>(emp?.status ?? '在职');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('请填写姓名');
      return;
    }
    if (!empNo.trim()) {
      setError('请填写工号');
      return;
    }
    if (!phone.trim()) {
      setError('请填写手机号');
      return;
    }
    if (!email.trim()) {
      setError('请填写邮箱');
      return;
    }

    const dept = DEPARTMENT_OPTIONS.find((d) => d.name === departmentName);
    const pos = POSITION_OPTIONS.find((p) => p.name === positionName);
    const phoneSuffix = phoneSuffixFromPhone(phone);
    const base = {
      name: name.trim(),
      empNo: empNo.trim(),
      phone: phone.trim(),
      phoneSuffix,
      email: email.trim(),
      departmentId: dept?.id ?? 'dept-product',
      departmentName,
      positionId: pos?.id ?? 'pos-1',
      positionName,
      joinDate,
      status,
    };

    if (isEdit && emp) {
      updateEmployee(emp.id, base);
      navigate(`/employee/detail/${emp.id}`);
    } else {
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        ...base,
        accountStatus: '正常',
        createdAt: new Date().toISOString().slice(0, 10),
        wechatBound: false,
        skills: [],
        interests: [],
        interestGroups: [],
        certificates: [],
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

      <Card>
        <FormSection title="📋 基础信息（必填）">
          <div className={styles.grid}>
            <Field label="姓名*" value={name} onChange={setName} />
            <Field label="工号*" value={empNo} onChange={setEmpNo} />
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
              onChange={(v) => setStatus(v as EmployeeStatus)}
              options={['在职', '休假', '离职']}
            />
          </div>
          <div className={styles.upload}>
            <span>头像</span>
            <Button variant="default" onClick={() => window.alert('头像上传为演示占位')}>
              上传头像
            </Button>
            <span className={styles.hint}>JPG/PNG，建议 200×200px，最大 2MB</span>
          </div>
        </FormSection>

        <FormSection title="📝 技能证书（选填）">
          <Field label="技能标签" placeholder="搜索或新建标签..." value="" onChange={() => {}} />
          {emp?.skills && emp.skills.length > 0 && (
            <div className={styles.selectedTags}>已选: {emp.skills.join(', ')}</div>
          )}
        </FormSection>

        <FormSection title="🎯 兴趣爱好（选填）">
          <Field label="兴趣标签" placeholder="搜索兴趣标签..." value="" onChange={() => {}} />
        </FormSection>
      </Card>
    </>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <hr className={styles.divider} />
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'date' | 'select';
  options?: string[];
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {type === 'select' ? (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
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
