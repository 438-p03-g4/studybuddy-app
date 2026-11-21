import { createContext, useContext } from 'react';
import type { UserProfile } from '@/auth/client';

const AuthContext = createContext<UserProfile | null>(null);

export const AuthContextProvider = AuthContext.Provider;

export function useCurrentUser(): UserProfile | null {
  return useContext(AuthContext);
}
