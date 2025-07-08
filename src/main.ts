/*import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/index.css' // <-- Import du fichier CSS avec les directives Tailwind

// Importe ton store d'authentification
import { useAuthStore } from './stores/auth' // ⭐ Assure-toi que ce chemin est correct : './stores/auth' ⭐

import Menu from './components/Menu.vue'

// Crée l'instance de ton application Vue
const app = createApp(App)

// Enregistre le composant globalement
app.component('Menu', Menu)

// Utilise Pinia pour la gestion de l'état
app.use(createPinia()) // Pinia - Ta façon originale d'utiliser Pinia

// ⭐ CONFIGURATION ASYNCHRONE POUR L'AUTHENTIFICATION ⭐
// Nous devons effectuer le chargement asynchrone de l'utilisateur avant que le routeur ne s'initialise complètement.
// Nous allons exécuter cette fonction asynchrone immédiatement.
;(async () => {
  // Récupère l'instance du store d'authentification *après* que Pinia ait été installé sur l'application
  const authStore = useAuthStore()
  await authStore.loadUserFromToken() // Attend le chargement des données utilisateur

  // Une fois que la configuration asynchrone de l'authentification est terminée,
  // nous pouvons procéder avec le reste de la configuration de l'application, comme c'était avant.

  // Utilise Vue Router pour la navigation
  app.use(router) // Vue Router - Cette ligne était déjà là dans ton code d'origine

  // Monte l'application sur le DOM
  app.mount('#app') // Cette ligne était aussi déjà là
})()*/

/*
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/index.css' // <-- Import du fichier CSS avec les directives Tailwind

// Importe ton store d'authentification
import { useAuthStore } from './stores/auth' // ⭐ Assure-toi que ce chemin est correct : './stores/auth' ⭐

import Menu from './components/Menu.vue'

// Crée l'instance de ton application Vue
const app = createApp(App)

// Enregistre le composant globalement
app.component('Menu', Menu)

// Utilise Pinia pour la gestion de l'état
app.use(createPinia()) // Pinia - Ta façon originale d'utiliser Pinia

// ⭐ CONFIGURATION ASYNCHRONE POUR L'AUTHENTIFICATION ⭐
// Nous devons effectuer le chargement asynchrone de l'utilisateur avant que le routeur ne s'initialise complètement.
// Nous allons exécuter cette fonction asynchrone immédiatement.
;(async () => {
  // Récupère l'instance du store d'authentification *après* que Pinia ait été installé sur l'application
  const authStore = useAuthStore()
  await authStore.loadUserFromToken() // Attend le chargement des données utilisateur

  // Une fois que la configuration asynchrone de l'authentification est terminée,
  // nous pouvons procéder avec le reste de la configuration de l'application, comme c'était avant.

  // Utilise Vue Router pour la navigation
  app.use(router) // Vue Router - Cette ligne était déjà là dans ton code d'origine

  // Monte l'application sur le DOM
  app.mount('#app') // Cette ligne était aussi déjà là
})() // L'IIFE (Immediately Invoked Function Expression) se termine ici*/



import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/index.css' // Tailwind CSS
import axios from 'axios'

// Store d'authentification
import { useAuthStore } from './stores/auth'
import Menu from './components/Menu.vue'

const app = createApp(App)

// Composant global
app.component('Menu', Menu)

// State manager
app.use(createPinia())

// 🔒 INTERCEPTEUR GLOBAL AXIOS POUR GÉRER LES ERREURS 401/403
axios.interceptors.response.use(
  response => response,
  error => {
    const authStore = useAuthStore()

    // Vérifie si la requête concernait le login (ou adapte le chemin selon ton API)
    const isLoginRoute = error.config?.url?.includes('/login')

    if (!isLoginRoute && error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('⚠️ Accès non autorisé détecté, déconnexion automatique.')
      authStore.logout()

      // Redirection vers la page login
      window.location.href = '/login' 
      // Si tu préfères router.push('/login'), il faudra importer router et utiliser ça à la place
    }

    return Promise.reject(error)
  }
)

;(async () => {
  // 🔄 Rechargement du token utilisateur depuis le localStorage
  const authStore = useAuthStore()
  await authStore.loadUserFromToken()

  // ✅ Injecte le token dans Axios si présent
  if (authStore.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
  }

  // Lancement de l'app une fois que l'auth est prête
  app.use(router)
  app.mount('#app')
})()
