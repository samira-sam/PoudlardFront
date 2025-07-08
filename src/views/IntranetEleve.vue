<template>
  <div class="min-h-screen bg-gray-100 py-10 px-6 sm:px-10 max-w-4xl mx-auto bg-white">
    <h1 class="text-3xl font-bold text-center text-black mb-8" aria-label="Intranet Élève">Mon Intranet Élève</h1>

    <div v-if="eleveStore.isLoading" role="status" class="text-center text-gray-700 font-semibold text-lg py-10">
      Chargement du profil...
    </div>
    <div v-else-if="eleveStore.error" role="alert" class="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
      <strong class="font-bold">Erreur :</strong>
      <span class="block sm:inline">{{ eleveStore.error }}</span>
    </div>

    <div v-else-if="eleveStore.profil" class="space-y-16">
      <div class="flex flex-col items-center">
        <div class="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
          <img
            :src="eleveStore.profil.photo || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=PHOTO'"
            :alt="`Photo de profil de ${eleveStore.profil.prenom} ${eleveStore.profil.nom}`"
            class="w-full h-full object-cover"
          />
        </div>
        <h2 class="text-2xl font-semibold text-black">{{ eleveStore.profil.nom }} {{ eleveStore.profil.prenom }}</h2>
        <p class="text-gray-600">{{ eleveStore.profil.annee }} - {{ eleveStore.profil.maison }}</p>
        <p class="text-gray-600">Contact Parent : {{ eleveStore.profil.contact_parent || 'Non renseigné' }}</p>

        <button
          @click="modifierProfil"
          class="mt-4 px-6 py-2 rounded-lg font-semibold transition duration-300 bg-gradient-to-r from-purple-900 to-purple-900 text-white"
          aria-label="Modifier les informations de mon profil"
        >
          Modifier mon profil
        </button>
      </div>

      <div v-if="eleveStore.profil.matieres && eleveStore.profil.matieres.length > 0" class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden border-collapse">
          <caption>Tableau récapitulatif des notes et moyennes par matière de l'élève.</caption>
          <thead class="bg-gray-100">
            <tr>
              <th scope="col" class="py-3 px-4 text-left text-sm font-semibold text-black border-r border-gray-300">Matière</th>
              <th scope="col" class="py-3 px-4 text-left text-sm font-semibold text-black border-r border-gray-300">Professeur</th>
              <th scope="col" class="py-3 px-4 text-left text-sm font-semibold text-black border-r border-gray-300">Notes</th>
              <th scope="col" class="py-3 px-4 text-left text-sm font-semibold text-black border-r border-gray-300">Moyenne</th>
              <th scope="col" class="py-3 px-4 text-left text-sm font-semibold text-black">Commentaires</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="matiere in eleveStore.profil.matieres" :key="matiere.id_matiere" class="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
              <td class="py-3 px-4 text-black border-r border-gray-200">{{ matiere.nom }}</td>
              <td class="py-3 px-4 text-black border-r border-gray-200">{{ matiere.professeur }}</td>
              <td class="py-3 px-4 text-black border-r border-gray-200">
                <span v-if="matiere.notes_individuelles && matiere.notes_individuelles.length > 0">
                  {{ matiere.notes_individuelles.map(note => note.valeur).join(', ') }}
                </span>
                <span v-else class="text-gray-500">Aucune note</span>
              </td>
              <td class="py-3 px-4 text-black font-medium border-r border-gray-200">{{ matiere.moyenne }}</td>
              <td class="py-3 px-4 text-black">
                <span v-if="matiere.notes_individuelles && matiere.notes_individuelles.length > 0">
                  <template v-for="(note, index) in matiere.notes_individuelles" :key="index">
                    <span v-if="note.commentaire && note.commentaire.trim().length > 0">
                      {{ note.commentaire }}
                    </span>
                    <br v-if="index < matiere.notes_individuelles.length - 1"/>
                  </template>
                </span>
                <span v-else class="text-gray-500">Aucun commentaire</span>
              </td>
            </tr>
            <tr class="bg-gray-100 font-bold border-t border-gray-300">
              <td class="py-3 px-4 text-black border-r border-gray-300" colspan="4">Moyenne Générale :</td>
              <td class="py-3 px-4 text-black border-r-0">{{ eleveStore.profil.moyenne_generale }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-600 py-6">
        Aucune matière ou note disponible pour le moment.
      </div>

      <div class="flex justify-start">
        <button
          @click="handleLogout"
          class="px-6 py-2 rounded-lg font-semibold transition duration-300 bg-red-600 text-white"
          aria-label="Se déconnecter de l'intranet"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useEleveStore } from '../stores/EleveStore';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const eleveStore = useEleveStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  if (authStore.token) {
    eleveStore.fetchEleveProfilComplet();
  } else {
    eleveStore.error = "Veuillez vous connecter pour voir votre profil.";
  }
});

const modifierProfil = () => {
  console.log("Bouton 'Modifier mon profil' cliqué ! Redirection vers la page de modification...");
  router.push({ name: 'editEleveProfil' });
};

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'Connexion' });
};
</script>
