import { useEffect, useState } from 'react';
import { Redirect, useRouter, type Href } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchCurrentUser, type UserProfile } from '@/auth/client';
import { colors } from '@/constants/theme';
import { useSettings } from '@/settings/SettingsContext';

export default function LoginSuccessScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const { colors: themeColors, settings } = useSettings();

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
    <View style={[styles.page, { backgroundColor: themeColors.pageWhite }]}>
      {error ? (
        <>
          <Text accessibilityRole="alert" style={[styles.title, { color: themeColors.textDark, fontSize: 22 * settings.textScale }]}>Sign-in could not be completed</Text>
          <Text style={[styles.message, { color: themeColors.mutedText, fontSize: 16 * settings.textScale }]}>{error}</Text>
          <Pressable onPress={() => router.replace('/login' as Href)} style={[styles.button, { backgroundColor: themeColors.accent }]}>
            <Text style={[styles.buttonText, { color: themeColors.pageWhite, fontSize: 16 * settings.textScale }]}>Back to sign in</Text>
          </Pressable>
        </>
      ) : (
        <>
          <ActivityIndicator color={themeColors.accent} />
          <Text style={[styles.message, { color: themeColors.mutedText, fontSize: 16 * settings.textScale }]}>Checking your sign-in…</Text>
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
