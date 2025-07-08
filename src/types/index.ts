
/*// frontend/src/types/index.ts

// --- Interfaces Générales (à conserver si utilisées ailleurs dans l'application) ---

// Interface pour la structure de l'objet rôle reçu du backend
export interface Role {
  id_role: number;
  name: string; // Le nom du rôle (ex: "eleve", "professeur", "admin")
}

// Interface principale pour un utilisateur dans l'application
export interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  photo?: string | null; // Peut être null
  role?: Role;
}

// Interface pour les informations d'une matière (générique, non spécifique au profil élève)
export interface Matiere {
  id_matiere: number;
  nom: string;
  description: string;
  photo?: string | null; // Peut être null
}

// Interface pour une Maison
export interface Maison {
  id: number;
  nom: string;
  histoire?: string; // Rendue optionnelle si elle n'est pas toujours renvoyée
  embleme?: string; // Rendue optionnelle si elle n'est pas toujours renvoyée
  couleurs?: string; // Rendue optionnelle si elle n'est pas toujours renvoyée
  photo?: string | null; // Peut être null
}

// Interface pour une Année d'Étude
export interface AnneeEtude {
  id: number;
  nom: string;
  description?: string; // Rendue optionnelle
}

// Interface pour les données spécifiques d'un professeur
export interface Professeur {
  id_professeur: number;
  description?: string | null; // Peut être null
  id_matiere?: number | null; // Peut être null
  fonction: 'professeur' | 'directeur' | 'directeur_adjoint';
  utilisateur?: Utilisateur; // L'objet Utilisateur complet lié à ce professeur
  matiereEnseignee?: Matiere; // La matière enseignée par le professeur (si jointe)
}

// --- Interfaces Spécifiques au Profil Élève (basées sur le JSON de la route /eleve/profil) ---

// Interface pour une note individuelle telle qu'elle est retournée dans le JSON du profil
export interface NoteIndividuelle {
  valeur: number; // Numéro après parseFloat
  date: string;   // Format 'YYYY-MM-DD'
  commentaire: string | null; // Peut être null
}

// Interface pour les détails d'une matière dans le tableau 'matieres' du profil élève
export interface MatiereProfil {
  id_matiere: number;
  libelle: string; // Le nom de la matière (vient de 'nom' dans le backend)
  professeur: string; // Nom et prénom du professeur (combinés)
  moyenne: string; // La moyenne formatée en chaîne (ex: "12.50" ou "N/A")
  notes_individuelles: NoteIndividuelle[]; // Tableau des notes pour cette matière
  commentaires: string[]; // Tableau de commentaires (actuellement vide dans le JSON de test, mais peut évoluer)
}

// Interface principale pour le profil complet de l'élève
// Elle reflète exactement la structure du JSON retourné par votre service EleveProfilService
export interface EleveProfil {
  nom: string;
  prenom: string;
  photo: string | null;
  contact_parent: string | null;
  annee: string | null; // Nom de l'année d'étude
  maison: string | null; // Nom de la maison
  matieres: MatiereProfil[];
  moyenne_generale: string | null;  // Tableau des matières avec leurs détails spécifiques au profil
}
*/

// frontend/src/types/index.ts

// --- Interfaces Générales (à conserver si utilisées ailleurs dans l'application) ---

// Interface pour la structure de l'objet rôle reçu du backend
export interface Role {
  id_role: number;
  name: string; // Le nom du rôle (ex: "eleve", "professeur", "admin")
}

// Interface principale pour un utilisateur dans l'application
export interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  photo?: string | null; // Peut être null
  role?: Role;
}

// Interface pour les informations d'une matière (générique, non spécifique au profil élève)
export interface Matiere {
  id_matiere: number;
  nom: string; // Changé de 'nom' à 'libelle' pour correspondre au backend
  description?: string; // Rendue optionnelle
  photo?: string | null; // Peut être null
}

// Interface pour une Maison
export interface Maison {
  id: number;
  nom: string;
  histoire?: string; // Rendue optionnelle si elle n'est pas toujours renvoyée
  embleme?: string; // Rendue optionnelle si elle n'est pas toujours renvoyée
  couleurs?: string; // Rendue optionnelle si elle n'est pas toujours renvoyée
  photo?: string | null; // Peut être null
}

// Interface pour une Année d'Étude
export interface AnneeEtude {
  id: number;
  nom: string;
  description?: string; // Rendue optionnelle
}

// Interface pour les données spécifiques d'un professeur
export interface Professeur {
  id_professeur: number;
  description?: string | null; // Peut être null
  fonction: 'professeur' | 'directeur' | 'directeur_adjoint';
  utilisateur?: Utilisateur; // L'objet Utilisateur complet lié à ce professeur
  matiereEnseignee?: Matiere; // La matière enseignée par le professeur (si jointe)
}

// --- Interfaces Spécifiques au Profil Élève (basées sur le JSON de la route /eleve/profil) ---

// Interface pour une note individuelle telle qu'elle est retournée dans le JSON du profil
export interface NoteIndividuelle {
  valeur: number; // Numéro après parseFloat
  date: string;   // Format 'YYYY-MM-DD'
  commentaire: string | null; // Peut être null
}

// Interface pour les détails d'une matière dans le tableau 'matieres' du profil élève
export interface MatiereProfil {
  id_matiere: number;
  nom: string; // Le nom de la matière (vient de 'nom' dans le backend)
  professeur: string; // Nom et prénom du professeur (combinés)
  moyenne: string; // La moyenne formatée en chaîne (ex: "12.50" ou "N/A")
  notes_individuelles: NoteIndividuelle[]; // Tableau des notes pour cette matière
  commentaires: string[]; // Tableau de commentaires (actuellement vide dans le JSON de test, mais peut évoluer)
}

// Interface principale pour le profil complet de l'élève
// Elle reflète exactement la structure du JSON retourné par votre service EleveProfilService
export interface EleveProfil {
  nom: string;
  prenom: string;
  photo: string | null;
  contact_parent: string | null;
  annee: string | null; // Nom de l'année d'étude
  maison: string | null; // Nom de la maison
  matieres: MatiereProfil[];
  moyenne_generale: string | null;  // Tableau des matières avec leurs détails spécifiques au profil
  commentaires: string[]; 
  email: string;
}

// --- Interfaces Spécifiques au Professeur (pour le ProfesseurStore) ---

// Interface pour un élève tel que le professeur le voit (liste des élèves)
export interface ElevePourProfesseur {
  id_eleve: number;
  nom: string;
  prenom: string;
  email: string;
  photo?: string | null;
  // Tu pourrais ajouter ici la moyenne de l'élève pour la matière du prof si tu la calcules côté backend
}

// Interface pour les données de notation d'un élève
export interface NoteData {
  eleveId: number;
  matiereId: number; // L'ID de la matière enseignée par le prof
  valeur: number;
  commentaire: string;
}

// Interface pour le profil complet du professeur (tel que retourné par l'API)
export interface ProfesseurProfil {
  id_professeur: number;
  description?: string | null;
  fonction: 'professeur' | 'directeur' | 'directeur_adjoint';
  nom: string; // Ajout du nom
  prenom: string; // Ajout du prénom
  email: string; // Ajout de l'email
  photo?: string | null; // Ajout de la photo
  matiere: Matiere; // La matière enseignée par le professeur
}