import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from './stores/auth';

// Importe la nouvelle vue de modification de profil élève
import EditEleveProfilView from './views/EditEleveProfil.vue';
// IMPORTE LA VUE POUR L'INTRANET PROFESSEUR
import IntranetProfesseur from './views/IntranetProfesseur.vue';
// IMPORTE LA VUE POUR L'INTRANET ÉLÈVE
import IntranetEleve from './views/IntranetEleve.vue'; // S'assurer que IntranetEleve est bien importé
// Importe les nouveaux composants mot de passe oublié
import ForgotPassword from '@/views/ForgotPassword.vue';
import ResetPassword from '@/views/ResetPassword.vue';

// Importation des autres composants avec lazy loading
const Home = () => import('./views/Accueil.vue');
const Matiere = () => import('./views/Matiere.vue');
const MatiereBulle = () => import('./components/MatiereBulle.vue');
const MatiereDetails = () => import('./views/MatiereDetails.vue');
const Maison = () => import('./views/Maison.vue');
const Professeur = () => import('./views/Professeur.vue');
const ProfesseurBulle = () => import('./components/ProfesseurBulle.vue');
const ProfesseurDetails = () => import('./views/ProfesseurDetails.vue');
const Boutique = () => import('./views/Boutique.vue');
const Connexion = () => import('./views/Connexion.vue');
const Inscription = () => import('./views/Inscription.vue');
const Intranet = () => import('./views/Intranet.vue'); // Gardé si tu en as besoin, sinon à supprimer


// Enum pour la clarté des rôles
enum UserRole {
  ELEVE = 'eleve',
  PROFESSEUR = 'professeur',
  ADMIN = 'admin',
}

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home, meta: { public: true } },
  { path: '/matieres', name: 'Matiere', component: Matiere, meta: { public: true } },
  { path: '/matiere/:id', name: 'MatiereBulle', component: MatiereBulle, meta: { public: true } },
  { path: '/matieres/:id', name: 'MatiereDetails', component: MatiereDetails, meta: { public: true } },
  { path: '/maisons', name: 'Maison', component: Maison, meta: { public: true } },
  { path: '/professeurs', name: 'Professeur', component: Professeur, meta: { public: true } },
  { path: '/professeur/:id', name: 'ProfesseurBulle', component: ProfesseurBulle, meta: { public: true } },
  { path: '/boutique', name: 'Boutique', component: Boutique, meta: { public: true } },
  { path: '/connexion', name: 'Connexion', component: Connexion, meta: { public: true } },
  { path: '/inscription', name: 'Inscription', component: Inscription, meta: { public: true } },
  { path: '/intranet', name: 'IntranetGeneral', component: Intranet, meta: { requiresAuth: true } }, // Renommée pour éviter confusion
  { path: '/professeurs/:id', name: 'ProfesseurDetails', component: ProfesseurDetails, props: true, meta: { public: true } },

  // Route pour l'Intranet Élève
  {
    path: '/intranet-eleve',
    name: 'intranetEleve',
    component: IntranetEleve,
    meta: { requiresAuth: true, roles: [UserRole.ELEVE] }, // Utilise 'roles' pour la vérification dans beforeEach
  },
  // Route pour la modification du profil élève
  {
    path: '/intranet-eleve/modifier',
    name: 'editEleveProfil',
    component: EditEleveProfilView,
    meta: {
      requiresAuth: true,
      roles: [UserRole.ELEVE]
    }
  },

  // ROUTE POUR L'INTRANET PROFESSEUR
  {
    path: '/intranet-professeur',
    name: 'intranetProfesseur',
    component: IntranetProfesseur,
    meta: { requiresAuth: true, roles: [UserRole.PROFESSEUR] },
  },
// --- NOUVELLES ROUTES ---
    {
      path: '/mot-de-passe-oublie',
      name: 'forgot-password',
      component: ForgotPassword,
    },
    {
      path: '/reinitialiser-mot-de-passe/:token', // :token est un paramètre dynamique
      name: 'reset-password',
      component: ResetPassword,
      props: true, // Permet de passer le token comme prop si tu le souhaites (non utilisé directement ici car on lit via useRoute)
    },
   
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// GARDE DE NAVIGATION GLOBALE (AVEC LA VÉRIFICATION DES RÔLES)
router.beforeEach(async (to, from, next) => { // ⭐ Ajout de 'async' ici
  const authStore = useAuthStore();

  // Étape 1 : Gérer le chargement initial de l'utilisateur si le token existe
  // Cela est crucial pour que authStore.user soit rempli AVANT les vérifications de rôle
  if (authStore.token && !authStore.user) {
    console.log("Token trouvé mais utilisateur non chargé. Tentative de chargement...");
    try {
      await authStore.loadUserFromToken(); // Attendre que l'utilisateur soit chargé
      console.log("Utilisateur chargé avec succès dans la garde:", authStore.user);
    } catch (error) {
      console.error("Échec du chargement de l'utilisateur depuis le token dans la garde:", error);
      // Si le chargement échoue (token invalide, erreur réseau), déconnecte et redirige
      authStore.logout();
      next({ name: 'Connexion' });
      return; // Empêche l'exécution du reste de la garde
    }
  }

  // Étape 2 : Vérification de l'accès basée sur l'authentification et les rôles
  // Maintenant, authStore.user est supposé être à jour si un token existait
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role?.name; // Accède au rôle après le potentiel chargement

  // Si la route est publique (pas de protection), on laisse passer immédiatement
  if (to.meta.public) {
    next();
    return;
  }

  // Si la route nécessite une authentification ET que l'utilisateur n'est PAS authentifié
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.warn(`Accès refusé: Authentification requise pour la route '${to.path}'.`);
    alert("Vous devez être connecté pour accéder à cette page."); // Message pour l'utilisateur
    next({ name: 'Connexion' });
    return;
  }

  // Si la route nécessite un rôle spécifique ET que l'utilisateur EST authentifié
  const requiredRoles = to.meta.roles as UserRole[] | undefined;
  if (to.meta.requiresAuth && requiredRoles && requiredRoles.length > 0) {
    if (!userRole || !requiredRoles.includes(userRole as UserRole)) {
      console.warn(`Accès refusé: Rôle "${userRole || 'non défini'}" insuffisant pour la route '${to.path}'. Rôles requis: "${requiredRoles.join(', ')}".`);
      alert("Accès non autorisé. Vous n'avez pas les droits nécessaires."); // Message pour l'utilisateur
      next({ name: 'Home' }); // Redirige vers la page d'accueil ou une page 403
      return;
    }
  }

  // Étape 3 : Redirection des utilisateurs déjà connectés depuis les pages de connexion/inscription
  if ((to.name === 'Connexion' || to.name === 'Inscription') && isAuthenticated) {
    switch (userRole) {
      case UserRole.ELEVE:
        next({ name: 'intranetEleve' });
        break;
      case UserRole.PROFESSEUR:
        next({ name: 'intranetProfesseur' });
        break;
      case UserRole.ADMIN:
        // next({ name: 'intranetAdmin' }); // Décommenter si l'intranet admin est prêt
        next({ name: 'Home' }); // Par défaut pour admin si pas encore de route
        break;
      default:
        next({ name: 'Home' }); // Rôle non reconnu ou par défaut
    }
    return;
  }

  // Si toutes les vérifications sont passées, on laisse passer
  next();
});

export default router;