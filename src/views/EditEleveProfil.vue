<template>
  <div class="min-h-screen bg-gray-100 p-6 sm:p-10">
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-purple-700 mb-8">
        Modifier mon Profil Élève
      </h1>

      <div
        v-if="eleveStore.isLoading"
        class="text-center text-purple-500 font-semibold text-lg py-10"
      >
        Chargement des données du profil...
      </div>
      <div
        v-else-if="eleveStore.error"
        class="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8"
      >
        <strong class="font-bold">Erreur :</strong>
        <span class="block sm:inline">{{ eleveStore.error }}</span>
      </div>

      <form v-else @submit.prevent="submitForm" class="space-y-6">
        <div>
          <label for="nom" class="block text-sm font-medium text-gray-700"
            >Nom</label
          >
          <input
            type="text"
            id="nom"
            v-model="editableProfil.nom"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="prenom" class="block text-sm font-medium text-gray-700"
            >Prénom</label
          >
          <input
            type="text"
            id="prenom"
            v-model="editableProfil.prenom"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            for="contact_parent"
            class="block text-sm font-medium text-gray-700"
            >Contact Parent</label
          >
          <input
            type="text"
            id="contact_parent"
            v-model="editableProfil.contact_parent"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
        <div>
  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
  <input
    type="email"
    id="email"
    v-model="editableProfil.email"
    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
  />
</div>

        <div class="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            @click="cancelEdit"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="eleveStore.isLoading"
            class="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ eleveStore.isLoading ? "Enregistrement..." : "Enregistrer" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useEleveStore } from "../stores/EleveStore";
import { useRouter } from "vue-router";
import { EleveProfil } from "../types";

const eleveStore = useEleveStore();
const router = useRouter();

// ⭐ MODIFICATION ICI : Initialise editableProfil avec des chaînes vides pour nom et prenom, et null pour contact_parent ⭐
const editableProfil = ref< Pick<EleveProfil, "nom" | "prenom" | "contact_parent" | "email"> >({
  nom: '',
  prenom: '',
  contact_parent: null,
  email: '',
});


onMounted(async () => {
  // Si le profil n'est pas déjà chargé, tente de le charger
  if (!eleveStore.profil) {
    await eleveStore.fetchEleveProfilComplet();
  }
});

// ⭐ AJOUTE UN WATCHER ICI pour remplir le formulaire une fois le profil chargé ⭐
watch(
  () => eleveStore.profil,
  (newProfil) => {
    if (newProfil) {
      
      editableProfil.value = {
        nom: newProfil.nom,
        prenom: newProfil.prenom,
        contact_parent: newProfil.contact_parent,
        email: newProfil.email,
      };
    }
  },
  { immediate: true } // Exécute le watcher immédiatement au montage si eleveStore.profil est déjà là
);

// Gère la soumission du formulaire
const submitForm = async () => {
  console.log("Données envoyées :", editableProfil.value);
  try {
    // S'assure d'envoyer uniquement les champs pertinents pour le backend
    // `editableProfil.value` contient déjà les champs requis.
    await eleveStore.updateEleveProfil(editableProfil.value);
    console.log("Profil mis à jour avec succès (frontend) !");
    // Redirige après un court délai pour que l'utilisateur voie le message de succès potentiel
    setTimeout(() => {
      router.push({ name: "intranetEleve" }); // Redirige vers la page de profil
    }, 500); // Court délai
  } catch (error: any) {
    console.error("Erreur lors de la soumission de la mise à jour:", error);
    // L'erreur sera gérée par le `eleveStore.error` et affichée en haut de la page
  }
};

// Gère l'annulation de la modification
const cancelEdit = () => {
  router.push({ name: "intranetEleve" }); // Redirige simplement vers la page de profil
};
</script>

<style scoped>
/* Tu peux ajouter des styles spécifiques au composant ici */
</style>