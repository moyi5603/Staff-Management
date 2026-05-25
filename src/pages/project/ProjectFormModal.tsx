import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import type { Employee, Project, ProjectMember, ProjectMemberRole, ProjectStatus } from '../../types';
import modalStyles from '../position/PositionList.module.css';
import styles from './ProjectList.module.css';

export interface ProjectFormValues {
  name: string;
  description: string;
  departmentId: string;
  relatedDepartments: string[];
  leaderId: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  members: ProjectMember[];
}

interface Props {
  title: string;
  initial?: Project;
  departmentOptions: { id: string; name: string }[];
  relatedDepartmentNames: string[];
  employeeOptions: Employee[];
  defaultDepartmentId?: string;
  onSave: (values: ProjectFormValues) => void;
  onClose: () => void;
}

const ROLES: ProjectMemberRole[] = ['负责人', '核心成员', '一般成员'];

function isManualMemberId(id: string): boolean {
  return id.startsWith('manual-');
}

function isEmployeeMember(m: ProjectMember, employees: Employee[]): boolean {
  return !isManualMemberId(m.employeeId) && employees.some((e) => e.id === m.employeeId);
}

function upsertLeaderMember(members: ProjectMember[], leader: Employee): ProjectMember[] {
  const rest = members.filter((m) => m.employeeId !== leader.id);
  return [{ employeeId: leader.id, name: leader.name, role: '负责人' }, ...rest];
}

export function ProjectFormModal({
  title,
  initial,
  departmentOptions,
  relatedDepartmentNames,
  employeeOptions,
  defaultDepartmentId,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [departmentId, setDepartmentId] = useState(
    initial?.departmentId ?? defaultDepartmentId ?? departmentOptions[0]?.id ?? '',
  );
  const [relatedDepartments, setRelatedDepartments] = useState<string[]>(
    initial?.relatedDepartments ? [...initial.relatedDepartments] : [],
  );
  const [leaderId, setLeaderId] = useState(initial?.leaderId ?? employeeOptions[0]?.id ?? '');
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? '未启动');
  const [startDate, setStartDate] = useState(initial?.startDate ?? '');
  const [endDate, setEndDate] = useState(initial?.endDate ?? '');
  const [members, setMembers] = useState<ProjectMember[]>(
    initial?.members?.length
      ? initial.members.map((m) => ({ ...m }))
      : leaderId
        ? [
            {
              employeeId: leaderId,
              name: employeeOptions.find((e) => e.id === leaderId)?.name ?? '',
              role: '负责人',
            },
          ]
        : [],
  );
  const [error, setError] = useState('');

  const activeEmployees = useMemo(
    () => employeeOptions.filter((e) => e.status === '在职'),
    [employeeOptions],
  );

  const primaryDeptName = useMemo(
    () => departmentOptions.find((d) => d.id === departmentId)?.name ?? '',
    [departmentOptions, departmentId],
  );

  const toggleRelatedDept = (deptName: string) => {
    setRelatedDepartments((prev) =>
      prev.includes(deptName) ? prev.filter((n) => n !== deptName) : [...prev, deptName],
    );
  };

  const handleLeaderChange = (id: string) => {
    setLeaderId(id);
    const leader = activeEmployees.find((e) => e.id === id);
    if (leader) setMembers((m) => upsertLeaderMember(m, leader));
  };

  const employeesAvailableAt = (index: number) => {
    const usedIds = new Set(
      members
        .filter((_, i) => i !== index)
        .filter((m) => isEmployeeMember(m, activeEmployees))
        .map((m) => m.employeeId),
    );
    return activeEmployees.filter((e) => !usedIds.has(e.id) || members[index]?.employeeId === e.id);
  };

  const addMember = () => {
    setMembers((m) => [
      ...m,
      { employeeId: `manual-${Date.now()}`, name: '', role: '一般成员' },
    ]);
  };

  const setMemberFromEmployee = (index: number, employeeId: string) => {
    const emp = activeEmployees.find((e) => e.id === employeeId);
    if (!emp) return;
    setMembers((list) => {
      const next = [...list];
      next[index] = { employeeId: emp.id, name: emp.name, role: next[index].role };
      return next;
    });
  };

  const setMemberManualName = (index: number, name: string) => {
    setMembers((list) => {
      const next = [...list];
      const id = isManualMemberId(next[index].employeeId)
        ? next[index].employeeId
        : `manual-${Date.now()}`;
      next[index] = { employeeId: id, name, role: next[index].role };
      return next;
    });
  };

  const clearMemberSelection = (index: number) => {
    setMembers((list) => {
      const next = [...list];
      next[index] = {
        employeeId: `manual-${Date.now()}`,
        name: next[index].name,
        role: next[index].role,
      };
      return next;
    });
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('请填写项目名称');
      return;
    }
    if (!departmentId) {
      setError('请选择主责部门');
      return;
    }
    if (!leaderId) {
      setError('请选择项目负责人');
      return;
    }
    if (!startDate) {
      setError('请填写开始日期');
      return;
    }
    if (status === '已结束' && !endDate) {
      setError('已结束项目需填写结束日期');
      return;
    }
    if (endDate && endDate < startDate) {
      setError('结束日期不能早于开始日期');
      return;
    }

    const leader = activeEmployees.find((e) => e.id === leaderId);
    if (!leader) {
      setError('项目负责人无效');
      return;
    }

    const extraMembers = members.filter((m) => m.employeeId !== leaderId);
    if (extraMembers.some((m) => !m.name.trim())) {
      setError('请为每位成员选择员工或输入姓名');
      return;
    }

    const normalizedMembers = upsertLeaderMember(
      members.filter((m) => m.name.trim()),
      leader,
    );

    onSave({
      name: name.trim(),
      description: description.trim(),
      departmentId,
      relatedDepartments: relatedDepartments.filter((n) => n !== primaryDeptName),
      leaderId,
      status,
      startDate,
      endDate: endDate.trim(),
      members: normalizedMembers,
    });
  };

  return (
    <div className={modalStyles.modalOverlay} onClick={onClose}>
      <div className={`${modalStyles.modal} ${modalStyles.modalWide}`} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {error && <p className={modalStyles.formError}>{error}</p>}

        <div className={modalStyles.formGrid}>
          <label className={modalStyles.formField}>
            <span>项目名称 *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：智能客服系统 v2.0" />
          </label>
          <label className={modalStyles.formField}>
            <span>项目状态 *</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
              <option value="未启动">未启动</option>
              <option value="进行中">进行中</option>
              <option value="已结束">已结束</option>
            </select>
          </label>
          <label className={modalStyles.formField}>
            <span>主责部门 *</span>
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
              {departmentOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className={modalStyles.formField}>
            <span>项目负责人 *</span>
            <select value={leaderId} onChange={(e) => handleLeaderChange(e.target.value)}>
              {activeEmployees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}（{e.departmentName}）
                </option>
              ))}
            </select>
          </label>
          <label className={modalStyles.formField}>
            <span>开始日期 *</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label className={modalStyles.formField}>
            <span>结束日期{status === '已结束' ? ' *' : ''}</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <label className={`${modalStyles.formField} ${modalStyles.formFieldFull}`}>
            <span>项目简介</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="项目目标与范围说明"
            />
          </label>
        </div>

        <div className={styles.relatedDepts}>
          <span className={styles.sectionLabel}>参与部门（可选）</span>
          <div className={styles.deptChecks}>
            {relatedDepartmentNames
              .filter((n) => n !== primaryDeptName)
              .map((deptName) => (
                <label key={deptName} className={styles.deptCheck}>
                  <input
                    type="checkbox"
                    checked={relatedDepartments.includes(deptName)}
                    onChange={() => toggleRelatedDept(deptName)}
                  />
                  {deptName}
                </label>
              ))}
          </div>
        </div>

        <div className={modalStyles.dutyEditor}>
          <div className={modalStyles.dutyEditorHead}>
            <span>项目成员</span>
            <Button variant="text" onClick={addMember}>
              + 添加成员
            </Button>
          </div>
          {members.map((member, index) => {
            const isLeader = member.employeeId === leaderId;
            const fromEmployee = isEmployeeMember(member, activeEmployees);

            return (
              <div key={`${member.employeeId}-${index}`} className={styles.memberRow}>
                {isLeader ? (
                  <span className={styles.memberName}>{member.name}</span>
                ) : (
                  <div className={styles.memberPick}>
                    <select
                      className={styles.memberSelect}
                      value={fromEmployee ? member.employeeId : ''}
                      onChange={(e) => {
                        const id = e.target.value;
                        if (id) setMemberFromEmployee(index, id);
                        else clearMemberSelection(index);
                      }}
                    >
                      <option value="">请选择员工</option>
                      {employeesAvailableAt(index).map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}（{e.departmentName}）
                        </option>
                      ))}
                    </select>
                    <span className={styles.memberOr}>或</span>
                    <input
                      className={styles.memberInput}
                      placeholder="输入姓名"
                      value={member.name}
                      onChange={(e) => setMemberManualName(index, e.target.value)}
                    />
                  </div>
                )}
                <select
                  className={styles.memberRole}
                  value={member.role}
                  disabled={isLeader}
                  onChange={(e) => {
                    const next = [...members];
                    next[index] = { ...next[index], role: e.target.value as ProjectMemberRole };
                    setMembers(next);
                  }}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {!isLeader && (
                  <Button
                    variant="danger"
                    onClick={() => setMembers((m) => m.filter((_, i) => i !== index))}
                  >
                    移除
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className={modalStyles.modalActions}>
          <Button variant="default" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}
