import { Redirect, Stack, usePathname, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthContextProvider } from '@/auth/AuthContext';
import { fetchCurrentUser } from '@/auth/client';
import type { UserProfile } from '@/auth/client';
import { colors } from '@/constants/theme';
import { DEV_AUTH_BYPASS_ENABLED, DEV_AUTH_USER } from '@/auth/devBypass';

export default function RootLayout() {
  const pathname = usePathname();
  const [authState, setAuthState] = useState<'checking' | 'signed-in' | 'signed-out' | 'error'>(
    'checking',
  );
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    if (DEV_AUTH_BYPASS_ENABLED) {
      setCurrentUser(DEV_AUTH_USER);
      setAuthState('signed-in');
      return () => {
        active = false;
      };
    }

    fetchCurrentUser()
      .then((user) => {
        if (!active) return;
        setCurrentUser(user);
        setAuthState(user ? 'signed-in' : 'signed-out');
      })
      .catch((error: unknown) => {
        if (!active) return;
        setErrorMessage(error instanceof Error ? error.message : 'Could not reach the backend.');
        setAuthState('error');
      });
    return () => {
      active = false;
    };
  }, []);

  const isLoginRoute = pathname === '/login' || pathname === '/login/success';

  if (authState === 'checking' && !isLoginRoute) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.message}>Checking your sign-in…</Text>
      </View>
    );
  }

  if (authState === 'error' && !isLoginRoute) {
    return (
      <View style={styles.centered}>
        <Text style={styles.heading}>Can’t connect to StudyBuddy</Text>
        <Text style={styles.message}>{errorMessage}</Text>
        <Text style={styles.message}>Make sure the backend is running at the configured API URL.</Text>
        {DEV_AUTH_BYPASS_ENABLED ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dev bypass"
            onPress={() => {
              setCurrentUser(DEV_AUTH_USER);
              setAuthState('signed-in');
            }}
            style={styles.devButton}
          >
            <Text style={styles.devButtonText}>Dev bypass</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  if (authState === 'signed-out' && !isLoginRoute) {
    return <Redirect href={'/login' as Href} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <AuthContextProvider value={currentUser}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FFFFFF' },
          }}
        />
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: colors.pageWhite,
  },
  heading: { color: colors.textDark, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  message: { color: colors.mutedText, fontSize: 15, textAlign: 'center' },
  devButton: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.mutedText,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  devButtonText: { color: colors.mutedText, fontSize: 16, fontWeight: '700' },
});
