import { useEffect, useState } from 'react';
import { Redirect, useRouter, type Href } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchCurrentUser, type UserProfile } from '@/auth/client';
import { colors } from '@/constants/theme';

export default function LoginSuccessScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchCurrentUser()
      .then((profile) => {
        if (!active) return;
        if (!profile) {
          setError('The backend did not find an active sign-in session. Please try again.');
          return;
        }
        setUser(profile);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Could not verify your sign-in.');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (user) return <Redirect href="/" />;

  return (
    <View style={styles.page}>
      {error ? (
        <>
          <Text accessibilityRole="alert" style={styles.title}>Sign-in could not be completed</Text>
          <Text style={styles.message}>{error}</Text>
          <Pressable onPress={() => router.replace('/login' as Href)} style={styles.button}>
            <Text style={styles.buttonText}>Back to sign in</Text>
          </Pressable>
        </>
      ) : (
        <>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.message}>Checking your sign-in…</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16, backgroundColor: colors.pageWhite },
  title: { color: colors.textDark, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  message: { color: colors.mutedText, fontSize: 16, textAlign: 'center' },
  button: { borderRadius: 8, backgroundColor: colors.accent, paddingHorizontal: 18, paddingVertical: 12 },
  buttonText: { color: colors.pageWhite, fontWeight: '700' },
});
