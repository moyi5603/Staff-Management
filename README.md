# 智能找同事 · 管理后台

基于 [PRD](docs/PRD-智能找同事-管理后台-实现记录.md) 与设计规范实现的企业员工数据管理后台（前端原型）。

## 功能模块

- **企业管理**：部门、员工、岗位
- **项目管理**：项目列表（Tab 筛选、新增/编辑/详情/删除、启动与结束、成员管理）
- **值班管理**：周历视图、批量排班
- **标签中心**：证书管理、技能标签、兴趣标签

## 快速开始

```bash
npm install
npm run dev          # http://localhost:5173/（请用此命令，勿直接运行 vite）
# App 端资料页原型：http://localhost:5173/app/profile
npm run build        # 产出 dist/，用于 GitHub Pages
npm run preview:gh-pages   # 本地预览 GitHub Pages 构建结果
```

## GitHub Pages 部署

仓库已配置 [GitHub Actions](.github/workflows/deploy-github-pages.yml)，推送到 `main` 或 `master` 分支后自动构建并发布。

**首次启用（在 GitHub 仓库设置中）：**

1. **Settings → Pages → Build and deployment**
2. **Source** 选择 **GitHub Actions**
3. 推送代码后，在 **Actions** 页查看 `Deploy to GitHub Pages` 工作流

**访问地址：** https://moyi5603.github.io/Staff-Management/

若仓库名不是 `Staff-Management`，请同步修改 `vite.config.ts` 中的 `base` 路径（须为 `/仓库名/` 格式）。

本地模拟 Pages 路径预览：

```bash
npm run preview:gh-pages
# 打开 http://localhost:4173/Staff-Management/
```

## 文档

- 实现记录 PRD：[docs/PRD-智能找同事-管理后台-实现记录.md](docs/PRD-智能找同事-管理后台-实现记录.md)

## Cursor Agent Skill

本仓库提供项目级 Skill，供 Cursor Agent 在改动本仓库时自动加载（无需每次手动点名）：

- **路径**：[`.cursor/skills/staff-management/SKILL.md`](.cursor/skills/staff-management/SKILL.md)
- **覆盖**：技术约定、路由与文件对照、部门/员工等产品硬约束、实现检查清单、`npm run build` 验证要求

在 Agent 对话中直接描述任务即可（例如「给部门列表加搜索」）；涉及员工、部门、`src/pages/`、Mock 数据等时，Agent 会根据 Skill 的 `description` 自动选用。

若已安装 [Superpowers](https://github.com/obra/superpowers) 插件并配置 `~/.cursor/hooks.json` 的 `sessionStart` hook，会话还会注入通用流程 Skill（如 brainstorm、调试、完成前验证）。个人环境可参考 Superpowers 文档配置。

## 技术栈

React 19 · TypeScript · Vite · React Router · CSS Modules
