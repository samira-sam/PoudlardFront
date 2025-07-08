/*import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5175, // Votre frontend tourne sur ce port
    // C'est la ligne CRUCIALE qui règle le problème de rafraîchissement
   
    proxy: {
      // Proxy pour les images uploadées depuis le backend
      '/uploads/images': {
        target: 'http://localhost:3033', // L'URL de votre serveur backend
        changeOrigin: true, // Nécessaire pour les requêtes inter-origines
        // Cette ligne n'est pas nécessaire car le chemin est déjà correct sur le backend
        // rewrite: (path) => path.replace(/^\/uploads\/images/, '/uploads/images'),
      },
      // Proxy pour vos requêtes API vers le backend
      // Si vos routes API commencent par /professeurs, /articles, etc., ajoutez-les ici.
      // Par exemple, si votre endpoint pour les professeurs est http://localhost:3033/professeurs
      '/professeurs': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      // Ajoutez d'autres routes API si nécessaire (ex: '/articles', '/matieres', '/utilisateurs')
      '/articles': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      '/matieres': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      '/utilisateurs': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
       '/maisons': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});*/


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
      // Ajout de la route /eleve (essentielle pour l'intranet élève)
      '/eleve': {
        target: 'http://localhost:3033',
        changeOrigin: true,
      },
      // Routes potentielles supplémentaires (à vérifier dans ton backend)
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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});