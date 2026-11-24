import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { startOAuthLogin } from '@/auth/client';
import { colors } from '@/constants/theme';
import { useSettings } from '@/settings/SettingsContext';

export default function LoginScreen() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { colors: themeColors } = useSettings();

  const signIn = (provider: 'google' | 'github') => {
    setError('');
    setIsLoading(true);
    try {
      startOAuthLogin(provider);
    } catch (cause) {
      setIsLoading(false);
      setError(cause instanceof Error ? cause.message : 'Could not start sign-in.');
    }
  };

  return (
    <View style={[styles.page, { backgroundColor: themeColors.pageWhite }]}>
      <View style={[styles.card, { backgroundColor: themeColors.todoBackground }]}>
        <Text style={[styles.title, { color: themeColors.textDark }]}>Welcome to StudyBuddy</Text>
        <Text style={[styles.subtitle, { color: themeColors.mutedText }]}>Sign in to continue to your study space.</Text>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {isLoading ? <ActivityIndicator color={themeColors.accent} /> : null}
        <Pressable
          accessibilityRole="button"
          disabled={isLoading}
          onPress={() => signIn('google')}
          style={[styles.button, { backgroundColor: themeColors.accent }]}
        >
          <Text style={[styles.googleButtonText, { color: themeColors.pageWhite }]}>Continue with Google</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={isLoading}
          onPress={() => signIn('github')}
          style={[styles.button, styles.githubButton]}
        >
          <Text style={styles.githubButtonText}>Continue with GitHub</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F7F7F7' },
  card: { width: '100%', maxWidth: 440, gap: 16, padding: 28, borderRadius: 16, backgroundColor: colors.pageWhite },
  title: { color: colors.textDark, fontSize: 28, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: colors.mutedText, fontSize: 16, textAlign: 'center', marginBottom: 8 },
  button: { minHeight: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  googleButton: { backgroundColor: colors.accent },
  googleButtonText: { color: colors.pageWhite, fontSize: 16, fontWeight: '700' },
  githubButton: { backgroundColor: '#24292F' },
  githubButtonText: { color: colors.pageWhite, fontSize: 16, fontWeight: '700' },
  error: { color: '#B42318', fontSize: 14, textAlign: 'center' },
});
