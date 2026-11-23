import Constants from 'expo-constants';

import z from '@/validation/zod';

const LOCAL_API_PORT = 3333;

// In development the API usually runs on the same machine as Metro, so the
// Metro host (reachable from emulators and physical devices on the LAN) is a
// better default than `localhost`, which on a device points to the device.
const getLocalApiUrl = () => {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];

  return host ? `http://${host}:${LOCAL_API_PORT}/v1` : undefined;
};

const EnvSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
});

export const env = EnvSchema.parse({
  EXPO_PUBLIC_API_URL:
    process.env.EXPO_PUBLIC_API_URL ?? (__DEV__ ? getLocalApiUrl() : undefined),
});
