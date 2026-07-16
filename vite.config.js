import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/512gb-or-1tb/',
  build: {
    outDir: 'dist'
  },
  test: {
    globals: true,
    environment: 'node'
  }
});
