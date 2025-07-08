// /home/mimi/Poudlard-frontend/src/stores/MatiereStore.ts

import { defineStore } from 'pinia';
import axios from 'axios';

// Interfaces exportées (assure-toi qu'elles sont bien exportées)
export interface AnneeEtudeRelation {
  id_annee_etude: number;
  id_matiere: number;
}

// L'interface Matiere peut toujours avoir anneesEtude, mais fetchMatiereById ne la remplira pas.
// C'est ok, car le composant MatiereDetails ne l'utilisera pas.
export interface Matiere {
  id_matiere: number;
  nom: string;
  description: string;
  photo: string | null;
  anneesEtude?: AnneeEtudeRelation[]; // Rends-la optionnelle ici si tu le souhaites
}

export const useMatiereStore = defineStore('matiere', {
  state: () => ({
    matieres: [] as Matiere[], // Ces matières sont celles du store combinées par fetchMatieres()
    loading: false,
    error: null as Error | null,
  }),

  actions: {
    // Cette méthode reste inchangée et continue de combiner les données pour la liste
    async fetchMatieres() {
      this.loading = true;
      this.error = null;
      try {
        const matieresResponse = await axios.get('http://localhost:3033/api/matieres');
        let matieresData: Matiere[] = matieresResponse.data;

        const relationsResponse = await axios.get('http://localhost:3033/api/annees-etudes-matieres');
        const relationsData: AnneeEtudeRelation[] = relationsResponse.data;

        this.matieres = matieresData.map(matiere => {
          const anneesLiees = relationsData.filter(relation =>
            relation.id_matiere === matiere.id_matiere
          );
          return {
            ...matiere,
            anneesEtude: anneesLiees
          };
        });

      } catch (err: any) {
        console.error("Erreur lors de la récupération ou de la combinaison des données :", err);
        this.error = err;
        this.matieres = [];
      } finally {
        this.loading = false;
      }
    },

    // Cette méthode ne doit plus combiner les données si MatiereDetails n'a pas besoin des années
    async fetchMatiereById(id: number): Promise<Matiere> {
      this.loading = true; // Géré globalement par le store
      this.error = null;
      try {
        // Appelle simplement l'API pour la matière seule
        const response = await axios.get(`http://localhost:3033/api/matieres/${id}`);
        return response.data; // Renvoie les données brutes de la matière
      } catch (err: any) {
        console.error(`Erreur lors de la récupération de la matière ${id}:`, err);
        this.error = err;
        throw err; // Rejette pour gestion dans le composant
      } finally {
        this.loading = false;
      }
    }
  },
});