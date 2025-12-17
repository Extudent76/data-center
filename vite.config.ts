import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/data-center/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mobx-vendor': ['mobx', 'mobx-react-lite'],
          'ui-vendor': ['@gravity-ui/uikit', '@gravity-ui/icons'],
          'charts-vendor': ['recharts'],
        },
      },
    },
  },
})
