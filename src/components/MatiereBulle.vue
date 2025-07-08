<template>
  <div
    class="cursor-pointer p-0 flex flex-col items-center justify-center text-center"
    @click="$emit('click')"
  >
    <img
      v-if="matiere.photo"
      :src="photoUrl" :alt="'Photo de ' + matiere.nom"
      class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-3 rounded-full object-cover border-4 border-gray-300 transform transition-transform duration-200 hover:scale-105"
    />
    <div
      v-else
      class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-3 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-6xl font-bold border-4 border-gray-300 transform transition-transform duration-200 hover:scale-105"
    >
      {{ matiere.nom.charAt(0) }}
    </div>

    <h3 class="text-lg font-semibold text-gray-800">
      {{ matiere.nom }}
    </h3>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import type { Matiere } from "@/stores/MatiereStore"; // Assure-toi que cette interface est correcte

const props = defineProps({
  matiere: {
    type: Object as () => Matiere,
    required: true,
  },
});

const emit = defineEmits(['click']);

// **SUPPRIME OU COMMENTE CETTE LIGNE :**
// const BASE_IMAGE_URL = '/images/matieres/'; // Plus besoin de préfixe pour les images du backend

const photoUrl = computed(() => {
  if (props.matiere.photo) {
    // **MODIFICATION CLÉ ICI :**
    // Utilise directement le chemin fourni par la base de données (qui est `/uploads/images/...')
    // Plus besoin de `new URL(..., import.meta.url)` car ce n'est pas un asset géré par Vite.
    // Si ton frontend et ton backend étaient sur des domaines/ports différents,
    // tu préfixerais avec l'URL complète de ton backend (ex: `http://localhost:3033${props.matiere.photo}`).
    // Mais puisque Vite proxyfie, le chemin relatif suffit.
    return props.matiere.photo;
  }
  // Pas d'image par défaut ici, car ton template gère déjà le cas `v-else`
  // en affichant la première lettre.
  return ''; // Retourne une chaîne vide si matiere.photo est null/undefined
});
</script>

<style scoped>
/* Tes styles spécifiques à ce composant ici.
   Avec les classes Tailwind ci-dessus, tu ne devrais normalement pas avoir besoin de styles personnalisés. */
</style>

---

### Étapes pour l'Implémentation :

1.  **Remplace le contenu de ton fichier `MatiereBulle.vue`** par le code corrigé ci-dessus.
2.  **Enregistre les modifications.**
3.  **Assure-toi que ton serveur backend est toujours en cours d'exécution.**
4.  **Redémarre impérativement ton serveur de développement frontend (Vite)** (par exemple, `npm run dev` ou `yarn dev`).
5.  **Videz le cache de ton navigateur** (Ctrl+F5 ou Cmd+Shift+R) et accède à la page où tes matières sont affichées.

Si tu as d'autres composants qui affichent des images de matières (par exemple, une page de détails pour une matière spécifique), tu devras appliquer le même principe : supprimer le `BASE_IMAGE_URL` et utiliser directement le chemin `matiere.photo`.

Avec ces changements, tes images de matières devraient maintenant s'afficher correctement ! Dis-moi si ça fonctionne.