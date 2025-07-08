// frontend/stores/EleveStore.ts

import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';
import { EleveProfil } from '../types';

interface EleveState {
  profil: EleveProfil | null;
  isLoading: boolean;
  error: string;
}

export const useEleveStore = defineStore('eleve', {
  state: (): EleveState => ({
    profil: null,
    isLoading: false,
    error: '',
  }),
  getters: { },
  actions: {
    async fetchEleveProfilComplet() {
      this.isLoading = true;
      this.error = '';
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.error = 'Utilisateur non authentifié. Veuillez vous connecter.';
        this.isLoading = false;
        return;
      }
      try {
        // ⭐ URL CORRIGÉE POUR LA RÉCUPÉRATION DU PROFIL ⭐
        const response = await axios.get('http://localhost:3033/profil/eleve/profil', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        this.profil = response.data;
        console.log("Profil élève chargé avec succès:", this.profil);
      } catch (err: any) {
        console.error("Erreur lors de la récupération du profil élève:", err);
        this.error = err.response?.data?.message || 'Impossible de charger le profil de l\'élève.';
      } finally {
        this.isLoading = false;
      }
    },

    async updateEleveProfil(profilData: Partial<EleveProfil>): Promise<boolean> {
      this.isLoading = true;
      this.error = '';
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.error = 'Utilisateur non authentifié. Veuillez vous connecter.';
        this.isLoading = false;
        throw new Error('Non authentifié');
      }
      try {
        // ⭐ URL CORRIGÉE POUR LA MISE À JOUR DU PROFIL ⭐
        const response = await axios.put('http://localhost:3033/profil/eleve/profil', profilData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json',
          },
        });
        this.profil = response.data.profil;
        console.log("Profil élève mis à jour avec succès:", this.profil);
        return true;
      } catch (err: any) {
        console.error("Erreur lors de la mise à jour du profil élève:", err);
        this.error = err.response?.data?.message || 'Impossible de mettre à jour le profil.';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    clearEleveData() {
      this.profil = null;
      this.error = '';
      this.isLoading = false;
    }
  },
});