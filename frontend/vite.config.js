import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'   // 🔥 ADD THIS

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Lama Poc',
        short_name: 'PWA App',
        description: 'Lama portal poc',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'lama192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'lama512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
  ],

  // ✅ ADD THIS BLOCK
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  server: {
    host: true,
    port: 5173,
    hmr: {
      clientPort: 443
    },
    allowedHosts: [
      "whale-stunning-brightly.ngrok-free.app",
      "cdn.ngrok.com",
    ]
  }
})