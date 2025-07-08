<template>
  <div class="p-4 md:p-8 lg:px-12 xl:px-20 2xl:px-32 text-center">
    <h1 class="mb-8 font-extrabold text-3xl text-left"> Matières par année d'études
    </h1>

    <div v-if="loading" class="text-gray-500 text-left">Chargement des matières...</div>
    <div v-else-if="error" class="text-red-600 text-left">Erreur : {{ error.message }}</div>
    <div v-else>
      <div v-if="Object.keys(matieresFiltreesParGroupe).length > 0 && Object.values(matieresFiltreesParGroupe).some(arr => arr.length > 0)">
        <section
          v-for="groupe in groupesAnnees"
          :key="groupe.titre"
          class="mb-12"
        >
          <h2 class="font-semibold text-xl mb-4 text-left">
            {{ groupe.titre }}
          </h2>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <MatiereBulle
              v-for="matiere in matieresFiltreesParGroupe[groupe.titre]"
              :key="matiere.id_matiere"
              :matiere="matiere"
              @click="allerAuDetail(matiere.id_matiere)"
            />
          </div>
        </section>
      </div>
      <div v-else class="text-left">
        Aucune matière disponible ou associée à ces années.
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// ... (le script reste exactement le même que la version précédente) ...
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMatiereStore, type Matiere, type AnneeEtudeRelation } from "@/stores/MatiereStore";
import MatiereBulle from "../components/MatiereBulle.vue";

const router = useRouter();
const store = useMatiereStore();

const loading = computed(() => store.loading);
const error = computed(() => store.error);

const groupesAnnees = ref([
  { titre: "1ère et 2ème année d'études", annees: [1, 2] },
  { titre: "3ème et 4ème année d'études", annees: [3, 4] },
  { titre: "5ème et 6ème année d'études", annees: [5, 6] },
  { titre: "7ème année d'études", annees: [ 7] },
]);

onMounted(() => {
  store.fetchMatieres();
});

const matieresFiltreesParGroupe = computed<Record<string, Matiere[]>>(() => {
  if (store.loading || store.error || !Array.isArray(store.matieres)) {
    return {};
  }

  const result: Record<string, Matiere[]> = {};
  groupesAnnees.value.forEach(groupe => {
    const filtered = store.matieres.filter((matiere: Matiere) => {
      if (matiere.anneesEtude && Array.isArray(matiere.anneesEtude)) {
        return matiere.anneesEtude.some((a: AnneeEtudeRelation) => groupe.annees.includes(a.id_annee_etude));
      }
      return false;
    });
    result[groupe.titre] = filtered;
  });
  return result;
});

function allerAuDetail(idMatiere: number) {
  router.push(`/matieres/${idMatiere}`);
}
</script>

<style scoped>
/* Tes styles spécifiques à ce composant ici */
</style>