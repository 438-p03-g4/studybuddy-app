import { ScrollView, StyleSheet, Text } from 'react-native';
import { AppShell } from '@/components/AppShell';
import { colors, spacing } from '@/constants/theme';
import { useSettings } from '@/settings/SettingsContext';

export default function StudyGroupsScreen() {
  const { colors: themeColors, settings } = useSettings();
  return (
    <AppShell>
      <ScrollView
        style={[styles.content, { backgroundColor: themeColors.pageWhite }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionHeading, { color: themeColors.textDark, fontSize: 20 * settings.textScale }]}>My Study Groups</Text>
        <Text style={[styles.emptyState, { color: themeColors.mutedText, fontSize: 16 * settings.textScale }]}>No Active Study Groups</Text>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.pageWhite,
  },
  contentContainer: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingVertical: spacing.pageVertical,
    gap: 12,
  },
  sectionHeading: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: '700',
  },
  emptyState: {
    color: colors.mutedText,
    fontSize: 16,
    paddingTop: 8,
  },
});
