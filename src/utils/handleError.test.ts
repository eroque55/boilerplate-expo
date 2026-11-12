import { AxiosError, AxiosResponse } from 'axios';

import { handleError } from './handleError';

const DEFAULT_MESSAGE = 'Houve um imprevisto, tente novamente mais tarde';

const axiosErrorWith = (data: unknown) => {
  const response = {
    data,
    status: 400,
    statusText: 'Bad Request',
    headers: {},
    config: {},
  } as AxiosResponse;

  return new AxiosError(
    'Request failed with status code 400',
    'ERR_BAD_REQUEST',
    undefined,
    undefined,
    response,
  );
};

describe('handleError', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the string itself when given one', () => {
    expect(handleError('Erro customizado')).toBe('Erro customizado');
  });

  it('extracts the API message from { message }', () => {
    expect(
      handleError(axiosErrorWith({ message: 'E-mail já cadastrado' })),
    ).toBe('E-mail já cadastrado');
  });

  it('extracts the nested message from { error: { message } }', () => {
    expect(
      handleError(
        axiosErrorWith({ error: { message: 'Credenciais inválidas' } }),
      ),
    ).toBe('Credenciais inválidas');
  });

  it('accepts data as a plain string', () => {
    expect(handleError(axiosErrorWith('Falha no servidor'))).toBe(
      'Falha no servidor',
    );
  });

  it('falls back to the default message when the response has nothing usable', () => {
    expect(handleError(axiosErrorWith({ status: 400 }))).toBe(DEFAULT_MESSAGE);
    expect(handleError(axiosErrorWith(null))).toBe(DEFAULT_MESSAGE);
  });

  it('does not use the generic axios message when the API responded', () => {
    const message = handleError(axiosErrorWith({ message: 'Sem estoque' }));

    expect(message).not.toContain('Request failed with status code');
  });

  it('uses the message from a plain Error', () => {
    expect(handleError(new Error('Sem conexão com a internet!'))).toBe(
      'Sem conexão com a internet!',
    );
  });

  it('falls back to the default message for unknown values', () => {
    expect(handleError(null)).toBe(DEFAULT_MESSAGE);
    expect(handleError(undefined)).toBe(DEFAULT_MESSAGE);
    expect(handleError(42)).toBe(DEFAULT_MESSAGE);
  });

  it('logs the error to the console in development', () => {
    const error = new Error('boom');

    handleError(error);

    expect(console.error).toHaveBeenCalledWith(error);
  });
});
