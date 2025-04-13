import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy API requests to bypass certificate issues
      '/api': {
        target: 'https://api-server.prd.gcp.csyeteam03.xyz',
        changeOrigin: true,
        secure: false, // Ignore certificate errors
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
