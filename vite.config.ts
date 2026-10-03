import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: fileURLToPath(new URL('./src/css/quasar.variables.scss', import.meta.url))
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/catalog-svc': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/artist-of-the-day': {
        target: 'http://localhost:8080/catalog-svc',
        changeOrigin: true
      },
      '/tracks': {
        target: 'http://localhost:8080/catalog-svc',
        changeOrigin: true
      },
      '/users': {
        target: 'http://localhost:8080/catalog-svc',
        changeOrigin: true
      }
    }
  }
})
