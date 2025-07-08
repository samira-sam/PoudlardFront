<template>
  <div class="p-5 max-w-4xl mx-auto bg-white my-8">
    <h1 class="text-3xl font-bold text-center text-black mb-6">Intranet Professeur</h1>

    <div v-if="professeurStore.isLoading" class="text-center p-4 text-black mb-6">Chargement des données...</div>
    <div v-if="professeurStore.error" class="text-center p-4 text-black mb-6">{{ professeurStore.error }}</div>

    <div v-if="professeurStore.professeurProfil" class="mb-8">
      <h2 class="text-2xl font-semibold text-black mb-4 text-center">Mon Profil</h2>
      <div class="flex flex-col items-center p-6 bg-white">
        <img :src="professeurStore.professeurProfil.photo || 'https://via.placeholder.com/100'" alt="Photo de profil" class="w-24 h-24 rounded-full object-cover mb-4 border-2 border-purple-800" />
        <p class="text-lg text-black mb-1"><strong>Nom:</strong> {{ professeurStore.professeurProfil.nom }} {{ professeurStore.professeurProfil.prenom }}</p>
        <p class="text-lg text-black mb-1"><strong>Email:</strong> {{ professeurStore.professeurProfil.email }}</p>
        <p class="text-black text-center mb-1"><strong>Description:</strong> {{ professeurStore.professeurProfil.description || 'N/A' }}</p>
        <p class="text-black text-center mb-1"><strong>Fonction:</strong> {{ professeurStore.professeurProfil.fonction }}</p>
        <p class="text-black text-center mb-4"><strong>Matière Enseignée:</strong> {{ professeurStore.professeurProfil.matiere?.nom || 'N/A' }}</p>
        <button @click="openEditProfileModal" class="px-5 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900">Modifier Profil</button>
      </div>
    </div>


    <div class="mb-8">
      <h2 class="text-2xl font-semibold text-black mb-4 text-center">Mes Élèves</h2>
      <div v-if="professeurStore.elevesDuProfesseur.length === 0 && !professeurStore.isLoading" class="text-center text-black p-4 bg-white">
        <p>Aucun élève inscrit à votre matière pour le moment.</p>
      </div>
      <ul v-else class="space-y-4">
        <li v-for="eleve in professeurStore.elevesDuProfesseur" :key="eleve.id_eleve" class="flex items-center bg-white border border-gray-200 rounded-lg p-4">
          <img :src="eleve.photo || 'https://via.placeholder.com/50'" alt="Photo élève" class="w-12 h-12 rounded-full object-cover mr-4 border border-purple-800" />
          <div class="flex-grow">
            <p class="text-lg font-medium text-black">{{ eleve.nom }} {{ eleve.prenom }}</p>
            <p class="text-sm text-black">{{ eleve.email }}</p>
          </div>
          <button @click="openNoteModal(eleve.id_eleve)" class="px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900">Attribuer une note</button>
        </li>
      </ul>
    </div>

    <!-- Modale de note -->
    <div v-if="showNoteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg w-full max-w-md">
        <h3 class="text-xl font-bold text-black mb-6 text-center">Attribuer une note à {{ selectedEleve?.nom }} {{ selectedEleve?.prenom }}</h3>
        <form @submit.prevent="submitNote">
          <div class="mb-4">
            <label for="valeurNote" class="block text-black text-sm font-bold mb-2">Note (sur 20):</label>
            <input type="number" id="valeurNote" v-model.number="valeurNote" min="0" max="20" step="0.01" required
                   class="border rounded w-full py-2 px-3 text-black" />
          </div>
          <div class="mb-6">
            <label for="commentaireNote" class="block text-black text-sm font-bold mb-2">Commentaire:</label>
            <textarea id="commentaireNote" v-model="commentaireNote" rows="3"
                      class="border rounded w-full py-2 px-3 text-black"></textarea>
          </div>
          <div class="flex justify-end gap-x-4">
            <button type="submit" class="bg-purple-800 text-white px-5 py-2 rounded-md hover:bg-purple-900">Enregistrer la note</button>
            <button type="button" @click="closeNoteModal" class="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500">Annuler</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modale d'édition de profil -->
    <div v-if="showEditProfileModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg w-full max-w-md">
        <h3 class="text-xl font-bold text-black mb-6 text-center">Modifier Mon Profil</h3>
        <form @submit.prevent="submitEditProfile">
          <div class="mb-4">
            <label for="editNom" class="block text-black text-sm font-bold mb-2">Nom:</label>
            <input type="text" id="editNom" v-model="editProfileForm.nom" required class="border rounded w-full py-2 px-3 text-black" />
          </div>
          <div class="mb-4">
            <label for="editPrenom" class="block text-black text-sm font-bold mb-2">Prénom:</label>
            <input type="text" id="editPrenom" v-model="editProfileForm.prenom" required class="border rounded w-full py-2 px-3 text-black" />
          </div>
          <div class="mb-4">
            <label for="editEmail" class="block text-black text-sm font-bold mb-2">Email:</label>
            <input type="email" id="editEmail" v-model="editProfileForm.email" required class="border rounded w-full py-2 px-3 text-black" />
          </div>
          <div class="mb-4">
            <label for="editDescription" class="block text-black text-sm font-bold mb-2">Description:</label>
            <textarea id="editDescription" v-model="editProfileForm.description" rows="4"
                      class="border rounded w-full py-2 px-3 text-black"></textarea>
          </div>
          <div class="mb-6">
            <label for="editPhoto" class="block text-black text-sm font-bold mb-2">URL Photo:</label>
            <input type="text" id="editPhoto" v-model="editProfileForm.photo"
                   class="border rounded w-full py-2 px-3 text-black" />
          </div>
          <div class="flex justify-end gap-x-4">
            <button type="submit" class="bg-purple-800 text-white px-5 py-2 rounded-md hover:bg-purple-900">Enregistrer</button>
            <button type="button" @click="closeEditProfileModal" class="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500">Annuler</button>
          </div>
        </form>
      </div>
    </div>

    <button @click="handleLogout" class="block mx-auto mt-8 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600">Déconnexion</button>
  </div>
</template>






<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProfesseurStore } from '@/stores/ProfesseurStore';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

// Stores Pinia
const professeurStore = useProfesseurStore();
const authStore = useAuthStore();

// États locaux pour le formulaire de note et l'édition du profil
const eleveSelectionneId = ref<number | null>(null);
const valeurNote = ref<number | null>(null);
const commentaireNote = ref<string>('');
const showNoteModal = ref(false);

const showEditProfileModal = ref(false);
const editProfileForm = ref({
  nom: '',
  prenom: '',
  email: '',
  description: '',
  fonction: '',
  photo: '',
});

// Computed pour filtrer l'élève sélectionné
const selectedEleve = computed(() => {
  return professeurStore.elevesDuProfesseur.find(e => e.id_eleve === eleveSelectionneId.value);
});

// Fonctions pour la modale de note
const openNoteModal = (eleveId: number) => {
  eleveSelectionneId.value = eleveId;
  valeurNote.value = null;
  commentaireNote.value = '';
  showNoteModal.value = true;
};

const closeNoteModal = () => {
  showNoteModal.value = false;
  eleveSelectionneId.value = null;
};

const submitNote = async () => {
  if (eleveSelectionneId.value !== null && valeurNote.value !== null && professeurStore.professeurProfil?.matiere?.id_matiere) {
    const success = await professeurStore.attribuerNote({
      eleveId: eleveSelectionneId.value,
      matiereId: professeurStore.professeurProfil.matiere.id_matiere,
      valeur: valeurNote.value,
      commentaire: commentaireNote.value,
    });

    if (success) {
      alert('Note attribuée avec succès !');
      closeNoteModal();
    } else {
      alert(`Erreur lors de l'attribution de la note : ${professeurStore.error}`);
    }
  } else {
    alert('Veuillez remplir tous les champs nécessaires pour la note.');
  }
};

// Fonctions pour la modale d'édition de profil
const openEditProfileModal = () => {
  if (professeurStore.professeurProfil) {
    editProfileForm.value.nom = professeurStore.professeurProfil.nom || '';
    editProfileForm.value.prenom = professeurStore.professeurProfil.prenom || '';
    editProfileForm.value.email = professeurStore.professeurProfil.email || '';
    editProfileForm.value.description = professeurStore.professeurProfil.description || '';
    editProfileForm.value.fonction = professeurStore.professeurProfil.fonction || '';
    editProfileForm.value.photo = professeurStore.professeurProfil.photo || '';
    showEditProfileModal.value = true;
  }
};

const closeEditProfileModal = () => {
  showEditProfileModal.value = false;
};

const submitEditProfile = async () => {
  const updateData = {
    nom: editProfileForm.value.nom,
    prenom: editProfileForm.value.prenom,
    email: editProfileForm.value.email,
    description: editProfileForm.value.description,
    photo: editProfileForm.value.photo,
  };

  const success = await professeurStore.updateProfesseurProfile(updateData);

  if (success) {
    alert('Profil mis à jour avec succès !');
    closeEditProfileModal();
  } else {
    alert(`Erreur lors de la mise à jour du profil : ${professeurStore.error}`);
  }
};

// Chargement des données au montage du composant
onMounted(async () => {
  // Pas besoin de vérifier authStore.isProfesseur ici,
  // car le router.beforeEach a déjà garanti l'accès pour les professeurs.
  // On vérifie juste si le token existe, ce qui est implicitement vrai si on atteint cette page.
  if (authStore.token) {
    await professeurStore.fetchProfesseurProfile();
    await professeurStore.fetchElevesDuProfesseur();
  } else {
    // Cas de fallback peu probable si le routeur échoue, mais bonne pratique
    alert("Veuillez vous connecter pour accéder à l'intranet professeur.");
    router.push('/connexion');
  }
});

// Gérer la déconnexion
const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'Connexion' });
};
</script>

