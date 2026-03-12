import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../assets/terminal-widget',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `agent-terminal.js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `agent-[name].[ext]`
      }
    }
  }
})
