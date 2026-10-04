import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});

/* vite proxy configuration: an immediately layer that receives requests from the client and forwards them to the backend server.
Any request start with /api will be forwarded to http://localhost:8080
vite proxy mainly use when developing locally, because the frontend and backend are running on different ports. In production,
the frontend and backend are served from the same origin, so no proxy is needed.
Ngnix reverse proxy can be used in production to forward requests to the backend server.
user request send to the domain will be handled by the proxy and forwarded to the backend server.
like: http://yourdomain.com/api/* to http://localhost:8080/api/* */
