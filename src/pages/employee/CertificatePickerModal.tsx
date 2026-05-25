import { CatalogTagPickerModal } from '../../components/CatalogTagPickerModal';
import { useCertificateCatalog } from '../../context/CertificateCatalogContext';
interface Props {
  existingNames: string[];
  onConfirm: (names: string[]) => void;
  onClose: () => void;
}

export function CertificatePickerModal({ existingNames, onConfirm, onClose }: Props) {
  const { catalog } = useCertificateCatalog();

  return (
    <CatalogTagPickerModal
      title="个人证书"
      catalog={catalog}
      existingNames={existingNames}
      inputPlaceholder="请输入证书名称，回车添加自定义"
      emptySearchHint={(q) => `未找到匹配证书，按回车将「${q}」添加为自定义`}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
