import { useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import type {
  Employee,
  Project,
  ProjectLevel,
  ProjectMember,
  ProjectMemberRole,
  ProjectPriority,
  ProjectStatus,
} from '../../types';
import formStyles from '../../styles/modalForm.module.css';
import modalStyles from '../position/PositionList.module.css';
import { MemberSearchCombo } from './MemberSearchCombo';
import styles from './ProjectList.module.css';

const PROJECT_LEVELS: ProjectLevel[] = ['公司级', '部门级', '团队级'];
const PROJECT_PRIORITIES: ProjectPriority[] = ['高', '中', '低'];
const EDITABLE_ROLES: ProjectMemberRole[] = ['核心成员', '一般成员'];

export interface ProjectFormValues {
  name: string;
  description: string;
  departmentId: string;
  leaderId: string;
  status: ProjectStatus;
  level: ProjectLevel;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  members: ProjectMember[];
}

interface Props {
  title: string;
  initial?: Project;
  departmentOptions: { id: string; name: string }[];
  employeeOptions: Employee[];
  defaultDepartmentId?: string;
  onSave: (values: ProjectFormValues) => void;
  onClose: () => void;
}

function upsertLeaderMember(members: ProjectMember[], leader: Employee): ProjectMember[] {
  const rest = members.filter((m) => m.employeeId !== leader.id);
  return [
    {
      employeeId: leader.id,
      name: leader.name,
      role: '负责人',
      departmentName: leader.departmentName,
    },
    ...rest,
  ];
}

function employeesInDepartment(employees: Employee[], departmentId: string): Employee[] {
  return employees.filter((e) => e.departmentId === departmentId);
}

export function ProjectFormModal({
  title,
  initial,
  departmentOptions,
  employeeOptions,
  defaultDepartmentId,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const initialDepartmentId =
    initial?.departmentId ?? defaultDepartmentId ?? departmentOptions[0]?.id ?? '';
  const [departmentId, setDepartmentId] = useState(initialDepartmentId);
  const [leaderId, setLeaderId] = useState(() => {
    if (initial?.leaderId) return initial.leaderId;
    const inDept = employeesInDepartment(
      employeeOptions.filter((e) => e.status === '在职'),
      initialDepartmentId,
    );
    return inDept[0]?.id ?? '';
  });
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? '未启动');
  const [level, setLevel] = useState<ProjectLevel>(initial?.level ?? '部门级');
  const [priority, setPriority] = useState<ProjectPriority>(initial?.priority ?? '中');
  const [startDate, setStartDate] = useState(initial?.startDate ?? '');
  const [endDate, setEndDate] = useState(initial?.endDate ?? '');
  const [members, setMembers] = useState<ProjectMember[]>(() => {
    if (initial?.members?.length) return initial.members.map((m) => ({ ...m }));
    const lid = initial?.leaderId ?? employeeOptions[0]?.id ?? '';
    const leader = employeeOptions.find((e) => e.id === lid);
    return leader ? [{ employeeId: leader.id, name: leader.name, role: '负责人' }] : [];
  });
  const [error, setError] = useState('');

  const activeEmployees = useMemo(
    () => employeeOptions.filter((e) => e.status === '在职'),
    [employeeOptions],
  );

  /** 展示成员部门时用全量员工（含离职），避免已选成员显示「—」 */
  const employeeById = useMemo(
    () => new Map(employeeOptions.map((e) => [e.id, e])),
    [employeeOptions],
  );

  const departmentEmployees = useMemo(
    () => employeesInDepartment(activeEmployees, departmentId),
    [activeEmployees, departmentId],
  );

  const leaderSelectValue = departmentEmployees.some((e) => e.id === leaderId) ? leaderId : '';

  const leader = useMemo(
    () => departmentEmployees.find((e) => e.id === leaderSelectValue),
    [departmentEmployees, leaderSelectValue],
  );

  const extraMembers = useMemo(
    () => members.filter((m) => m.employeeId !== leaderSelectValue),
    [members, leaderSelectValue],
  );

  const availableEmployees = useMemo(() => {
    const usedIds = new Set(members.map((m) => m.employeeId));
    return activeEmployees.filter((e) => !usedIds.has(e.id));
  }, [activeEmployees, members]);

  const handleDepartmentChange = (nextDepartmentId: string) => {
    setDepartmentId(nextDepartmentId);
    const candidates = employeesInDepartment(activeEmployees, nextDepartmentId);
    if (candidates.some((e) => e.id === leaderId)) return;

    const nextLeader = candidates[0];
    if (nextLeader) {
      setLeaderId(nextLeader.id);
      setMembers((m) => upsertLeaderMember(m, nextLeader));
    } else {
      setLeaderId('');
      setMembers((m) => m.filter((x) => x.role !== '负责人'));
    }
  };

  const handleLeaderChange = (id: string) => {
    setLeaderId(id);
    const nextLeader = departmentEmployees.find((e) => e.id === id);
    if (nextLeader) setMembers((m) => upsertLeaderMember(m, nextLeader));
  };

  const memberDepartmentLabel = (member: ProjectMember) =>
    member.departmentName ?? employeeById.get(member.employeeId)?.departmentName ?? '—';

  const removeExtraMember = (employeeId: string) => {
    setMembers((m) => m.filter((x) => x.employeeId !== employeeId));
  };

  const updateMemberRole = (employeeId: string, role: ProjectMember['role']) => {
    setMembers((m) => m.map((x) => (x.employeeId === employeeId ? { ...x, role } : x)));
  };

  const handleAddMember = (member: ProjectMember) => {
    if (members.some((m) => m.employeeId === member.employeeId || m.name === member.name)) {
      setError('该成员已在列表中');
      return;
    }
    setMembers((m) => [...m, member]);
    setError('');
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
      setError(departmentEmployees.length === 0 ? '该部门暂无在职员工，无法选择负责人' : '请选择项目负责人');
      return;
    }
    if (!departmentEmployees.some((e) => e.id === leaderId)) {
      setError('项目负责人须属于所选主责部门');
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

    if (!leader) {
      setError('项目负责人无效');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      departmentId,
      leaderId: leader.id,
      status,
      level,
      priority,
      startDate,
      endDate: endDate.trim(),
      members: upsertLeaderMember(members.filter((m) => m.name.trim()), leader),
    });
  };

  return (
    <div className={modalStyles.modalOverlay} onClick={onClose}>
      <div className={`${modalStyles.modal} ${modalStyles.modalWide}`} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {error && <p className={formStyles.formError}>{error}</p>}

        <div className={formStyles.formGrid}>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>项目名称 *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：智能客服系统 v2.0" />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>项目状态 *</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
              <option value="未启动">未启动</option>
              <option value="进行中">进行中</option>
              <option value="已结束">已结束</option>
            </select>
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>项目级别 *</span>
            <select value={level} onChange={(e) => setLevel(e.target.value as ProjectLevel)}>
              {PROJECT_LEVELS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>项目优先级 *</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value as ProjectPriority)}>
              {PROJECT_PRIORITIES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>主责部门 *</span>
            <select value={departmentId} onChange={(e) => handleDepartmentChange(e.target.value)}>
              {departmentOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>项目负责人 *</span>
            <select
              value={leaderSelectValue}
              onChange={(e) => handleLeaderChange(e.target.value)}
              disabled={departmentEmployees.length === 0}
            >
              {departmentEmployees.length === 0 ? (
                <option value="">该部门暂无在职员工</option>
              ) : (
                <>
                  {!leaderSelectValue && <option value="">请选择负责人</option>}
                  {departmentEmployees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>开始日期 *</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull} ${formStyles.formFieldCenter}`}>
            <span>结束日期{status === '已结束' ? ' *' : ''}</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <label className={`${formStyles.formField} ${formStyles.formFieldFull}`}>
            <span>项目简介</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="项目目标与范围说明"
            />
          </label>
        </div>

        <div className={styles.memberSection}>
          <span className={styles.sectionLabel}>项目成员</span>

          {leader && (
            <div className={styles.leaderHint}>
              <span className={styles.leaderTag}>负责人</span>
              <span>
                {leader.name}
                <span className={styles.leaderMeta}> · {leader.departmentName}</span>
                <span className={styles.leaderMeta}>（与上方项目负责人一致，自动加入）</span>
              </span>
            </div>
          )}

          <div className={styles.memberAddPanel}>
            <MemberSearchCombo availableEmployees={availableEmployees} onAdd={handleAddMember} />
          </div>

          {extraMembers.length > 0 ? (
            <ul className={styles.memberList}>
              {extraMembers.map((m) => (
                <li key={m.employeeId} className={styles.memberListItem}>
                  <span className={styles.memberListName}>{m.name}</span>
                  <span className={styles.memberListDept}>{memberDepartmentLabel(m)}</span>
                  <select
                    className={styles.memberListRoleSelect}
                    value={m.role}
                    onChange={(e) =>
                      updateMemberRole(m.employeeId, e.target.value as ProjectMemberRole)
                    }
                  >
                    {EDITABLE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <Button variant="text" onClick={() => removeExtraMember(m.employeeId)}>
                    移除
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.memberEmpty}>除负责人外，可继续添加项目成员</p>
          )}
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
