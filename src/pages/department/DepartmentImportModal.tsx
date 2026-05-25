import { useState } from 'react';
import { Button } from '../../components/Button';
import styles from './DepartmentList.module.css';

interface Props {
  onClose: () => void;
  onImported: (count: number) => void;
}

export function DepartmentImportModal({ onClose, onImported }: Props) {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState('');

  const finish = () => {
    onImported(3);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>批量导入部门 · 步骤 {step}/3</h3>
        {step === 1 && (
          <>
            <p>
              <Button variant="text">下载部门导入模板.xlsx</Button>
            </p>
            <label className={styles.uploadZone}>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                hidden
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
              />
              {fileName ? `已选择：${fileName}` : '点击或拖拽上传 (.xlsx / .xls / .csv)'}
            </label>
          </>
        )}
        {step === 2 && (
          <div className={styles.importPreview}>
            <p>预览解析结果（共 3 条）：</p>
            <ul>
              <li>市场部 · 上级：公司总部</li>
              <li>品牌组 · 上级：市场部</li>
              <li>渠道组 · 上级：市场部</li>
            </ul>
          </div>
        )}
        {step === 3 && <p className={styles.importResult}>导入完成：成功 3 条 / 失败 0 条</p>}
        <div className={styles.modalActions}>
          <Button variant="default" onClick={onClose}>
            取消
          </Button>
          {step > 1 && step < 3 && (
            <Button variant="default" onClick={() => setStep((s) => s - 1)}>
              返回
            </Button>
          )}
          {step < 3 ? (
            <Button
              variant="primary"
              disabled={step === 1 && !fileName}
              onClick={() => setStep((s) => s + 1)}
            >
              下一步
            </Button>
          ) : (
            <Button variant="primary" onClick={finish}>
              完成
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
