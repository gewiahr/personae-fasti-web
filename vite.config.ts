import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    mkcert(),
    VitePWA({
      selfDestroying: true,
      registerType: 'prompt',
      includeAssets: [
        'icons/favicon-32.png',
        'icons/apple-touch-icon.png',
      ],
      manifest: {
        id: '/',
        name: 'StoryShard',
        short_name: 'StoryShard',
        description: 'StoryShard — хронологические заметки для настольных ролевых игр с персонажами, локациями, квестами и упоминаниями.',
        lang: 'ru',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#101828',
        theme_color: '#101828',
        categories: ['games', 'productivity'],
        icons: [
          {
            src: '/icons/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,woff2,otf}'],
        navigateFallback: '/index.html',
        runtimeCaching: [],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-redux'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      // '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/components/lib'),
      // '@types': path.resolve(__dirname, './src/types'),
      // '@styles': path.resolve(__dirname, './src/styles'),
      // '@reducers': path.resolve(__dirname, './src/reducers'),
      // '@layouts': path.resolve(__dirname, './src/layouts'),
      // '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
})
