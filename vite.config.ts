import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base works on GitHub Pages and local preview.
  base: './',
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 400,
      ignored: ['**/*.tmp', '**/*.~tmp', '**/~*', '**/*.pptx', '**/*.ppt'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
