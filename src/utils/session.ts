import { TTokenPair } from '@/types/auth';

import { storage } from './storage';

const KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const;

type TSessionTokens = Pick<TTokenPair, 'accessToken' | 'refreshToken'>;

let memoryTokens: TSessionTokens | null = null;

const persist = ({ accessToken, refreshToken }: TSessionTokens) => {
  storage.set(KEYS.accessToken, accessToken);
  storage.set(KEYS.refreshToken, refreshToken);
};

const removePersisted = () => {
  storage.remove(KEYS.accessToken);
  storage.remove(KEYS.refreshToken);
};

export const session = {
  getAccessToken: () =>
    memoryTokens?.accessToken ?? storage.getString(KEYS.accessToken),

  getRefreshToken: () =>
    memoryTokens?.refreshToken ?? storage.getString(KEYS.refreshToken),

  hasSession: () => Boolean(session.getRefreshToken()),

  start: (tokens: TSessionTokens, shouldPersist: boolean) => {
    memoryTokens = tokens;

    if (shouldPersist) {
      persist(tokens);
    } else {
      removePersisted();
    }
  },

  rotate: (tokens: TSessionTokens) => {
    const isPersisted = storage.contains(KEYS.refreshToken);
    memoryTokens = tokens;

    if (isPersisted) {
      persist(tokens);
    }
  },

  clear: () => {
    memoryTokens = null;
    removePersisted();
  },
};
