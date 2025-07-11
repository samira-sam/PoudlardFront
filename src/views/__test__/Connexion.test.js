// src/components/__tests__/Connexion.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/vue';
import Connexion from '../Connexion.vue';
import { useAuthStore } from '../../stores/auth';
import { createTestingPinia } from '@pinia/testing';

// Mock global de useRouter pour tous les tests
const mockPush = vi.fn();
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
  };
});

describe('Connexion.vue', () => {
  let authStore;

  const renderComponent = () => {
    const rendered = render(Connexion, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
        stubs: {
          // Stub RouterLink pour qu'il ne tente pas une vraie navigation JSDOM
          // Il se comporte comme un simple span (ou div) cliquable, ce qui suffit
          // pour tester que notre mockPush est appelé.
          RouterLink: {
            props: ['to'],
            template: `<span @click="onClick" style="cursor: pointer;"><slot /></span>`,
            methods: {
              onClick() {
                mockPush(this.to);
              }
            }
          },
        },
      },
    });
    authStore = useAuthStore();
    authStore.$reset();
    authStore.login.mockReset();
    mockPush.mockClear(); // S'assurer que mockPush est clair pour chaque test
    return rendered;
  };

  beforeEach(() => {
    // La réinitialisation est dans renderComponent
  });

  it('affiche le formulaire de connexion et les liens de navigation', () => {
    renderComponent();

    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email :/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe :/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();

    expect(screen.getByText(/Mot de passe oublié\s*\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Créer votre compte ici/i)).toBeInTheDocument();
  });

  it('met à jour les champs de saisie', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/Email :/i);
    const passwordInput = screen.getByLabelText(/Mot de passe :/i);

    await fireEvent.update(emailInput, 'test@example.com');
    await fireEvent.update(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('affiche les erreurs de validation pour les champs vides', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/Email :/i);
    const passwordInput = screen.getByLabelText(/Mot de passe :/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    // Rendre les champs "touchés" et "sales" pour que VeeValidate déclenche la validation
    // quand on essaie de soumettre un formulaire vide
    await fireEvent.blur(emailInput);
    await fireEvent.blur(passwordInput);
    
    await fireEvent.click(submitButton);

    // DEBUG : Affiche le DOM ici pour voir les messages d'erreur s'ils apparaissent
    // screen.debug(); 

    await waitFor(() => {
      expect(screen.getByText("L'adresse email est requise.")).toBeInTheDocument();
      expect(screen.getByText("Le mot de passe doit contenir au moins 8 caractères.")).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(authStore.login).not.toHaveBeenCalled();
  });

  it('affiche une erreur de validation pour un email invalide', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/Email :/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    await fireEvent.update(emailInput, 'email-invalide');
    await fireEvent.blur(emailInput); // S'assurer que le champ est validé au blur

    await fireEvent.click(submitButton);

    // DEBUG : Affiche le DOM ici
    // screen.debug();

    await waitFor(() => {
      expect(screen.getByText("Veuillez entrer une adresse email valide.")).toBeInTheDocument();
    }, { timeout: 2000 });
    expect(authStore.login).not.toHaveBeenCalled();
  });

  it('appelle la méthode de connexion du store avec les bonnes informations et affiche un message de succès', async () => {
    renderComponent();
    authStore.login.mockResolvedValueOnce(); // Simule un succès de connexion
    authStore.message = 'Connexion réussie !'; // Configure le message de succès

    const emailInput = screen.getByLabelText(/Email :/i);
    const passwordInput = screen.getByLabelText(/Mot de passe :/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    await fireEvent.update(emailInput, 'user@example.com');
    await fireEvent.blur(emailInput); // Force la validation du champ
    await fireEvent.update(passwordInput, 'mysecretpassword');
    await fireEvent.blur(passwordInput); // Force la validation du champ

    await fireEvent.click(submitButton);

    // Attendre que la méthode login soit appelée
    await waitFor(() => {
      expect(authStore.login).toHaveBeenCalledTimes(1);
      expect(authStore.login).toHaveBeenCalledWith('user@example.com', 'mysecretpassword');
    });

    // Attendre que le message de succès et l'état du bouton soient mis à jour
    await waitFor(() => {
      expect(submitButton).not.toHaveTextContent('Connexion...');
      expect(submitButton).toHaveTextContent('Se connecter');
      expect(screen.getByText('Connexion réussie !')).toBeInTheDocument();
    });

    // Attendre la réinitialisation du formulaire
    await waitFor(() => {
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });

  it('affiche un message d\'erreur en cas d\'échec de connexion et réinitialise le formulaire', async () => {
    renderComponent();
    const apiErrorMessage = 'Identifiants incorrects.';
    authStore.login.mockRejectedValueOnce(new Error(apiErrorMessage)); // Simule un échec de connexion
    authStore.error = apiErrorMessage; // Configure le message d'erreur

    const emailInput = screen.getByLabelText(/Email :/i);
    const passwordInput = screen.getByLabelText(/Mot de passe :/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    await fireEvent.update(emailInput, 'wrong@example.com');
    await fireEvent.blur(emailInput);
    await fireEvent.update(passwordInput, 'wrongpassword');
    await fireEvent.blur(passwordInput);

    await fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(apiErrorMessage)).toBeInTheDocument();
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(submitButton).not.toHaveTextContent('Connexion...');
      expect(submitButton).toHaveTextContent('Se connecter');
    });

    await waitFor(() => { // Attendre la réinitialisation du formulaire
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });

  it('désactive le bouton de soumission pendant la connexion', async () => {
    renderComponent();
    // mockImplementationOnce pour simuler une promesse longue
    authStore.login.mockImplementationOnce(() => {
      return new Promise(resolve => setTimeout(resolve, 100)); // Simule un délai de 100ms
    });

    const emailInput = screen.getByLabelText(/Email :/i);
    const passwordInput = screen.getByLabelText(/Mot de passe :/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    await fireEvent.update(emailInput, 'user@example.com');
    await fireEvent.update(passwordInput, 'password');
    fireEvent.click(submitButton); // Ne pas await ici pour pouvoir tester l'état pendant le chargement

    // Le bouton doit être désactivé et son texte doit changer immédiatement
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Connexion...');
    });

    // Attendre la résolution de la promesse (fin de la connexion)
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Se connecter');
    });
  });

  it('le clic sur "Mot de passe oublié ?" navigue vers la bonne route', async () => {
    renderComponent();

    const forgotPasswordLink = screen.getByText(/Mot de passe oublié\s*\?/i);
    await fireEvent.click(forgotPasswordLink);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/mot-de-passe-oublie');
  });

  it('le clic sur "Pas encore inscrit ?" navigue vers la bonne route', async () => {
    renderComponent();

    const registerLink = screen.getByText(/Créer votre compte ici/i);
    await fireEvent.click(registerLink);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/inscription');
  });
});