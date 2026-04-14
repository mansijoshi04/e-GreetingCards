import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Read env vars from the project root (one level above frontend/).
  // All VITE_ prefixed vars in root .env.local are exposed to the browser.
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  return {
    plugins: [react(), tailwindcss()],
    envDir: path.resolve(__dirname, '..'),
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // HMR must point at the host machine so browsers can connect back.
      // VITE_HMR_HOST defaults to 'localhost' (direct npm run dev);
      // in Docker set it to the host IP or 'localhost' since ports are forwarded.
      hmr: {
        host: process.env.VITE_HMR_HOST ?? 'localhost',
        port: 3000,
      },
      // Polling is required when the source is on a Windows NTFS volume
      // mounted into Docker via WSL2 — inotify events don't propagate.
      watch: {
        usePolling: true,
        interval: 300,
      },
      proxy: {
        '/api': {
          target: `http://${process.env.VITE_BACKEND_HOST ?? 'localhost'}:8000`,
          changeOrigin: true,
        },
      },
    },
  };
});
