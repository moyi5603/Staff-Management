import type { ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { getEmployeeById } from '../../mock/data';
import styles from './EmployeeForm.module.css';

export function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const emp = id ? getEmployeeById(id) : undefined;
  const isEdit = Boolean(emp);

  return (
    <>
      <PageHeader
        title={isEdit ? `编辑员工：${emp?.name}` : '新增员工'}
        actions={
          <>
            <Button variant="primary" onClick={() => navigate(isEdit ? `/employee/detail/${id}` : '/employee/list')}>
              保存
            </Button>
            <Link to={isEdit ? `/employee/detail/${id}` : '/employee/list'}>
              <Button variant="default">取消</Button>
            </Link>
          </>
        }
      />

      <Card>
        <FormSection title="📋 基础信息（必填）">
          <div className={styles.grid}>
            <Field label="姓名*" defaultValue={emp?.name} />
            <Field label="工号*" defaultValue={emp?.empNo ?? 'EMP-_______'} />
            <Field label="手机号*" defaultValue={emp?.phone} />
            <Field label="邮箱*" defaultValue={emp?.email} />
            <Field label="部门*" defaultValue={emp?.departmentName} type="select" options={['产品部', '技术部', '销售部']} />
            <Field label="岗位*" defaultValue={emp?.positionName} type="select" options={['产品经理', '前端开发', '销售代表']} />
            <Field label="入职日期*" defaultValue={emp?.joinDate ?? '2026-05-22'} type="date" />
            <Field label="状态" defaultValue={emp?.status ?? '在职'} type="select" options={['在职', '休假', '离职']} />
          </div>
          <div className={styles.upload}>
            <span>头像</span>
            <Button variant="default">上传头像</Button>
            <span className={styles.hint}>JPG/PNG，建议 200×200px，最大 2MB</span>
          </div>
        </FormSection>

        <FormSection title="📝 技能证书（选填）">
          <Field label="技能标签" placeholder="搜索或新建标签..." />
          {emp?.skills && (
            <div className={styles.selectedTags}>已选: {emp.skills.join(', ')}</div>
          )}
        </FormSection>

        <FormSection title="🎯 兴趣爱好（选填）">
          <Field label="兴趣标签" placeholder="搜索兴趣标签..." />
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
  defaultValue,
  placeholder,
  type = 'text',
  options,
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: 'text' | 'date' | 'select';
  options?: string[];
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {type === 'select' ? (
        <select defaultValue={defaultValue}>
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} defaultValue={defaultValue} placeholder={placeholder} />
      )}
    </label>
  );
}
