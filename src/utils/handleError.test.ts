import { AxiosError, AxiosHeaders } from 'axios';

import { getFieldErrors, handleError } from './handleError';

const DEFAULT_MESSAGE = 'Houve um imprevisto, tente novamente mais tarde';

const buildAxiosError = (data: unknown, status = 400) =>
  new AxiosError(
    `Request failed with status code ${status}`,
    'ERR_BAD_REQUEST',
    undefined,
    undefined,
    {
      data,
      status,
      statusText: 'Bad Request',
      headers: {},
      config: { headers: new AxiosHeaders() },
    },
  );

const validationProblem = {
  type: 'about:blank',
  title: 'Unprocessable Entity',
  status: 422,
  detail: 'Dados inválidos',
  instance: '/v1/auth/register',
  errors: [
    { pointer: '#/email', detail: 'E-mail inválido' },
    { pointer: '#/address/zipCode', detail: 'CEP inválido' },
  ],
};

describe('handleError', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns plain strings directly', () => {
    expect(handleError('Sessão expirada')).toBe('Sessão expirada');
  });

  it('extracts detail from RFC 9457 Problem Details responses', () => {
    expect(
      handleError(
        buildAxiosError(
          {
            type: 'about:blank',
            title: 'Unauthorized',
            status: 401,
            detail: 'E-mail ou senha incorretos',
            instance: '/v1/auth/login',
          },
          401,
        ),
      ),
    ).toBe('E-mail ou senha incorretos');
  });

  it('accepts response data as a plain string', () => {
    expect(handleError(buildAxiosError('Falha no servidor'))).toBe(
      'Falha no servidor',
    );
  });

  it('falls back to the default message when the response has no detail', () => {
    expect(handleError(buildAxiosError({}))).toBe(DEFAULT_MESSAGE);
    expect(handleError(buildAxiosError(null))).toBe(DEFAULT_MESSAGE);
  });

  it('never shows the generic Axios message', () => {
    expect(
      handleError(buildAxiosError({ title: 'Bad Request' })),
    ).not.toContain('Request failed with status code');
  });

  it('returns Error.message for standard Error instances', () => {
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

describe('getFieldErrors', () => {
  it('maps JSON pointers to form field paths', () => {
    expect(getFieldErrors(buildAxiosError(validationProblem, 422))).toEqual({
      email: 'E-mail inválido',
      'address.zipCode': 'CEP inválido',
    });
  });

  it('returns an empty object when the error has no field errors', () => {
    expect(
      getFieldErrors(buildAxiosError({ detail: 'Não encontrado' })),
    ).toEqual({});
    expect(getFieldErrors(new Error('boom'))).toEqual({});
  });
});
