import { CatalogTagPickerModal } from '../../components/CatalogTagPickerModal';
import { useTagCatalog } from '../../context/TagCatalogContext';
import { SKILL_TAG_PICKER_MAX } from '../../data/skillTagCatalog';
import { labelForEmployeeTag } from '../../utils/tagLabel';

interface Props {
  existingNames: string[];
  onConfirm: (names: string[]) => void;
  onClose: () => void;
}

export function SkillPickerModal({ existingNames, onConfirm, onClose }: Props) {
  const { skillCatalog, skillTagNames } = useTagCatalog();

  const handleConfirm = (names: string[]) => {
    const resolved = names.map((n) => labelForEmployeeTag(n, skillTagNames) ?? n);
    onConfirm(resolved);
  };

  return (
    <CatalogTagPickerModal
      title="专业技能"
      maxCount={SKILL_TAG_PICKER_MAX}
      catalog={skillCatalog}
      existingNames={existingNames}
      inputPlaceholder="请输入技能名称，回车添加自定义（不入标签库）"
      emptySearchHint={(q) => `按回车添加自定义技能「${q}」（仅保存在员工档案）`}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
