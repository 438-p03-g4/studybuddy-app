import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchMyStudyGroups } from '@/api/forum';
import { AppShell } from '@/components/AppShell';
import { useSettings } from '@/settings/SettingsContext';
import type { StudyGroup } from '@/types/studyGroup';

export default function StudyGroupsScreen() {
  const router = useRouter();
  const { colors, settings } = useSettings();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchMyStudyGroups(controller.signal)
      .then(setGroups)
      .catch(() => setGroups([]))
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
            <Pressable
              key={group.id}
              onPress={() => router.push(`/study-group/${group.id}` as never)}
              style={[styles.groupCard, { backgroundColor: colors.todoBackground }]}
              accessibilityRole="button"
              accessibilityLabel={`Open ${group.name}`}
            >
              <Text style={[styles.groupName, { color: colors.textDark, fontSize: 17 * settings.textScale }]}>{group.name}</Text>
              <Text style={[styles.groupCourse, { color: colors.mutedText, fontSize: 14 * settings.textScale }]}>{group.course}</Text>
            </Pressable>
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
  groupCard: { borderRadius: 10, padding: 16, gap: 6 },
  groupName: { fontWeight: '700' },
  groupCourse: {},
});
