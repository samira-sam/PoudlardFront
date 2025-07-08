<template>
  <div class="maisons-page max-w-4xl mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-10">Nos élèves sont répartis en quatre maisons</h1>

    <div v-if="maisonStore.loading" class="text-center text-gray-500 text-lg">Chargement des maisons...</div>
    <div v-else-if="maisonStore.error" class="text-center text-red-600 text-lg">Erreur lors du chargement : {{ maisonStore.error.message }}</div>
    <div v-else>
      <div v-for="maison in maisonStore.allMaisons" :key="maison.id_maison" class="mb-12">
        <h2 class="text-2xl font-bold text-center mb-6">{{ maison.nom }}</h2>

        <div class="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          <div class="flex flex-col items-center text-center">
            <img
              v-if="maison.directeur?.photo"
              :src="maison.directeur.photo"
              :alt="`Photo du directeur ${maison.directeur.nom || ''}`"
              class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-gray-300"
            />
            <div
              v-else
              class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold border-4 border-gray-300"
            >
              {{ maison.directeur?.prenom?.charAt(0) || 'D' }}
            </div>
            <p v-if="maison.directeur" class="mt-2 text-md font-semibold text-gray-800">
              {{ maison.directeur.prenom }} {{ maison.directeur.nom }}
            </p>
            <p v-else class="mt-2 text-md font-semibold text-gray-800">Directeur inconnu</p>
          </div>

          <div class="flex flex-col items-center text-center">
            <img
              v-if="maison.photo"
              :src="maison.photo"
              :alt="`Photo de la maison ${maison.nom}`"
              class="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-gray-300"
            />
            <div
              v-else
              class="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-6xl font-bold border-4 border-gray-300"
            >
              {{ maison.nom.charAt(0) }}
            </div>
            <p class="mt-2 text-md font-semibold text-gray-800">{{ maison.nom }}</p>
          </div>

          <div class="flex flex-col items-center text-center">
            <img
              v-if="maison.prefet?.photo"
              :src="maison.prefet.photo"
              :alt="`Photo du préfet ${maison.prefet.nom || ''}`"
              class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-gray-300"
            />
            <div
              v-else
              class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold border-4 border-gray-300"
            >
              {{ maison.prefet?.prenom?.charAt(0) || 'P' }}
            </div>
            <p v-if="maison.prefet" class="mt-2 text-md font-semibold text-gray-800">
              {{ maison.prefet.prenom }} {{ maison.prefet.nom }}
            </p>
            <p v-else class="mt-2 text-md font-semibold text-gray-800">Préfet inconnu</p>
          </div>
        </div>

        <div class="w-full">
          <div class="histoire-section p-4 md:p-5 lg:pl-8 lg:pr-5 bg-gray-50 rounded-lg shadow-sm w-full mx-0 mr-auto">
            <h3 class="text-xl font-semibold mb-3">Histoire de {{ maison.nom }}</h3>
            <p class="text-gray-700 leading-relaxed text-left">
              {{ maison.histoire }}
            </p>
          </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useMaisonStore } from '@/stores/MaisonStore';

const maisonStore = useMaisonStore();

onMounted(async () => {
  await maisonStore.fetchAllMaisons();
});
</script>

<style scoped>
/*
  Maintenons cette règle au cas où, mais l'objectif est que les classes Tailwind
  sur le bloc histoire (mx-0 mr-auto) fassent le travail.
*/
.histoire-section p {
  text-align: left !important;
}
</style>