// eslint-disable-next-line no-restricted-imports
import z from 'zod';

const pt = z.locales.pt();

z.config({
  ...pt,
  customError: issue => {
    if (!issue.input) {
      return 'Campo obrigatório';
    }

    if (issue.code === 'too_small') {
      if (issue.minimum === 1) {
        return 'Campo obrigatório';
      }
      return `Mínimo de ${issue.minimum} caracteres`;
    }

    if (issue.code === 'too_big') {
      return `Máximo de ${issue.maximum} caracteres`;
    }

    if (issue.format === 'email' && issue.code === 'invalid_format') {
      return 'E-mail inválido';
    }

    return 'Campo inválido';
  },
});

export default z;

export const password = z
  .string()
  .trim()
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos 1 letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos 1 letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos 1 número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos 1 caractere especial');

export const file = z.object({
  uri: z.string(),
  name: z.string(),
  type: z.string(),
});
