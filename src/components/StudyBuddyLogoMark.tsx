import { Image, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '@/settings/SettingsContext';

export function StudyBuddyLogoMark() {
  const { colors } = useSettings();
  return (
    <View style={[styles.logo, { backgroundColor: colors.accent }]} accessible accessibilityLabel="StudyBuddy logo">
      <Text style={[styles.book, { color: colors.pageWhite }]}>⌁</Text>
    </View>
  );
}

export function UserAvatar({ uri = '' }: { uri?: string }) {
  const { colors } = useSettings();
  return (
    <View style={[styles.avatar, { backgroundColor: colors.tagBackground }]} accessible accessibilityLabel="User avatar">
      {uri ? <Image source={{ uri }} style={styles.image} /> : <>
        <View style={[styles.head, { backgroundColor: colors.accent }]} />
        <View style={[styles.body, { backgroundColor: colors.accent }]} />
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  book: { fontSize: 28, lineHeight: 28, fontWeight: '700' },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  head: { width: 7, height: 7, borderRadius: 4, marginTop: -3 },
  body: { width: 20, height: 10, borderTopLeftRadius: 12, borderTopRightRadius: 12, marginTop: 3 },
  image: { width: '100%', height: '100%', borderRadius: 17 },
});
