import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5175,
    proxy: {
      '/uploads/images': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      '/api/professeurs': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      '/articles': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      'api/matieres': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      '/utilisateurs': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      '/api/maisons': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      '/rentrees': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      '/concours': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      '/eleve': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      '/notes': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      'api/annee-etudes': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      '/roles': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts', // laisse ou supprime selon si tu as ce fichier
   
  },
});
