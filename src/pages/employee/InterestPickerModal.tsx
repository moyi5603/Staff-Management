import { CatalogTagPickerModal } from '../../components/CatalogTagPickerModal';
import { useTagCatalog } from '../../context/TagCatalogContext';
import { INTEREST_TAG_PICKER_MAX } from '../../data/interestTagCatalog';
import { labelForEmployeeTag } from '../../utils/tagLabel';

interface Props {
  existingNames: string[];
  onConfirm: (names: string[]) => void;
  onClose: () => void;
}

export function InterestPickerModal({ existingNames, onConfirm, onClose }: Props) {
  const { interestCatalog, interestTagNames } = useTagCatalog();

  const handleConfirm = (names: string[]) => {
    const resolved = names.map((n) => labelForEmployeeTag(n, interestTagNames) ?? n);
    onConfirm(resolved);
  };

  return (
    <CatalogTagPickerModal
      title="兴趣爱好"
      maxCount={INTEREST_TAG_PICKER_MAX}
      catalog={interestCatalog}
      existingNames={existingNames}
      inputPlaceholder="请输入兴趣名称，回车添加自定义（不入标签库）"
      emptySearchHint={(q) => `按回车添加自定义兴趣「${q}」（仅保存在员工档案）`}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
