import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // нужен пакет 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Прокси для API (чтобы избежать CORS при разработке)
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});