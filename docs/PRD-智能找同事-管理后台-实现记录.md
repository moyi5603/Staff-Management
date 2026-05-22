# PRD：智能「找同事」管理后台 — 实现记录

**Status**: 已实现（前端原型）  
**Author**: Staff-Management 项目组  
**Last Updated**: 2026-05-22  
**Version**: 1.0  
**关联文档**:
- 原始 PRD：`PRD-智能找同事-管理后台.md`
- 页面设计：`设计规范-智能找同事管理后台.md`

---

## 1. 文档目的

本文档在原始 PRD 与设计规范基础上，记录 **Staff-Management 仓库内已落地的管理后台实现**，包括技术选型、页面路由、组件清单、数据模型与后续迭代计划，便于研发、产品与测试对齐验收范围。

---

## 2. 实现范围对照

| 模块 | PRD 要求 | 设计规范页面 | 本仓库实现状态 |
|------|---------|-------------|---------------|
| 员工管理 | 列表/详情/表单/导入导出 | P0：列表、详情、表单 | ✅ 前端页面 + Mock 数据 |
| 部门管理 | 树形组织/联系人 | P0：左右分栏 | ✅ |
| 岗位管理 | 列表/KPI | P1 | ✅ 列表页 |
| 项目管理 | 卡片列表/成员 | P1 | ✅ |
| 值班管理 | 日历/批量排班 | P1 | ✅ |
| 标签中心 | 技能/兴趣/小组 | P1 | ✅ |
| 操作日志 | 审计 | P2 | ✅ |
| 数据导入导出 | 公共能力 | P1 | ✅ |
| 后端 API | REST/GraphQL | — | ⏳ 待开发 |
| 权限体系 | 粗粒度角色 | 第六章 | ⏳ UI 预留，未接认证 |

---

## 3. 技术方案

### 3.1 技术栈

| 层级 | 选型 | 说明 |
|------|------|------|
| 框架 | React 19 + TypeScript | 组件化、类型安全 |
| 构建 | Vite 6 | 本地开发与生产构建 |
| 路由 | React Router 7 | 与设计规范路径一致 |
| 样式 | CSS Modules + Design Tokens | 色值/间距对齐设计规范 `#165DFF` 等 |
| 数据 | `src/mock/data.ts` | 演示用 Mock，后续替换 API |

### 3.2 目录结构

```
Staff-Management/
├── docs/
│   └── PRD-智能找同事-管理后台-实现记录.md   # 本文档
├── src/
│   ├── components/          # 通用 UI（Button、StatusBadge、TagPill…）
│   ├── config/menu.ts       # 侧边栏与面包屑
│   ├── layouts/             # AdminLayout（顶栏+侧栏+内容区）
│   ├── mock/data.ts         # Mock 实体数据
│   ├── pages/               # 业务页面
│   ├── styles/              # 全局样式与设计变量
│   └── types/               # 领域类型定义
└── package.json
```

### 3.3 设计规范落地

| 设计项 | 规范值 | 实现位置 |
|--------|--------|----------|
| 主色 | `#165DFF` | `src/styles/variables.css` → `--color-primary` |
| 侧栏宽度 | 200px | `--sidebar-width` |
| 页面边距 | 24px | `--page-padding` |
| 状态标签 | 在职/休假/离职等配色 | `StatusBadge` 组件 |
| 表格斑马纹/悬停 | `#FAFBFF` / `#EEF2FF` | `EmployeeList.module.css` |
| 导入向导 | 3 步 | `EmployeeList` → `ImportModal` |

---

## 4. 信息架构与路由

与设计规范 **§1.1 菜单结构** 一致：

| 菜单 | 路由 | 组件 |
|------|------|------|
| 员工管理 | `/employee/list` | `EmployeeList` |
| 员工详情 | `/employee/detail/:id` | `EmployeeDetail` |
| 员工表单 | `/employee/form`、`/employee/form/:id` | `EmployeeForm` |
| 部门管理 | `/department/list` | `DepartmentList` |
| 岗位管理 | `/position/list` | `PositionList` |
| 项目列表 | `/project/list` | `ProjectList` |
| 值班日历 | `/duty/calendar` | `DutyCalendar` |
| 技能标签 | `/tag/skill` | `TagList(mode=skill)` |
| 兴趣标签 | `/tag/interest` | `TagList(mode=interest)` |
| 兴趣小组 | `/tag/group` | `TagList(mode=group)` |
| 操作日志 | `/system/log` | `SystemLog` |
| 数据导入导出 | `/system/import` | `SystemImport` |

默认入口：`/` → 重定向至 `/employee/list`。

---

## 5. 数据模型（前端类型）

与原始 PRD **§6.1 ER 概要** 对齐，TypeScript 定义见 `src/types/index.ts`：

- **Employee**：工号、姓名、手机/尾号、部门、岗位、技能、证书、荣誉、项目、兴趣、状态
- **Department**：树形 `parentId`、`leaderId`、HRBP、行政接口人
- **Position**：核心职责、KPI 数量
- **Project**：成员角色（负责人/核心/一般）、归档状态
- **DutyRecord**：日期、时段（白班/夜班/24小时）、值班人
- **SkillTag / InterestGroup**：标签去重与合并（UI 提示，逻辑待后端）

---

## 6. 核心交互实现说明

### 6.1 员工列表（Story 1 对齐）

- 关键词搜索：姓名、工号、手机、邮箱
- 筛选：部门、状态（可扩展岗位、技能标签）
- 批量操作栏：勾选后展示（接口待接）
- 导入弹窗：三步向导（上传 → 预览映射 → 结果）
- 分页：每页 20 条

### 6.2 员工详情（Story 3 对齐）

- Tab：基础信息 / 技能证书 / 项目经验 / 个人荣誉 / 兴趣爱好 / 操作日志
- 手机号脱敏展示
- 技能、兴趣以标签卡片呈现

### 6.3 部门管理（Story 2 部分对齐）

- 左侧组织树 + 右侧详情
- 选中态：蓝色左边框 + `#E8F0FF` 背景
- 删除约束：文案与设计一致（需先转移员工）

### 6.4 项目管理（Story 2 对齐）

- 状态筛选：进行中 / 已结束
- 卡片展示负责人、成员头像组

### 6.5 值班管理（Story 4 对齐）

- 周历视图按部门展示值班人
- 批量排班弹窗：部门、周期、模板上传

---

## 7. 组件清单

| 组件 | 文件 | 设计规范对应 |
|------|------|-------------|
| AdminLayout | `layouts/AdminLayout.tsx` | 全局布局 §2.1 |
| PageHeader | `components/PageHeader.tsx` | PageHeader |
| Button | `components/Button.tsx` | 主/默认/文字/危险按钮 §2.5 |
| StatusBadge | `components/StatusBadge.tsx` | 状态标签 §2.5 |
| TagPill | `components/TagPill.tsx` | TagPill |
| Card | `components/Card.tsx` | 卡片容器 |
| EmptyState | `components/EmptyState.tsx` | 员工列表空状态 §3.1.7 |
| ImportModal | `EmployeeList` 内嵌 | ImportWizard §3.1.6 |

---

## 8. 权限设计（预留）

按设计规范 **§六**，本期仅在前端预留角色概念，未接入 SSO：

| 角色 | 计划能力 |
|------|---------|
| 系统管理员 | 全模块增删改查、导入导出 |
| HR 数据管理员 | 员工/部门/岗位、不可删 |
| 部门数据负责人 | 本部门员工/项目/值班 |
| 普通查看者 | 只读 |

**Open Question（延续原 PRD §6.4）**：员工自助修改是否需审核、字段级权限矩阵 — 待产品确认后接 API。

---

## 9. 本地运行与 GitHub Pages

```bash
cd Staff-Management
npm install
npm run dev              # 本地开发 http://localhost:5173/
```

```bash
npm run build            # 生产构建（base=/Staff-Management/）
npm run preview:gh-pages # 预览 Pages 部署效果
```

**GitHub Pages**：推送 `main`/`master` 后由 `.github/workflows/deploy-github-pages.yml` 自动部署。  
站点地址：https://moyi5603.github.io/Staff-Management/  
需在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

---

## 10. 后续迭代计划

| 优先级 | 事项 | 说明 |
|--------|------|------|
| P0 | 后端 API + 数据库 | 按 ER 模型实现 CRUD、唯一性校验 |
| P0 | 认证与权限中间件 | 对接企业 SSO，实现角色矩阵 |
| P1 | Excel 真实解析 | 导入预览、冲突行、5 分钟/1000 条性能指标 |
| P1 | 员工审核流 | Story 3「待生效」队列 |
| P2 | App 端同步 API | 管理后台为主数据源 |
| P2 | 操作日志持久化 | 变更前后 diff |
| — | AI 查询层 | 本期 Non-Goal，见原 PRD §3 |

---

## 11. 验收检查清单（前端原型）

- [x] 5 大业务模块页面可访问
- [x] 设计色板与布局规范一致
- [x] 员工列表搜索、筛选、分页、导入向导 UI
- [x] 员工详情 6 Tab 结构完整
- [x] 部门树 + 详情联动
- [x] 项目卡片、值班日历、标签管理
- [ ] 与后端联调（未开始）
- [ ] 权限拦截（未开始）
- [ ] 性能指标实测（依赖后端）

---

## 12. 变更记录

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-05-22 | 1.0 | 初版：完成管理后台前端原型与本文档 |
