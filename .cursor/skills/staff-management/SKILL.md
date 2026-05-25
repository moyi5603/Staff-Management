---
name: staff-management
description: >-
  Implements and reviews the Staff-Management admin frontend (智能找同事管理后台):
  employee, department tree, position, project, duty, tags.
  Use when modifying this repo, src/pages/, src/mock/, src/types/, AdminLayout,
  menu routes, PRD docs, 员工管理, 部门管理, DepartmentList, EmployeeList, or React+Vite prototype work.
---

# Staff-Management 管理后台

前端原型仓库。完整范围见 [docs/PRD-智能找同事-管理后台-实现记录.md](../../docs/PRD-智能找同事-管理后台-实现记录.md)。

## 开始前

1. 读 PRD 实现记录中与本次改动相关的章节（路由 §4、数据模型 §5、交互 §6）。
2. 确认改动属于 **前端原型** 还是需接后端——本期默认 Mock，勿擅自接真实 API。
3. 大功能或改行为：先走 `brainstorming` skill，再实现。

## 技术约定（必须遵守）

| 项 | 约定 |
|----|------|
| 框架 | React 19 + TypeScript + Vite 6 |
| 路由 | React Router 7，路径与 `src/config/menu.ts`、`src/App.tsx` 一致 |
| 样式 | CSS Modules + `src/styles/variables.css` 设计 Token |
| 数据 | 演示数据在 `src/mock/data.ts`；类型在 `src/types/index.ts` |
| 布局 | 业务页放在 `AdminLayout` 内，复用 `PageHeader`、`Button`、`StatusBadge`、`TagPill`、`Card`、`EmptyState` |
| 主色 | `#165DFF` → `--color-primary` |
| 范围 | 最小 diff；不重构无关模块；不新增未请求依赖 |

## 产品硬约束（易错）

### 部门管理

- **不**单独维护「部门联系人」、HRBP、行政接口人等字段。
- **部门负责人**（`leaderId`）即对外联络与 AI 查询用的部门联系人；手机号/邮箱从员工档案关联。
- 详情展示：名称、上级、负责人、邮箱、简介、文化、职能、绩效指标（`kpis[]`）。
- 删除：需先转移员工（文案与 PRD 一致）。

### 员工

- 列表：关键词（姓名/工号/手机/邮箱）、部门/状态筛选、分页 20 条、导入三步向导 UI。
- 详情：顶部融合档案卡（摘要+基础信息）+ 4 Tab（证书/技能/参与项目/兴趣）；手机号脱敏。

### 未实现（勿假装完成）

- 后端 API、SSO、权限拦截、Excel 真实解析、性能指标实测 — 仅 UI/Mock，需在 PRD §10/§11 对齐说明。

## 路由与文件对照

| 模块 | 路由 | 主文件 |
|------|------|--------|
| 员工列表/详情/表单 | `/employee/*` | `pages/employee/` |
| 部门管理 | `/department/list` | `pages/department/DepartmentList.tsx`，树工具 `utils/departmentTree.ts` |
| 岗位 | `/position/list` | `pages/position/PositionList.tsx` |
| 项目 | `/project/list` | `pages/project/ProjectList.tsx` |
| 值班 | `/duty/calendar` | `pages/duty/DutyCalendar.tsx` |
| 证书/技能/兴趣标签 | `/certificate/list` `/tag/skill` `/tag/interest` | `pages/certificate/CertificateCatalogList.tsx`、`pages/tag/TagCatalogList.tsx` |

新增页面时：同步 `App.tsx` 路由 + `menu.ts` 菜单项。

## 实现检查清单

完成改动后逐项确认：

```
任务进度：
- [ ] 类型：实体变更已更新 src/types/index.ts
- [ ] Mock：src/mock/data.ts 与类型、页面展示一致
- [ ] 路由/菜单：App.tsx 与 menu.ts 已同步（若新增页面）
- [ ] 样式：使用 variables.css Token，未硬编码偏离设计规范的主色/间距
- [ ] 部门：未引入「部门联系人」独立字段；负责人语义正确
- [ ] 组件：优先复用 src/components/ 已有组件
- [ ] 构建：npm run build 通过
- [ ] 文档：行为或范围变化时更新 docs/PRD-智能找同事-管理后台-实现记录.md（§11 验收项或 §12 变更记录）
```

## 验证命令

```bash
npm run build
# 可选本地预览
npm run dev
```

声称完成前必须执行 `npm run build` 并确认无错误（配合 `verification-before-completion` skill）。

## 文档更新

下列情况更新 PRD 实现记录：

- 新增/删除页面或路由
- 数据模型字段变更
- 产品规则变更（如部门、导入、权限预留）

在 §12 变更记录追加一行：日期、版本号、简述。

## 附加资源

- 实现记录 PRD：`docs/PRD-智能找同事-管理后台-实现记录.md`
- 原始 PRD / 设计规范：同目录 `docs/` 下关联文档（若存在）
- README 部署说明：`README.md`
