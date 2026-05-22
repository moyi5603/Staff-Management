import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** GitHub Pages 项目站路径，与仓库名一致；本地开发可通过 VITE_BASE_PATH=/ 覆盖 */
const base = process.env.VITE_BASE_PATH ?? '/Staff-Management/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
});
