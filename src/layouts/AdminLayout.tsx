import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { menuConfig } from '../config/menu';
import styles from './AdminLayout.module.css';

export function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const breadcrumb = getBreadcrumb(location.pathname);

  return (
    <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>🔍</span>
          <span className={styles.systemName}>智能找同事 · 管理后台</span>
        </div>
        <div className={styles.headerRight}>
          <input className={styles.globalSearch} placeholder="全局搜索..." />
          <button type="button" className={styles.iconBtn} title="通知">
            🔔
          </button>
          <div className={styles.avatar}>管</div>
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? '展开' : '收起'}
          >
            {collapsed ? '»' : '«'}
          </button>
          <nav className={styles.nav}>
            {menuConfig.map((group) => (
              <div key={group.key} className={styles.navGroup}>
                {!collapsed && <div className={styles.navGroupTitle}>{group.label}</div>}
                {group.children?.map((item) => {
                  const active =
                    item.path &&
                    (location.pathname === item.path.split('?')[0] ||
                      (item.path.startsWith('/employee') && location.pathname.startsWith('/employee')));
                  return (
                    <Link
                      key={item.key}
                      to={item.path ?? '#'}
                      className={`${styles.navItem} ${active ? styles.active : ''}`}
                      title={item.label}
                    >
                      {collapsed ? item.label.charAt(0) : item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        <main className={styles.main}>
          <div className={styles.breadcrumb}>
            <span>首页</span>
            {breadcrumb.map((b) => (
              <span key={b}>
                <span className={styles.sep}> / </span>
                {b}
              </span>
            ))}
          </div>
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function getBreadcrumb(pathname: string): string[] {
  if (pathname.startsWith('/employee/detail')) return ['企业管理', '员工管理', '员工详情'];
  if (pathname.startsWith('/employee/form')) return ['企业管理', '员工管理', '编辑员工'];
  if (pathname.startsWith('/employee')) return ['企业管理', '员工管理'];
  if (pathname.startsWith('/department')) return ['企业管理', '部门管理'];
  if (pathname.startsWith('/position')) return ['企业管理', '岗位管理'];
  if (pathname.startsWith('/project')) return ['项目管理', '项目列表'];
  if (pathname.startsWith('/duty')) return ['值班管理', '值班日历'];
  if (pathname.startsWith('/tag/skill')) return ['标签中心', '技能标签'];
  if (pathname.startsWith('/tag/interest')) return ['标签中心', '兴趣标签'];
  if (pathname.startsWith('/tag/group')) return ['标签中心', '兴趣小组'];
  if (pathname.startsWith('/system/log')) return ['系统设置', '操作日志'];
  if (pathname.startsWith('/system/import')) return ['系统设置', '数据导入/导出'];
  return [];
}
