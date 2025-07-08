<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-xl">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Réinitialiser le mot de passe
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Entrez votre nouveau mot de passe.
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="reset">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="new-password" class="sr-only">Nouveau mot de passe</label>
            <input
              id="new-password"
              name="new-password"
              type="password"
              autocomplete="new-password"
              required
              v-model="newPassword"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nouveau mot de passe"
            />
          </div>
          <div class="mt-4">
            <label for="confirm-password" class="sr-only">Confirmer le mot de passe</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autocomplete="new-password"
              required
              v-model="confirmPassword"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirmer le mot de passe"
            />
          </div>
        </div>

        <div v-if="passwordMismatch" class="text-red-500 text-sm text-center">
          Les mots de passe ne correspondent pas.
        </div>
        <div v-if="authStore.error" class="text-red-500 text-sm text-center">
          {{ authStore.error }}
        </div>
        <div v-if="authStore.message" class="text-green-500 text-sm text-center">
          {{ authStore.message }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading || passwordMismatch"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span v-if="authStore.isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Réinitialisation en cours...
            </span>
            <span v-else>
              Réinitialiser le mot de passe
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Assurez-vous que le chemin est correct

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const newPassword = ref('');
const confirmPassword = ref('');

// Récupérer le token depuis les paramètres de l'URL
const token = computed(() => route.params.token as string);

const passwordMismatch = computed(() => {
  return newPassword.value !== confirmPassword.value && confirmPassword.value !== '';
});

const reset = async () => {
  if (newPassword.value !== confirmPassword.value) {
    authStore.error = 'Les mots de passe ne correspondent pas.';
    return;
  }

  if (!token.value) {
    authStore.error = 'Token de réinitialisation manquant dans l\'URL.';
    return;
  }

  try {
    const success = await authStore.resetPassword(token.value, newPassword.value);
    if (success) {
      // Optionnel: Rediriger l'utilisateur vers la page de connexion après un court délai
      setTimeout(() => {
        router.push('/connexion');
      }, 3000);
    }
  } catch (error) {
    // L'erreur est déjà gérée par le store, mais on peut ajouter une logique ici si besoin
    console.error("Erreur lors de la réinitialisation du mot de passe dans le composant:", error);
  }
};
</script>

<style scoped>
/* Styles Tailwind CSS sont généralement suffisants */
</style>