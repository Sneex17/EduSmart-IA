import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/n8n': {
        target: 'https://raises-andrew-industries-cure.trycloudflare.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n8n/, ''),
      },
    },
  },
})
