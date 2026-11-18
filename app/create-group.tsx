import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { createStudyGroup } from '@/api/studyGroups';
import { AppShell } from '@/components/AppShell';
import { colors, spacing } from '@/constants/theme';

export default function CreateGroupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setName('');
    setIconUrl('');
    setCourse('');
    setDescription('');
    setIsSubmitting(false);
    setErrorMessage(null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => resetForm();
    }, [resetForm]),
  );

  const handleCreateGroup = async () => {
    const trimmedName = name.trim();
    const trimmedCourse = course.trim();

    if (!trimmedName || !trimmedCourse) {
      setErrorMessage('Group name and course are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createStudyGroup({
        name: trimmedName,
        course: trimmedCourse,
        iconUrl: iconUrl.trim() || undefined,
        description: description.trim() || undefined,
      });
      resetForm();
      router.replace('/find-study-groups');
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create study group.');
    }
  };

  return (
    <AppShell>
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Create Study Group</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Group name (required)"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            accessibilityLabel="Group name"
          />
          <TextInput
            value={iconUrl}
            onChangeText={setIconUrl}
            placeholder="Group icon image URL (optional)"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="url"
            accessibilityLabel="Group icon image URL"
          />
          <TextInput
            value={course}
            onChangeText={setCourse}
            placeholder="Course (required)"
            placeholderTextColor={colors.mutedText}
            style={styles.input}
            accessibilityLabel="Course"
          />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description (optional)"
            placeholderTextColor={colors.mutedText}
            style={[styles.input, styles.descriptionInput]}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Group description"
          />

          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <Pressable
            onPress={() => void handleCreateGroup()}
            disabled={isSubmitting}
            style={[styles.openButton, isSubmitting && styles.disabledButton]}
            accessibilityRole="button"
            accessibilityLabel="Open Group"
          >
            <Text style={styles.openButtonText}>{isSubmitting ? 'Opening...' : 'Open Group'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.pageWhite,
  },
  form: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingVertical: spacing.pageVertical,
    gap: 12,
  },
  heading: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: '700',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.mutedText,
    borderRadius: 6,
    color: colors.textDark,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  descriptionInput: {
    minHeight: 110,
  },
  errorMessage: {
    color: '#B42318',
    fontSize: 15,
  },
  openButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  openButtonText: {
    color: colors.pageWhite,
    fontSize: 15,
    fontWeight: '600',
  },
});
