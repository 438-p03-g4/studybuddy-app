import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { StudyBuddyLogoMark, UserAvatar } from '@/components/StudyBuddyLogoMark';
import { TodoListItem } from '@/components/TodoListItem';
import { loadTodos } from '@/storage/todoStore';
import type { TodoItem } from '@/types/todo';

const MENU_ITEMS = ['My Study Groups', 'Find Study Groups', 'Create Study Timer'];

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <StudyBuddyLogoMark />
            <Text style={styles.brandName}>StudyBuddy</Text>
          </View>

          <Pressable
            onPress={() => undefined}
            style={styles.accountButton}
            accessibilityRole="button"
            accessibilityLabel="Open account settings"
          >
            <UserAvatar />
            <Text style={styles.username}>{'<username>'}</Text>
          </Pressable>
        </View>

        <View style={styles.accentBar}>
          <Pressable
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <Text style={styles.menuIcon}>☰</Text>
            <Text style={styles.menuText}>Menu</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.todoHeader}>
            <Text style={styles.sectionHeading}>My Todos</Text>
            <Pressable
              onPress={() => router.push('/create-todo')}
              style={styles.addButton}
              accessibilityRole="button"
              accessibilityLabel="Add Todo"
            >
              <Text style={styles.addButtonText}>+ Add Todo</Text>
            </Pressable>
          </View>

          {isLoading ? (
            <ActivityIndicator color={colors.accent} style={styles.loading} />
          ) : todos.length === 0 ? (
            <Text style={styles.mutedText}>No todos yet. Tap "+ Add Todo" to create one.</Text>
          ) : (
            todos.map((todo) => <TodoListItem item={todo} key={todo.id} />)
          )}

          <View style={styles.timerSection}>
            <Text style={styles.sectionHeading}>Active Study Timers</Text>
            <Text style={styles.noTimers}>No Active Timers</Text>
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuPopup}>
            {MENU_ITEMS.map((item) => (
              <Pressable
                key={item}
                onPress={() => setMenuVisible(false)}
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.pageWhite,
  },
  page: {
    flex: 1,
    backgroundColor: colors.pageWhite,
  },
  header: {
    width: '100%',
    paddingHorizontal: spacing.pageHorizontal,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandName: {
    color: colors.textDark,
    fontSize: 22,
    fontWeight: '700',
  },
  accountButton: {
    borderRadius: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  username: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: '500',
  },
  accentBar: {
    height: 52,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  menuButton: {
    marginLeft: 20,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    color: colors.pageWhite,
    fontSize: 23,
    lineHeight: 24,
  },
  menuText: {
    color: colors.pageWhite,
    fontSize: 15,
    fontWeight: '600',
  },
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    alignItems: 'flex-start',
    paddingTop: 124,
    paddingLeft: 20,
  },
  menuPopup: {
    minWidth: 220,
    borderRadius: 8,
    backgroundColor: colors.pageWhite,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    color: colors.textDark,
    fontSize: 15,
  },
});
