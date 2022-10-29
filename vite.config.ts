import { defineConfig } from 'vite'
import path from 'path';
// import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        'background': path.resolve(__dirname, 'src/background.ts'),
        'options': path.resolve(__dirname, 'options.html'),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      }
    },
  }
})
