import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { POLITICAL_STATUS_OPTIONS, type PoliticalStatus } from '../../types';
import { employees } from '../../mock/data';
import { InterestPickerModal } from '../employee/InterestPickerModal';
import { AppEditSheet } from './AppEditSheet';
import { AppNativePlaceSheet } from './AppNativePlaceSheet';
import styles from './AppProfile.module.css';

const DEMO_COMPANY = '北京北纬三十度网络科技有限公司';

type EditField = 'nickname' | 'bio' | 'political' | null;

/** App 端「我的资料」演示页，数据仅存于页面状态 */
export function AppProfile() {
  const seed = employees[0];
  const [nickname, setNickname] = useState('18518168316');
  const [name] = useState('李鸿');
  const [department] = useState('产品设计部');
  const [empNo] = useState(seed?.empNo ?? '');
  const [companyName] = useState(DEMO_COMPANY);
  const [bio, setBio] = useState(seed?.bio ?? '');
  const [politicalStatus, setPoliticalStatus] = useState<PoliticalStatus | ''>(
    seed?.politicalStatus ?? '',
  );
  const [nativePlace, setNativePlace] = useState(seed?.nativePlace ?? '');
  const [interests, setInterests] = useState<string[]>(() => [...(seed?.interests ?? [])]);

  const [editField, setEditField] = useState<EditField>(null);
  const [nativePlaceOpen, setNativePlaceOpen] = useState(false);
  const [interestPickerOpen, setInterestPickerOpen] = useState(false);

  const politicalLabel = politicalStatus || '请选择';
  const nativePlaceLabel = nativePlace || '请选择';
  const bioPreview = bio.trim() ? (bio.length > 18 ? `${bio.slice(0, 18)}…` : bio) : '请填写';
  const interestPreview = useMemo(() => {
    if (interests.length === 0) return '请填写';
    if (interests.length <= 3) return interests.join('、');
    return `${interests.slice(0, 3).join('、')} 等${interests.length}项`;
  }, [interests]);

  const handleInterestConfirm = (names: string[]) => {
    const existing = new Set(interests.map((i) => i.toLowerCase()));
    const added = names.filter((n) => !existing.has(n.toLowerCase()));
    if (added.length > 0) setInterests((prev) => [...prev, ...added]);
    setInterestPickerOpen(false);
  };

  const politicalOptions = [
    { value: '', label: '未选择' },
    ...POLITICAL_STATUS_OPTIONS.map((o) => ({ value: o, label: o })),
  ];

  return (
    <div className={styles.page}>
      <div className={styles.phone}>
        <header className={styles.nav}>
          <Link to="/employee/list" className={styles.backLink}>
            管理后台
          </Link>
          <span className={styles.navTitle}>我的资料</span>
        </header>

        <div className={styles.list}>
          <ProfileRow
            label="头像"
            clickable
            onClick={() => window.alert('头像上传为演示占位，接入 App 后对接相册/拍照')}
            value={
              <span className={styles.avatar} aria-hidden>
                🙂
              </span>
            }
          />
          <ProfileRow
            label="昵称"
            value={nickname}
            clickable
            onClick={() => setEditField('nickname')}
          />
          <ProfileRow label="姓名" value={name} readonly />
          <ProfileRow label="部门" value={department} readonly />
          <ProfileRow label="工号" value={empNo || '—'} readonly />
          <ProfileRow label="公司全称" value={companyName} readonly multiline />
        </div>

        <div className={styles.sectionGap} />

        <div className={styles.list}>
          <ProfileRow
            label="个人介绍"
            value={bioPreview}
            placeholder={!bio.trim()}
            clickable
            onClick={() => setEditField('bio')}
          />
          <ProfileRow
            label="政治面貌"
            value={politicalLabel}
            placeholder={!politicalStatus}
            clickable
            onClick={() => setEditField('political')}
          />
          <ProfileRow
            label="籍贯"
            value={nativePlaceLabel}
            placeholder={!nativePlace}
            clickable
            onClick={() => setNativePlaceOpen(true)}
          />
          <ProfileRow
            label="兴趣爱好"
            clickable
            onClick={() => setInterestPickerOpen(true)}
            value={
              interests.length > 0 ? (
                <span className={styles.tagPreview}>
                  {interests.slice(0, 4).map((t) => (
                    <span key={t} className={styles.tagChip}>
                      {t}
                    </span>
                  ))}
                  {interests.length > 4 && (
                    <span className={styles.tagChip}>+{interests.length - 4}</span>
                  )}
                </span>
              ) : (
                interestPreview
              )
            }
            placeholder={interests.length === 0}
          />
        </div>

        <div className={styles.sectionGap} />

        <div className={styles.list}>
          <ProfileRow
            label="注销账号"
            className={styles.deactivate}
            clickable
            onClick={() => window.alert('注销账号流程为演示占位')}
          />
        </div>

        <p className={styles.footerNote}>
          本页为 App 端资料编辑原型，兴趣标签来自管理后台「兴趣标签管理」。
        </p>
      </div>

      {editField === 'nickname' && (
        <AppEditSheet
          title="修改昵称"
          mode="text"
          value={nickname}
          placeholder="请输入昵称"
          maxLength={32}
          onConfirm={setNickname}
          onClose={() => setEditField(null)}
        />
      )}
      {editField === 'bio' && (
        <AppEditSheet
          title="个人介绍"
          mode="textarea"
          value={bio}
          placeholder="简要介绍工作经历、专长等"
          hint="最多 200 字，将展示在同事查找与名片中"
          maxLength={200}
          onConfirm={setBio}
          onClose={() => setEditField(null)}
        />
      )}
      {editField === 'political' && (
        <AppEditSheet
          title="政治面貌"
          mode="select"
          value={politicalStatus}
          options={politicalOptions}
          onConfirm={(v) => setPoliticalStatus(v as PoliticalStatus | '')}
          onClose={() => setEditField(null)}
        />
      )}
      {nativePlaceOpen && (
        <AppNativePlaceSheet
          value={nativePlace}
          onConfirm={setNativePlace}
          onClose={() => setNativePlaceOpen(false)}
        />
      )}
      {interestPickerOpen && (
        <InterestPickerModal
          existingNames={interests}
          onConfirm={handleInterestConfirm}
          onClose={() => setInterestPickerOpen(false)}
        />
      )}
    </div>
  );
}

function ProfileRow({
  label,
  value,
  clickable,
  readonly,
  placeholder,
  multiline,
  className,
  onClick,
}: {
  label: string;
  value?: React.ReactNode;
  clickable?: boolean;
  readonly?: boolean;
  placeholder?: boolean;
  multiline?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const isString = typeof value === 'string';
  const Tag = clickable ? 'button' : 'div';

  return (
    <Tag
      type={clickable ? 'button' : undefined}
      className={`${styles.row} ${clickable ? styles.rowClickable : ''} ${className ?? ''}`}
      onClick={clickable ? onClick : undefined}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.valueWrap}>
        {isString ? (
          <span
            className={`${styles.value} ${readonly ? styles.valueDark : ''} ${placeholder ? styles.placeholder : ''}`}
            style={multiline ? { whiteSpace: 'normal', textAlign: 'right' } : undefined}
          >
            {value}
          </span>
        ) : (
          value
        )}
        {clickable && <span className={styles.chevron} aria-hidden>{'>'}</span>}
      </span>
    </Tag>
  );
}
