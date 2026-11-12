import { isAxiosError } from 'axios';

const DEFAULT_MESSAGE = 'Houve um imprevisto, tente novamente mais tarde';

const getApiMessage = (data: unknown): string | undefined => {
  if (typeof data === 'string') {
    return data;
  }

  if (!data || typeof data !== 'object') {
    return undefined;
  }

  const { message, error } = data as {
    message?: unknown;
    error?: { message?: unknown };
  };

  if (typeof message === 'string') {
    return message;
  }

  if (typeof error?.message === 'string') {
    return error.message;
  }

  return undefined;
};

export const handleError = (error: string | Error | unknown): string => {
  if (__DEV__) {
    console.error(error);
  }

  if (typeof error === 'string') {
    return error;
  }

  if (isAxiosError(error)) {
    return getApiMessage(error.response?.data) ?? DEFAULT_MESSAGE;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return DEFAULT_MESSAGE;
};
