import { defineStore } from 'pinia';
import { ref } from 'vue';

// Définition du type pour un article
export interface Article {
  id_article: number;
  nom: string;
  prix: number;
  photo: string; // Le nom du fichier image (ex: 'balais.jpg')
}

export const useArticleStore = defineStore('article', () => {
  const allArticles = ref<Article[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchAllArticles = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Assure-toi que cette URL correspond bien à ton endpoint API backend pour les articles
      const response = await fetch('http://localhost:3033/articles');
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data: Article[] = await response.json();
      allArticles.value = data;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      } else {
        error.value = new Error('Une erreur inconnue est survenue.');
      }
      console.error('Erreur lors du chargement des articles:', error.value);
    } finally {
      loading.value = false;
    }
  };

  return {
    allArticles,
    loading,
    error,
    fetchAllArticles,
  };
});