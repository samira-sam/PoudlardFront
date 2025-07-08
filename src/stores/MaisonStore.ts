// src/stores/MaisonStore.ts

import { defineStore } from 'pinia';
import axios from 'axios';
import { Maison } from '@/types'; // Assure-toi que le chemin est correct pour tes interfaces

export const useMaisonStore = defineStore('maison', {
  state: () => ({
    allMaisons: [] as Maison[], // Tableau pour stocker toutes les maisons
    loading: false, // Indicateur de chargement
    error: null as Error | null, // Pour stocker les erreurs éventuelles
  }),

  actions: {
    /**
     * Récupère toutes les maisons depuis l'API backend.
     * C'est ici que tu appelles ton endpoint backend /maisons.
     * Pour que l'affichage fonctionne bien, ton API DOIT retourner les objets
     * 'directeur' et 'prefet' imbriqués dans chaque objet 'maison',
     * avec leurs 'nom', 'prenom' et 'photo'.
     */
    async fetchAllMaisons() {
      this.loading = true; // Débute le chargement
      this.error = null; // Réinitialise l'erreur précédente
      try {
        // Remplace 'http://localhost:3033/maisons' par l'URL exacte de ton API backend pour les maisons
        const response = await axios.get<Maison[]>('http://localhost:3033/api/maisons');
        this.allMaisons = response.data; // Stocke les données récupérées
        console.log('Données des maisons chargées:', this.allMaisons); // Pour le débogage
      } catch (err: any) {
        this.error = err; // En cas d'erreur, stocke l'erreur
        console.error('Erreur lors de la récupération de toutes les maisons:', err);
      } finally {
        this.loading = false; // Le chargement est terminé
      }
    },
  },
});