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
import { useSettings } from '@/settings/SettingsContext';

export default function CreateGroupScreen() {
  const router = useRouter();
  const { colors: themeColors } = useSettings();
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
        style={[styles.page, { backgroundColor: themeColors.pageWhite }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.heading, { color: themeColors.textDark }]}>Create Study Group</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Group name (required)"
            placeholderTextColor={themeColors.mutedText}
            style={[styles.input, { borderColor: themeColors.border, color: themeColors.textDark }]}
            accessibilityLabel="Group name"
          />
          <TextInput
            value={iconUrl}
            onChangeText={setIconUrl}
            placeholder="Group icon image URL (optional)"
            placeholderTextColor={themeColors.mutedText}
            style={[styles.input, { borderColor: themeColors.border, color: themeColors.textDark }]}
            autoCapitalize="none"
            keyboardType="url"
            accessibilityLabel="Group icon image URL"
          />
          <TextInput
            value={course}
            onChangeText={setCourse}
            placeholder="Course (required)"
            placeholderTextColor={themeColors.mutedText}
            style={[styles.input, { borderColor: themeColors.border, color: themeColors.textDark }]}
            accessibilityLabel="Course"
          />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description (optional)"
            placeholderTextColor={themeColors.mutedText}
            style={[styles.input, styles.descriptionInput, { borderColor: themeColors.border, color: themeColors.textDark }]}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Group description"
          />

          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => {
                resetForm();
                router.replace('/find-study-groups');
              }}
              disabled={isSubmitting}
              style={[styles.cancelButton, { borderColor: themeColors.accent }, isSubmitting && styles.disabledButton]}
              accessibilityRole="button"
              accessibilityLabel="Cancel group creation"
            >
              <Text style={[styles.cancelButtonText, { color: themeColors.accent }]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => void handleCreateGroup()}
              disabled={isSubmitting}
              style={[styles.openButton, { backgroundColor: themeColors.accent }, isSubmitting && styles.disabledButton]}
              accessibilityRole="button"
              accessibilityLabel="Open Group"
            >
              <Text style={[styles.openButtonText, { color: themeColors.pageWhite }]}>{isSubmitting ? 'Opening...' : 'Open Group'}</Text>
            </Pressable>
          </View>
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
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  cancelButtonText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
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
