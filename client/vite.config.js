import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://swagatom-backend.onrender.com', // Use https if the backend is HTTPS
        changeOrigin: true,
        secure: true, // Use false for self-signed certs in local dev
      },
    },
  },
  plugins: [react()],
});


