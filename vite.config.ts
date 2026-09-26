import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vite config: React + Tailwind v4, "@/..." import alias, and a dev proxy
// that forwards /api calls to the FastAPI booking server on port 8000.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    proxy: { '/api': 'http://127.0.0.1:8000' },
  },
})
