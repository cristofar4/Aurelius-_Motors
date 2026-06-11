import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1100,
    // CanvasStage is dynamically imported, so Rollup splits three.js into its
    // own lazy chunk on its own — manualChunks would hoist it into the entry.
  },
})
