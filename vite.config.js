import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@helpers': fileURLToPath(new URL('./src/helpers', import.meta.url)),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  base: '/', // Ajusta esto según la ruta base de tu servidor
   server: {
    
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080, // Especifica el puerto deseado aquí
    watch: {
        usePolling: true,
        interval: 100
    },
    build: {
        outDir: 'dist'
    }


  } 
})
