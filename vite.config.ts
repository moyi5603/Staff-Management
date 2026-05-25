import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * 本地开发默认 `/`；GitHub Pages 构建时 `npm run build` 在 vite 命令前注入 `/Staff-Management/`。
 * 注意：环境变量不能写在 `tsc && vite` 整条命令最前，否则只会作用于 tsc。
 */
const base = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
});
