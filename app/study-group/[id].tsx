import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { createForumMessage, fetchStudyGroupForum } from '@/api/forum';
import { AppShell } from '@/components/AppShell';
import { useSettings } from '@/settings/SettingsContext';
import type { ForumMessage, StudyGroupForum } from '@/types/forum';

const MOCK_FORUM: StudyGroupForum = {
  group: {
    id: 0,
    name: 'CST438 Study Buddies',
    course: 'CST438',
    description: 'A friendly place to compare notes, ask questions, and prepare for upcoming assignments.',
  },
  members: [
    { id: 1, displayName: 'Alex Johnson' },
    { id: 2, displayName: 'Jamie Lee' },
    { id: 3, displayName: 'Taylor Smith' },
  ],
  messages: [
    { id: 1, content: 'Welcome to the group! What topics should we cover at our next study session?', authorId: 1, authorName: 'Alex Johnson', createdAt: '2026-11-24T18:30:00Z' },
    { id: 2, content: 'I would like to review the API routing examples from this week.', authorId: 2, authorName: 'Jamie Lee', createdAt: '2026-11-24T19:02:00Z' },
    { id: 3, content: 'That works for me. I can bring a few practice questions.', authorId: 3, authorName: 'Taylor Smith', createdAt: '2026-11-24T19:18:00Z' },
  ],
};

export default function StudyGroupForumScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, settings } = useSettings();
  const [forum, setForum] = useState<StudyGroupForum | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (id === 'mock') {
      setForum(MOCK_FORUM);
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    fetchStudyGroupForum(id, controller.signal)
      .then(setForum)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setErrorMessage(error instanceof Error ? error.message : 'Unable to load this study group.');
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [id]);

  const sendMessage = async () => {
    const content = messageText.trim();
    if (!id || !content || isSending) return;
    setIsSending(true);
    try {
      const message = id === 'mock'
        ? { id: Date.now(), content, authorId: 0, authorName: 'You', createdAt: new Date().toISOString() }
        : await createForumMessage(id, content);
      setForum((current) => current ? { ...current, messages: [...current.messages, message] } : current);
      setMessageText('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to post message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AppShell>
      <KeyboardAvoidingView style={[styles.page, { backgroundColor: colors.pageWhite }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.forumHeader, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.replace('/study-groups')} accessibilityRole="button" accessibilityLabel="Back to My Study Groups">
            <Text style={[styles.backText, { color: colors.accent, fontSize: 15 * settings.textScale }]}>← Back</Text>
          </Pressable>
          <View style={styles.titleRow}>
            <Text numberOfLines={1} style={[styles.title, { color: colors.textDark, fontSize: 20 * settings.textScale }]}>{forum?.group.name ?? 'Study Group'}</Text>
            <Pressable onPress={() => setInfoVisible(true)} accessibilityRole="button" accessibilityLabel="View study group information">
              <Text style={[styles.infoIcon, { color: colors.accent }]}>ⓘ</Text>
            </Pressable>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.centered}><ActivityIndicator color={colors.accent} accessibilityLabel="Loading study group" /></View>
        ) : errorMessage ? (
          <View style={styles.centered}><Text style={[styles.error, { color: '#C94A4A', fontSize: 15 * settings.textScale }]}>{errorMessage}</Text></View>
        ) : (
          <>
            <ScrollView style={styles.messages} contentContainerStyle={styles.messageContent} showsVerticalScrollIndicator>
              {forum?.messages.length ? forum.messages.map((message) => <MessageBubble key={message.id} message={message} colors={colors} textScale={settings.textScale} />) : (
                <Text style={[styles.emptyState, { color: colors.mutedText, fontSize: 16 * settings.textScale }]}>No messages yet. Start the conversation.</Text>
              )}
            </ScrollView>
            <View style={[styles.composer, { borderTopColor: colors.border, backgroundColor: colors.pageWhite }]}>
              <TextInput
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Write a message..."
                placeholderTextColor={colors.mutedText}
                multiline
                maxLength={4000}
                style={[styles.messageInput, { color: colors.textDark, borderColor: colors.border, fontSize: 16 * settings.textScale }]}
                accessibilityLabel="New forum message"
              />
              <Pressable onPress={() => void sendMessage()} disabled={!messageText.trim() || isSending} style={[styles.sendButton, { backgroundColor: colors.accent, opacity: !messageText.trim() || isSending ? 0.5 : 1 }]} accessibilityRole="button" accessibilityLabel="Send message">
                <Text style={[styles.sendText, { color: colors.pageWhite, fontSize: 15 * settings.textScale }]}>{isSending ? 'Sending...' : 'Send'}</Text>
              </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>

      <Modal visible={infoVisible} transparent animationType="fade" onRequestClose={() => setInfoVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.infoCard, { backgroundColor: colors.pageWhite }]}>
            <View style={styles.infoTitleRow}>
              <Text style={[styles.infoTitle, { color: colors.textDark, fontSize: 21 * settings.textScale }]}>Group Information</Text>
              <Pressable onPress={() => setInfoVisible(false)} accessibilityRole="button" accessibilityLabel="Close group information"><Text style={[styles.closeText, { color: colors.accent }]}>✕</Text></Pressable>
            </View>
            <Text style={[styles.infoLabel, { color: colors.mutedText, fontSize: 13 * settings.textScale }]}>Course</Text>
            <Text style={[styles.infoValue, { color: colors.textDark, fontSize: 16 * settings.textScale }]}>{forum?.group.course}</Text>
            <Text style={[styles.infoLabel, { color: colors.mutedText, fontSize: 13 * settings.textScale }]}>Description</Text>
            <Text style={[styles.infoValue, { color: colors.textDark, fontSize: 16 * settings.textScale }]}>{forum?.group.description || 'No description provided.'}</Text>
            <Text style={[styles.infoLabel, { color: colors.mutedText, fontSize: 13 * settings.textScale }]}>Members</Text>
            {forum?.members.map((member) => <Text key={member.id} style={[styles.member, { color: colors.textDark, fontSize: 16 * settings.textScale }]}>{member.displayName}</Text>)}
          </View>
        </View>
      </Modal>
    </AppShell>
  );
}

function MessageBubble({ message, colors, textScale }: { message: ForumMessage; colors: ReturnType<typeof useSettings>['colors']; textScale: number }) {
  return (
    <View style={[styles.messageBubble, { backgroundColor: colors.todoBackground }]}>
      <View style={styles.messageMeta}>
        <Text style={[styles.author, { color: colors.textDark, fontSize: 14 * textScale }]}>{message.authorName}</Text>
        <Text style={[styles.timestamp, { color: colors.mutedText, fontSize: 12 * textScale }]}>{new Date(message.createdAt).toLocaleString()}</Text>
      </View>
      <Text style={[styles.messageBody, { color: colors.textDark, fontSize: 16 * textScale }]}>{message.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  forumHeader: { minHeight: 72, paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, gap: 6 },
  backText: { fontWeight: '600' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { flex: 1, fontWeight: '700' },
  infoIcon: { fontSize: 23, fontWeight: '700' },
  messages: { flex: 1 },
  messageContent: { padding: 20, gap: 12, flexGrow: 1 },
  messageBubble: { borderRadius: 10, padding: 14, gap: 8 },
  messageMeta: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  author: { fontWeight: '700' },
  timestamp: { flexShrink: 1 },
  messageBody: { lineHeight: 23 },
  emptyState: { textAlign: 'center', marginTop: 24 },
  composer: { borderTopWidth: 1, padding: 12, gap: 10 },
  messageInput: { minHeight: 72, maxHeight: 160, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, textAlignVertical: 'top' },
  sendButton: { alignSelf: 'flex-end', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 11 },
  sendText: { fontWeight: '700' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  error: { textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.48)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  infoCard: { width: '100%', maxWidth: 520, borderRadius: 16, padding: 22, gap: 10 },
  infoTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  infoTitle: { fontWeight: '700' },
  closeText: { fontSize: 20, fontWeight: '700' },
  infoLabel: { fontWeight: '700', marginTop: 8 },
  infoValue: { lineHeight: 22 },
  member: { paddingVertical: 2 },
});
