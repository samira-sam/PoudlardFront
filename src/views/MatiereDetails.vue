<template>
  <div class="max-w-3xl mx-auto p-4">
    <button
      @click="retourListe"
      class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      ← Retour à la liste
    </button>

    <div v-if="loading" class="text-center text-gray-500">Chargement de la matière...</div>
    <div v-else-if="error" class="text-center text-red-600">Erreur : {{ error }}</div>
    <div v-else-if="matiere" class="flex flex-col items-center">
      <div class="relative w-48 h-48 mb-6">
        <img
          v-if="matiere.photo"
          :src="photoUrl"
          :alt="'Photo de ' + matiere.nom"
          class="w-full h-full object-cover rounded-full border-4 border-blue-400 shadow-md"
        />
        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-6xl font-bold rounded-full border-4 border-blue-400 shadow-md">
          {{ matiere.nom.charAt(0) }}
        </div>
      </div>

      <h1 class="text-3xl font-bold mb-2 text-center">{{ matiere.nom }}</h1>
      <p class="text-lg text-gray-700 text-center leading-relaxed">{{ matiere.description || "Aucune description disponible." }}</p>

    </div>
    <div v-else class="text-center text-gray-500">Matière non trouvée.</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMatiereStore, type Matiere } from '@/stores/MatiereStore';

const route = useRoute();
const router = useRouter();
const store = useMatiereStore();

const matiere = ref<Pick<Matiere, 'id_matiere' | 'nom' | 'description' | 'photo'> | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const idMatiere = Number(route.params.id);

/*const BASE_IMAGE_URL = '/images/matieres/';

const photoUrl = computed(() => {
  return matiere.value && matiere.value.photo
    ? BASE_IMAGE_URL + matiere.value.photo
    : '';
});*/


const photoUrl = computed(() => {
  // Assure-toi que matiere.value.photo contient le chemin complet relatif, ex: "/uploads/images/image.jpg"
  return matiere.value && matiere.value.photo
    ? matiere.value.photo // <-- UTILISE DIRECTEMENT matiere.value.photo
    : '';
});
// ...

async function fetchDetail() {
  loading.value = true;
  error.value = null;
  try {
    matiere.value = await store.fetchMatiereById(idMatiere);
  } catch (err: any) {
    error.value = err.message || 'Erreur inconnue lors du chargement de la matière.';
  } finally {
    loading.value = false;
  }
}

function retourListe() {
  router.push('/matieres');
}

onMounted(() => {
  if (isNaN(idMatiere)) {
    error.value = "ID de matière invalide.";
    loading.value = false;
    return;
  }
  fetchDetail();
});
</script>

<style scoped>
/* Aucun style spécifique n'est nécessaire ici car Tailwind CSS gère le design. */
</style>