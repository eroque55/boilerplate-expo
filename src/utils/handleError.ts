import { isAxiosError } from 'axios';

import { TProblemDetails } from '@/types/api';

const DEFAULT_MESSAGE = 'Houve um imprevisto, tente novamente mais tarde';

const getProblemDetails = (
  error: unknown,
): Partial<TProblemDetails> | undefined => {
  if (!isAxiosError(error)) {
    return undefined;
  }

  const data: unknown = error.response?.data;

  return data && typeof data === 'object' ? data : undefined;
};

const getApiMessage = (error: unknown) => {
  if (!isAxiosError(error)) {
    return undefined;
  }

  const data: unknown = error.response?.data;

  if (typeof data === 'string' && data) {
    return data;
  }

  const detail = getProblemDetails(error)?.detail;

  return typeof detail === 'string' && detail ? detail : undefined;
};

export const handleError = (error: unknown): string => {
  if (__DEV__) {
    console.error(error);
  }

  if (typeof error === 'string' && error) {
    return error;
  }

  if (isAxiosError(error)) {
    return getApiMessage(error) ?? DEFAULT_MESSAGE;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return DEFAULT_MESSAGE;
};

export const getFieldErrors = (error: unknown): Record<string, string> => {
  const errors = getProblemDetails(error)?.errors;

  if (!Array.isArray(errors)) {
    return {};
  }

  return Object.fromEntries(
    errors.map(({ pointer, detail }) => [
      pointer.replace(/^#\//, '').replaceAll('/', '.'),
      detail,
    ]),
  );
};
