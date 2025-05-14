import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}, // Define a mock process.env
    'process.platform': '"darwin"', // or '"win32"' / '"linux"' if needed
  },
  optimizeDeps: {
    exclude: ['fsevents'] // Exclude fsevents from dependency optimization
  },
  build: {
    rollupOptions: {
      external: ['fsevents'] // Tell Rollup to treat fsevents as external
    }
  },
  resolve: {
    alias: {
      'fsevents': 'fake-fsevents.js', // 👈 Mock module
    },
  },
})
