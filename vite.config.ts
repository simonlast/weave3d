import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/weave3d/' : '/',
  build: {
    outDir: 'docs'
  },
  root: '.',
  publicDir: 'public'
}))