// vitest.config.js ou vite.config.js
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue'; // Importe le plugin Vue

export default defineConfig({
  plugins: [vue()], // Ajoute le plugin Vue ici
  test: {
    environment: 'jsdom',
    globals: true, // Pour ne pas avoir à importer describe, it, expect
    setupFiles: ['./vitest.setup.js'], // Si tu utilises ce fichier de setup
  },
  // Si tu as des alias comme '@' pour 'src', assure-toi de les configurer ici aussi
  resolve: {
    alias: {
      '@': '/home/mimi/Bureau/poudlard-front-main/src', // Mets le chemin absolu de ton dossier `src`
    },
  },
});