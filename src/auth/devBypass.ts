import type { UserProfile } from '@/auth/client';

/**
 * This flag is intentionally gated by Expo's development constant. Even if a
 * public environment variable is accidentally enabled in a production build,
 * the bypass remains unavailable there.
 */
export const DEV_AUTH_BYPASS_ENABLED =
  __DEV__ && process.env.EXPO_PUBLIC_DEV_AUTH_BYPASS === 'true';

export const DEV_AUTH_USER: UserProfile = {
  id: 0,
  email: 'developer@localhost',
  displayName: 'Developer',
};
