<template>
  <div
    class="flex flex-col items-center justify-center p-0 cursor-pointer text-center h-full"
    @click="$emit('click')"
  >
    <img :src="profileImageUrl" :alt="'Photo de ' + professeur.utilisateur.nom"
         class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full object-cover mb-2 border-4 border-gray-300 transform transition-transform duration-200 hover:scale-105" />

    <h3 class="text-lg font-semibold text-gray-800 mb-1">
      {{ professeur.utilisateur.nom }} {{ professeur.utilisateur.prenom }}
    </h3>

    <p v-if="professeur.fonction" class="text-sm text-gray-600 mb-1">
      {{ professeur.fonction }}
    </p>

    <p v-if="professeur.matiereEnseignee" class="text-sm text-gray-700">
      {{ professeur.matiereEnseignee.nom }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  professeur: {
    type: Object, // Idéalement, utilisez une interface Professeur ici si elle est définie globalement
    required: true,
  },
});

// **LIGNE À SUPPRIMER OU COMMENTER :** Plus besoin de ce chemin de base.
// const BASE_IMAGE_URL = '/images/professeurs/';

// Computed property pour construire l'URL complète de l'image
const profileImageUrl = computed(() => {
  if (props.professeur.utilisateur && props.professeur.utilisateur.photo) {
    // **MODIFICATION CLÉ :** Utilisez directement le chemin de la BDD.
    // Supprimez `new URL(..., import.meta.url)` car ce n'est pas un asset local du frontend.
    return props.professeur.utilisateur.photo;
  }
  // Retourne l'image par défaut si aucune photo n'est disponible
  // Assurez-vous que cette image est dans le dossier `public` de votre FRONTEND
  return '/images/default_profile.png';
});
</script>