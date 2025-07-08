<template>
  <div class="professeurs-page">
    <h1 class="title">Nos professeurs</h1>

    <div v-if="loading" class="text-gray-500 text-center">Chargement des professeurs...</div>
    <div v-else-if="error" class="text-red-500 text-center">Erreur lors du chargement : {{ error.message }}</div>
    <div v-else>
      <div v-if="directeur" class="bulle-container centre">
        <ProfesseurBulle
          :professeur="directeur"
          @click="allerAuDetail(directeur.id_professeur)"
        />
      </div>

      <div class="bulle-container centre" v-if="directeursAdjoints.length">
        <ProfesseurBulle
          v-for="prof in directeursAdjoints"
          :key="prof.id_professeur"
          :professeur="prof"
          @click="allerAuDetail(prof.id_professeur)"
        />
      </div>

      <div class="bulle-container grille">
        <ProfesseurBulle
          v-for="prof in autresProfesseurs"
          :key="prof.id_professeur"
          :professeur="prof"
          @click="allerAuDetail(prof.id_professeur)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
// Chemin d'importation pour ProfesseurBulle.vue
import ProfesseurBulle from '../components/ProfesseurBulle.vue';
// Chemin d'importation pour useProfesseurStore
import { useProfesseurStore } from '../stores/ProfesseurStore';

const router = useRouter();
const professeurStore = useProfesseurStore();

const loading = ref(true);
const error = ref<Error | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    await professeurStore.fetchAll(); // Lance la récupération des profs
  } catch (err: any) {
    console.error('Erreur lors de la récupération des professeurs :', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
});

// Utilisation des computed properties pour filtrer les professeurs du store
// IMPORTANT : On utilise professeurStore.allProfesseurs qui est le bon nom de l'état
const directeur = computed(() =>
  professeurStore.allProfesseurs.find((p) => p.fonction === 'directeur')
);
const directeursAdjoints = computed(() =>
  // ATTENTION : Vérifie si 'directeur_adjoint' ou 'directeur-adjoint' en BDD pour la fonction
  professeurStore.allProfesseurs.filter((p) => p.fonction === 'directeur_adjoint')
);
const autresProfesseurs = computed(() =>
  professeurStore.allProfesseurs.filter((p) => !p.fonction || p.fonction === 'professeur')
);

const allerAuDetail = (id: number) => {
  router.push(`/professeurs/${id}`);
};
</script>

<style scoped>
/* Ton CSS pour Professeur.vue */
.professeurs-page {
  max-width: 960px;
  margin: auto;
  padding: 1rem;
  text-align: center;
}

.title {
  margin-bottom: 2rem;
  font-weight: bold;
  font-size: 2rem;
}

.bulle-container.centre {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.bulle-container.grille {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
</style>