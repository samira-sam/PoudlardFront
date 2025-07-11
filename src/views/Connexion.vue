<template>
  <div class="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
    <h2 class="text-xl font-bold mb-6 text-center text-purple-700">Connexion</h2>
    
    <form @submit.prevent="onSubmit">
      <!-- Email -->
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-semibold mb-2">Email :</label>
        <Field
          id="email"
          name="email"
          type="email"
          placeholder="Entrez votre email"
          class="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500 ring-red-500': errors.email }"
          aria-describedby="email-error"
        />
        <ErrorMessage name="email" class="text-red-600 text-sm mt-1" id="email-error" />
      </div>

      <!-- Mot de passe -->
      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">Mot de passe :</label>
        <Field
          id="password"
          name="password"
          type="password"
          placeholder="Entrez votre mot de passe"
          class="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-900"
          :class="{ 'border-red-500 ring-red-500': errors.password }"
          aria-describedby="password-error"
        />
        <ErrorMessage name="password" class="text-red-600 text-sm mt-1" id="password-error" />
      </div>

      <!-- Bouton -->
      <button 
        type="submit" 
        class="w-full bg-purple-900 text-white py-2 px-4 rounded-md hover:bg-purple-800 transition duration-300 ease-in-out font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        :disabled="loading"
      >
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>

      <div class="mt-4 text-center">
        <router-link
          to="/mot-de-passe-oublie"
          class="text-sm font-medium text-purple-700 hover:text-purple-900"
        >
          Mot de passe oublié ?
        </router-link>
      </div>

     <div class="mt-6 text-center">
  <router-link
    to="/inscription"
    class="inline-block px-6 py-2 border border-purple-900 rounded-md bg-purple-900 text-white font-semibold
          hover:bg-white hover:text-purple-900 transition-colors duration-300 ease-in-out"
  >
    <p>Pas encore inscrit ?<br>Créer votre compte ici</p>
  </router-link>
</div>
    </form>

    <p v-if="authStore.message" class="mt-4 text-green-600 text-center">{{ authStore.message }}</p>
    <p v-if="authStore.error" class="mt-4 text-red-600 text-center">{{ authStore.error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { z } from 'zod';
import { useForm, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const validationSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: "L'adresse email est requise." })
      .min(1, "L'adresse email est requise.")
      .email("Veuillez entrer une adresse email valide."),

    password: z
      .string({ required_error: "Le mot de passe est requis." })
      .min(2, "Le mot de passe doit contenir au moins 8 caractères.")
      //.regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule.")
      //.regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?\":{}|<>)."),
  })
);

const { handleSubmit, errors, resetForm } = useForm({ validationSchema,
    initialValues: {
    email: '',
    password: ''
  }
});

const loading = ref(false);

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  authStore.error = '';
  try {
    await authStore.login(values.email, values.password);
    resetForm(); // Réinitialise le formulaire après une connexion réussie
  } catch (error) {resetForm();
    console.error('Erreur lors de la connexion API:', error);
     // <-- on vide le formulaire en cas d'erreur
  } finally {
    loading.value = false;
  }
});


</script>

<style scoped>
</style>
