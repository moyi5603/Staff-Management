import { useRef, useState } from 'react';
import { Button } from '../../components/Button';
import styles from './DutyCalendar.module.css';

interface Props {
  onImport: (fileName: string) => void;
  onClose: () => void;
}

export function DutyBatchModal({ onImport, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.toLowerCase();
    if (!ext.endsWith('.xlsx') && !ext.endsWith('.xls')) {
      setError('请上传 .xlsx 或 .xls 格式的排班表');
      setFileName('');
      return;
    }
    setError('');
    setFileName(file.name);
  };

  const handleSubmit = () => {
    if (!fileName) {
      setError('请先上传排班表');
      return;
    }
    onImport(fileName);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>批量排班</h3>
        {error && <p className={styles.formError}>{error}</p>}

        <p className={styles.batchHint}>
          下载排班模板，按模板填写后上传。本期为演示原型，上传后不会解析 Excel 写入日历。
        </p>

        <div className={styles.batchUploadRow}>
          <Button variant="default" onClick={() => window.alert('已下载排班模板（演示）')}>
            下载模板
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          className={styles.fileInputHidden}
          onChange={handleFileChange}
        />
        <div
          className={styles.uploadZone}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          {fileName ? (
            <>
              <span className={styles.uploadFileName}>{fileName}</span>
              <span className={styles.uploadHint}>点击可重新选择文件</span>
            </>
          ) : (
            '拖拽或点击上传 .xlsx / .xls 排班表'
          )}
        </div>

        <div className={styles.modalActions}>
          <Button variant="default" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!fileName}>
            确认导入
          </Button>
        </div>
      </div>
    </div>
  );
}
