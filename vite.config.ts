import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'
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
