import { defineStore } from 'pinia';
import axios from 'axios';
// ⭐ Import des interfaces nécessaires (assure-toi que Utilisateur inclut les champs pour le token de reset)
import { Utilisateur, Role } from '../types';
import router from '../router';

// ⭐ Ajout de isLoading et clearMessages pour une meilleure gestion de l'UI ⭐
interface AuthState {
  user: Utilisateur | null;
  token: string;
  error: string;
  message: string;
  isLoading: boolean; // Ajout pour gérer l'état de chargement des requêtes
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({ // Spécifier le type du state
    user: JSON.parse(localStorage.getItem('user') || 'null') as Utilisateur | null,
    token: localStorage.getItem('token') || '',
    error: '',
    message: '',
    isLoading: false, // Initialiser à false
  }),
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
    getUserRole: (state) => state.user?.role?.name || '',
    isAdmin: (state) => state.user?.role?.name === 'admin',
    isEleve: (state) => state.user?.role?.name === 'eleve',
    isProfesseur: (state) => state.user?.role?.name === 'professeur',
  },
  actions: {
    // Méthode utilitaire pour nettoyer les messages
    clearMessages() {
      this.error = '';
      this.message = '';
    },

    async login(email: string, mot_de_passe: string) {
      this.isLoading = true; // Début du chargement
      this.clearMessages(); // Nettoyer les messages avant la requête
      try {
        const response = await axios.post('http://localhost:3033/auth/login', { email, mot_de_passe }, { withCredentials: true });

        this.token = response.data.token;
        this.user = response.data.utilisateur as Utilisateur;

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        this.message = 'Connexion réussie !';
        setTimeout(() => { this.message = ''; }, 3000);

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        if (this.user && this.user.role) {
          switch (this.user.role.name) {
            case 'eleve':
              router.push('/intranet-eleve');
              break;
            case 'professeur':
              router.push('/intranet-professeur');
              break;
            case 'admin':
              window.location.href = 'http://localhost:3033/admin';
              break;
            default:
              router.push('/');
          }
        } else {
          router.push('/connexion');
        }

      } catch (err: any) {
        this.clearMessages(); // Nettoyer les messages d'avant
        this.error = err.response?.data?.error || 'Erreur lors de la connexion.';
        this.logout();
      } finally {
        this.isLoading = false; // Fin du chargement
      }
    },

    async register(data: { nom: string; prenom: string; email: string; mot_de_passe: string }) {
      this.isLoading = true; // Début du chargement
      this.clearMessages(); // Nettoyer les messages avant la requête
      try {
        await axios.post('http://localhost:3033/auth/register', data, { withCredentials: true });
        this.message = "Inscription réussie ! Un email d'activation vous sera envoyé prochainement.";
      } catch (err: any) {
        this.error = err.response?.data?.error || "Erreur lors de l'inscription.";
      } finally {
        this.isLoading = false; // Fin du chargement
      }
    },

    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.clearMessages(); // S'assurer que les messages sont nettoyés à la déconnexion
      delete axios.defaults.headers.common['Authorization'];
      router.push('/connexion');
    },

    async loadUserFromToken() {
      // Si un token est présent dans localStorage, et que user n'est pas encore défini
      // OU si le user est défini mais le token n'est pas là (incohérence à corriger)
      if (this.token && !this.user) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
          const response = await axios.get('http://localhost:3033/auth/me', { withCredentials: true });
          this.user = response.data as Utilisateur; // L'utilisateur est validé par l'API
          localStorage.setItem('user', JSON.stringify(this.user)); // Mettre à jour localStorage
          console.log("Utilisateur rechargé depuis le token:", this.user);
        } catch (err: any) {
          console.error("Erreur lors du rechargement de l'utilisateur depuis le token:", err);
          // Si le token est invalide ou expiré (status 401/403), déconnecter
          if (err.response?.status === 401 || err.response?.status === 403) {
            this.logout();
          }
        }
      } else if (!this.token && this.user) {
          // Cas où un user est en localStorage mais sans token, il faut nettoyer
          this.logout();
      } else if (!this.token && !this.user) {
          // Aucun token, aucun user : déjà en état déconnecté, rien à faire
          // S'assurer que user est bien null et localStorage est propre
          this.user = null;
          localStorage.removeItem('user');
      }
    },

    // --- ACTIONS POUR LE MOT DE PASSE OUBLIÉ (flux par e-mail) ---

    async requestPasswordReset(email: string): Promise<boolean> {
      this.isLoading = true;
      this.clearMessages();
      try {
        const response = await axios.post('http://localhost:3033/auth/request-password-reset', { email });
        // ⭐ MODIFICATION ICI : Le message vient du backend. Le frontend n'a pas le token. ⭐
        // Le backend renvoie déjà un message générique pour la sécurité (qu'il ait trouvé l'email ou non).
        this.message = response.data.message || 'La demande a été traitée.';
        return true; // Indique que la demande a été soumise au backend
      } catch (err: any) {
        // Le backend renvoie un message sécurisé (200 OK) même en cas d'email non trouvé.
        // Donc, la plupart des erreurs ici seraient des erreurs serveur 500.
        this.error = err.response?.data?.message || 'Erreur lors de la demande de réinitialisation.';
        console.error("Erreur requestPasswordReset:", err);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async resetPassword(token: string, newPassword: string): Promise<boolean> {
      this.isLoading = true;
      this.clearMessages();
      try {
        // Envoie le token dans l'URL (via la route) et le nouveau mot de passe dans le corps
        const response = await axios.post(`http://localhost:3033/auth/reset-password/${token}`, { newPassword });
        this.message = response.data.message || 'Votre mot de passe a été réinitialisé avec succès.';
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe.';
        console.error("Erreur resetPassword:", err);
        // Important : propager l'erreur pour que le composant puisse gérer la redirection
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  }
});
