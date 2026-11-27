import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppShell } from '@/components/AppShell';
import { colors, spacing } from '@/constants/theme';
import { TodoListItem } from '@/components/TodoListItem';
import { loadTodos } from '@/storage/todoStore';
import type { TodoItem } from '@/types/todo';
import { useSettings } from '@/settings/SettingsContext';

export default function HomeScreen() {
  const router = useRouter();
  const { colors: themeColors, settings } = useSettings();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTodos = useCallback(async () => {
    setIsLoading(true);
    setTodos(await loadTodos());
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshTodos();
    }, [refreshTodos]),
  );

  return (
    <AppShell>
        <ScrollView
          style={[styles.content, { backgroundColor: themeColors.pageWhite }]}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.todoHeader}>
            <Text style={[styles.sectionHeading, { color: themeColors.textDark, fontSize: 20 * settings.textScale }]}>My Todos</Text>
            <Pressable
              onPress={() => router.push('/create-todo')}
              style={[styles.addButton, { backgroundColor: themeColors.accent }]}
              accessibilityRole="button"
              accessibilityLabel="Add Todo"
            >
              <Text style={[styles.addButtonText, { color: themeColors.pageWhite, fontSize: 14 * settings.textScale }]}>+ Add Todo</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.push('/study-group/mock' as never)}
            style={[styles.mockButton, { borderColor: themeColors.accent }]}
            accessibilityRole="button"
            accessibilityLabel="View study group forum mockup"
          >
            <Text style={[styles.mockButtonText, { color: themeColors.accent, fontSize: 15 * settings.textScale }]}>View Forum Mockup</Text>
          </Pressable>

          {isLoading ? (
            <ActivityIndicator color={themeColors.accent} style={styles.loading} />
          ) : todos.length === 0 ? (
            <Text style={[styles.mutedText, { color: themeColors.mutedText, fontSize: 16 * settings.textScale }]}>No todos yet. Tap "+ Add Todo" to create one.</Text>
          ) : (
            todos.map((todo) => <TodoListItem item={todo} key={todo.id} />)
          )}

          <View style={styles.timerSection}>
            <Text style={[styles.sectionHeading, { color: themeColors.textDark, fontSize: 20 * settings.textScale }]}>Active Study Timers</Text>
            <Text style={[styles.noTimers, { color: themeColors.mutedText, fontSize: 16 * settings.textScale }]}>No Active Timers</Text>
          </View>
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
  todoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: '700',
  },
  addButton: {
    borderRadius: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButtonText: {
    color: colors.pageWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  mockButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mockButtonText: {
    fontWeight: '600',
  },
  mutedText: {
    color: colors.mutedText,
    fontSize: 16,
  },
  loading: {
    paddingVertical: 14,
  },
  timerSection: {
    alignItems: 'center',
    paddingTop: 26,
    gap: 30,
  },
  noTimers: {
    color: colors.mutedText,
    fontSize: 16,
  },
});
