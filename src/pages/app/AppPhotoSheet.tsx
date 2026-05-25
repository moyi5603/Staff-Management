import { useRef } from 'react';
import styles from './AppPhotoSheet.module.css';

interface Props {
  onSelect: (dataUrl: string) => void;
  onClose: () => void;
}

export function AppPhotoSheet({ onSelect, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) {
      window.alert('请选择 JPG 或 PNG 图片');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      window.alert('图片不能超过 2MB（演示限制）');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSelect(reader.result);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.card}>
          <button
            type="button"
            className={styles.action}
            onClick={() => window.alert('拍照为演示占位，接入 App 后调用系统相机')}
          >
            拍照
          </button>
          <button
            type="button"
            className={styles.action}
            onClick={() => fileInputRef.current?.click()}
          >
            从相册选择
          </button>
        </div>
        <p className={styles.hint}>JPG/PNG，建议 200×200px，最大 2MB</p>
        <button type="button" className={styles.cancel} onClick={onClose}>
          取消
        </button>
        <input
          ref={fileInputRef}
          className={styles.hiddenInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
