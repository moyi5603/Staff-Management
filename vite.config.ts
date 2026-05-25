import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * 本地开发默认 `/`；GitHub Pages 构建时由 `npm run build` 注入 `/Staff-Management/`。
 * 勿直接运行裸 `vite`，请使用 `npm run dev`。
 */
const base = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
});
