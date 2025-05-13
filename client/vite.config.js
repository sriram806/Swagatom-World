import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1111', // Use https if the backend is HTTPS
        changeOrigin: true,
        secure: false, // Use false for self-signed certs in local dev
      },
    },
  },
  plugins: [react()],
});


