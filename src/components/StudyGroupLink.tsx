import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { useSettings } from '@/settings/SettingsContext';
import { StudyBuddyLogoMark } from '@/components/StudyBuddyLogoMark';
import type { StudyGroup } from '@/types/studyGroup';

type StudyGroupLinkProps = {
  group: StudyGroup;
  onPress: () => void;
};

export function StudyGroupLink({ group, onPress }: StudyGroupLinkProps) {
  const { colors, settings } = useSettings();
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(group.iconUrl) && !imageFailed;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.todoBackground }]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${group.name}`}
    >
      <View style={styles.cover}>
        {showImage ? (
          <Image
            source={{ uri: group.iconUrl }}
            style={styles.coverImage}
            onError={() => setImageFailed(true)}
            accessibilityLabel={`${group.name} cover image`}
          />
        ) : (
          <StudyBuddyLogoMark />
        )}
      </View>
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.textDark, fontSize: 17 * settings.textScale }]} numberOfLines={2}>
          {group.name}
        </Text>
        <Text style={[styles.course, { color: colors.mutedText, fontSize: 14 * settings.textScale }]}>
          {group.course}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 14 },
  cover: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 10 },
  coverImage: { width: '100%', height: '100%' },
  details: { flex: 1, gap: 5 },
  name: { fontWeight: '700' },
  course: {},
});
