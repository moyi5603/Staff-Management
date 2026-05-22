# 智能找同事 · 管理后台

基于 [PRD](docs/PRD-智能找同事-管理后台-实现记录.md) 与设计规范实现的企业员工数据管理后台（前端原型）。

## 功能模块

- **企业管理**：部门、员工、岗位
- **项目管理**：项目列表与归档筛选
- **值班管理**：周历视图、批量排班
- **标签中心**：技能标签、兴趣标签、兴趣小组
- **系统设置**：操作日志、数据导入/导出

## 快速开始

```bash
npm install
npm run dev          # http://localhost:5173/
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

## 技术栈

React 19 · TypeScript · Vite · React Router · CSS Modules
