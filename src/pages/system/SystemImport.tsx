import { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import styles from './SystemImport.module.css';

const modules = ['员工管理', '部门管理', '岗位管理', '项目管理', '值班管理', '技能标签'];

export function SystemImport() {
  const [tab, setTab] = useState<'import' | 'export'>('import');

  return (
    <>
      <PageHeader title="数据导入/导出" />
      <div className={styles.tabs}>
        <button type="button" className={tab === 'import' ? styles.active : ''} onClick={() => setTab('import')}>
          数据导入
        </button>
        <button type="button" className={tab === 'export' ? styles.active : ''} onClick={() => setTab('export')}>
          数据导出
        </button>
      </div>

      <Card>
        {tab === 'import' ? (
          <>
            <h3 className={styles.cardTitle}>选择导入模块</h3>
            <div className={styles.moduleGrid}>
              {modules.map((m) => (
                <button key={m} type="button" className={styles.moduleBtn}>
                  {m}
                </button>
              ))}
            </div>
            <div className={styles.steps}>
              <p>1. 下载对应模块的标准 Excel 模板</p>
              <p>2. 填写数据后上传，系统将展示预览与字段映射</p>
              <p>3. 确认无误后提交，查看导入结果报告</p>
            </div>
            <Button variant="text">下载通用导入说明</Button>
            <div className={styles.uploadZone}>拖拽上传或点击选择文件 (.xlsx / .xls / .csv)</div>
          </>
        ) : (
          <>
            <h3 className={styles.cardTitle}>数据导出</h3>
            <label className={styles.field}>
              导出模块
              <select>
                {modules.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              导出格式
              <select>
                <option>Excel (.xlsx)</option>
                <option>CSV</option>
              </select>
            </label>
            <Button variant="primary">开始导出</Button>
          </>
        )}
      </Card>
    </>
  );
}
