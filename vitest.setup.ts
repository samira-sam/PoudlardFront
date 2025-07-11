/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';

import { configure } from 'vee-validate';

// Configure VeeValidate pour qu’il affiche les erreurs avec le label du champ
configure({
  generateMessage: (ctx) => {
    const messages: Record<string, string> = {
      required: `Le champ ${ctx.field} est requis.`,
      email: `Le champ ${ctx.field} doit être une adresse email valide.`,
      min: `Le champ ${ctx.field} est trop court.`,
    };

    return messages[ctx.rule?.name ?? 'required'] ?? `Le champ ${ctx.field} est invalide.`;
  },
  
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});
