import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchMyStudyGroups } from '@/api/forum';
import { AppShell } from '@/components/AppShell';
import { useSettings } from '@/settings/SettingsContext';
import type { StudyGroup } from '@/types/studyGroup';
import { StudyGroupLink } from '@/components/StudyGroupLink';

const MOCK_GROUP: StudyGroup = {
  id: 'mock',
  name: 'CST438 Study Buddies',
  course: 'CST438',
  description: 'A friendly place to compare notes, ask questions, and prepare for upcoming assignments.',
};

export default function StudyGroupsScreen() {
  const router = useRouter();
  const { colors, settings } = useSettings();
  const [groups, setGroups] = useState<StudyGroup[]>([MOCK_GROUP]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchMyStudyGroups(controller.signal)
      .then((loadedGroups) => setGroups([MOCK_GROUP, ...loadedGroups]))
      .catch(() => setGroups([MOCK_GROUP]))
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <AppShell>
      <ScrollView
        style={[styles.content, { backgroundColor: colors.pageWhite }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionHeading, { color: colors.textDark, fontSize: 20 * settings.textScale }]}>My Study Groups</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.accent} accessibilityLabel="Loading study groups" />
        ) : groups.length === 0 ? (
          <Text style={[styles.emptyState, { color: colors.mutedText, fontSize: 16 * settings.textScale }]}>No Active Study Groups</Text>
        ) : (
          groups.map((group) => (
            <StudyGroupLink
              key={group.id}
              group={group}
              onPress={() => router.push(`/study-group/${group.id}` as never)}
            />
          ))
        )}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingVertical: 22, gap: 12 },
  sectionHeading: { fontWeight: '700' },
  emptyState: { paddingTop: 8 },
});
