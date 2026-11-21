import { API_BASE_URL } from '@/api/config';

/** Frontend calls to the Spring Boot session-authentication endpoints. */
export { API_BASE_URL };

export type UserProfile = {
  id: number;
  email: string;
  displayName: string;
};

/** Returns null when the browser has no authenticated backend session. */
export async function fetchCurrentUser(): Promise<UserProfile | null> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status} while checking sign-in.`);
  }

  return (await response.json()) as UserProfile;
}

/** Starts the Spring Security OAuth2 authorization redirect. */
export function startOAuthLogin(provider: 'google' | 'github'): void {
  if (typeof window === 'undefined') {
    throw new Error('Sign-in must be started from a browser.');
  }
  window.location.assign(`${API_BASE_URL}/oauth2/authorization/${provider}`);
}
