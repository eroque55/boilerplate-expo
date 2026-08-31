import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { createMMKV } from 'react-native-mmkv';

const KEY_ALIAS = 'mmkv-encryption-key';

const getOrCreateEncryptionKey = () => {
  try {
    const existing = SecureStore.getItem(KEY_ALIAS);
    if (existing) {
      return existing;
    }

    const key = [...Crypto.getRandomBytes(16)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    SecureStore.setItem(KEY_ALIAS, key, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });

    return key;
  } catch {
    return undefined;
  }
};

export const storage = createMMKV({
  id: 'app-storage',
  encryptionKey: getOrCreateEncryptionKey(),
  encryptionType: 'AES-256',
  recoveryStrategy: 'discard-on-error',
});
