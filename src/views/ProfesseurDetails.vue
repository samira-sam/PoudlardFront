<template>
  <div class="max-w-xl mx-auto px-4 py-12 text-center">
    <button @click="goBack"
            class="bg-purple-700 text-white py-2 px-4 rounded-lg mb-6 cursor-pointer
                   hover:bg-purple-800 transition duration-300 ease-in-out">
      ← Retour à la liste
    </button>

    <div v-if="loading" class="text-gray-500 text-lg">Chargement...</div>
    <div v-else-if="error" class="text-red-500 text-lg">Erreur : {{ error }}</div>
    <div v-else-if="!professeur" class="text-gray-500 text-lg">Professeur non trouvé.</div>
    <div v-else>
      <div class="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-gray-300 mb-6">
        <img :src="profileImageUrl" :alt="`Photo de ${professeur.utilisateur?.prenom} ${professeur.utilisateur?.nom}`"
             class="w-full h-full object-cover" />
      </div>
      <h2 class="text-3xl font-bold mb-2 text-gray-900">{{ professeur.utilisateur?.prenom }} {{ professeur.utilisateur?.nom }}</h2>
      <p class="text-xl text-gray-700 mb-4">{{ professeur.matiereEnseignee?.nom }}</p>
      <p class="text-lg text-gray-800 leading-relaxed">{{ professeur.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { Professeur } from '../types';

const route = useRoute();
const router = useRouter();

const professeur = ref<Professeur | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// **LIGNE À SUPPRIMER OU COMMENTER :** Vous n'avez plus besoin de ce chemin de base.
// const BASE_IMAGE_URL = '/images/professeurs/';

const profileImageUrl = computed(() => {
  if (professeur.value && professeur.value.utilisateur && professeur.value.utilisateur.photo) {
    // **MODIFICATION CLÉ :** Utilisez directement le chemin de la BDD.
    // Il est déjà `/uploads/images/NOM_UNIQUE_DU_FICHIER.webp` et est accessible via votre serveur backend.
    return professeur.value.utilisateur.photo;
  }
  // Fallback vers l'image par défaut si aucune photo n'est disponible
  // Assurez-vous que cette image est dans le dossier `public` de votre FRONTEND
  return '/images/default_profile.png'; 
});

onMounted(async () => {
  const id = route.params.id;
  loading.value = true;
  error.value = null;
  try {
    /*const { data } = await axios.get<Professeur>(`http://localhost:3033/professeurs/${id}`);*/

    const { data } = await axios.get<Professeur>(`http://localhost:3033/api/professeurs/${id}`);
    professeur.value = data;

    console.log('Professeur chargé dans ProfesseurDetail:', professeur.value);
    console.log('Nom de la photo depuis l\'API:', professeur.value?.utilisateur?.photo);
    console.log('URL de l\'image générée:', profileImageUrl.value);

  } catch (err: any) {
    console.error('Erreur lors de la récupération du professeur:', err);
    error.value = err.response?.data?.message || err.message || 'Erreur inconnue';
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  router.back();
};
</script>

<style scoped>
/* Pas de changements ici */
</style>