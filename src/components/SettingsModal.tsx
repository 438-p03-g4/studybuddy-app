import { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { type ThemeColors } from '@/constants/theme';
import { useSettings, type AppSettings } from '@/settings/SettingsContext';
import { updateDisplayName } from '@/auth/client';
import { DEV_AUTH_BYPASS_ENABLED } from '@/auth/devBypass';

type SettingsModalProps = { visible: boolean; onClose: () => void };

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { settings, colors, saveSettings } = useSettings();
  const { width, height } = useWindowDimensions();
  const [tab, setTab] = useState<'app' | 'user'>('app');
  const [draft, setDraft] = useState<AppSettings>(settings);
  const [placeholder, setPlaceholder] = useState<string | null>(null);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isDesktop = width >= 700;

  useEffect(() => {
    if (visible) setDraft(settings);
  }, [settings, visible]);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const closeWithSave = async () => {
    const nextDisplayName = draft.displayName.trim();
    if (!nextDisplayName) {
      setSaveError('Display name cannot be empty.');
      return;
    }

    setSaveError('');
    setIsSaving(true);
    try {
      let savedDisplayName = nextDisplayName;
      if (!DEV_AUTH_BYPASS_ENABLED && nextDisplayName !== settings.displayName) {
        const savedUser = await updateDisplayName(nextDisplayName);
        savedDisplayName = savedUser.displayName;
      }
      saveSettings({ ...draft, displayName: savedDisplayName });
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save your display name.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={closeWithSave}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.panel,
            {
              backgroundColor: colors.pageWhite,
              height: isDesktop ? height * 0.75 : height,
              width: isDesktop ? '75%' : '100%',
            },
            isDesktop && styles.desktopPanel,
          ]}
        >
          <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textDark, fontSize: 22 * settings.textScale }]}>Settings</Text>
            <Pressable onPress={() => void closeWithSave()} disabled={isSaving} accessibilityRole="button" accessibilityLabel="Save settings">
              <Text style={[styles.saveText, { color: colors.accent, fontSize: 16 * settings.textScale }]}>Save</Text>
            </Pressable>
          </View>

          <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
            {(['app', 'user'] as const).map((item) => (
              <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && { borderBottomColor: colors.accent }]}>
                <Text style={[styles.tabText, { color: tab === item ? colors.accent : colors.mutedText, fontSize: 15 * settings.textScale }]}> 
                  {item === 'app' ? 'App Settings' : 'User Settings'}
                </Text>
              </Pressable>
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {tab === 'app' ? (
              <>
                <View style={styles.sliderSection}>
                  <View style={styles.sliderHeader}>
                    <Text style={[styles.settingText, { color: colors.textDark, fontSize: 17 * settings.textScale }]}>Text size</Text>
                    <Text style={[styles.valueText, { color: colors.mutedText, fontSize: 14 * settings.textScale }]}>{Math.round(draft.textScale * 100)}%</Text>
                  </View>
                  <Slider
                    minimumValue={0.85}
                    maximumValue={1.3}
                    step={0.05}
                    value={draft.textScale}
                    onValueChange={(value) => update('textScale', Number(value.toFixed(2)))}
                    minimumTrackTintColor={colors.accent}
                    maximumTrackTintColor={colors.border}
                    thumbTintColor={colors.accent}
                    accessibilityLabel="Text size"
                  />
                </View>
                <SettingToggle label="High contrast" value={draft.highContrast} onChange={(value) => update('highContrast', value)} colors={colors} textScale={settings.textScale} />
                <SettingToggle label="Dark mode" value={draft.darkMode} onChange={(value) => update('darkMode', value)} colors={colors} textScale={settings.textScale} />
                <SettingToggle label="Secrets" value={draft.secrets} onChange={(value) => update('secrets', value)} colors={colors} textScale={settings.textScale} />
                {draft.secrets ? (
                  <SettingToggle label="Party Mode" value={draft.partyMode} onChange={(value) => update('partyMode', value)} colors={colors} textScale={settings.textScale} />
                ) : null}
              </>
            ) : (
              <>
                <Text style={[styles.label, { color: colors.textDark, fontSize: 15 * draft.textScale }]}>Profile picture URL</Text>
                <TextInput
                  value={draft.profileImageUri}
                  onChangeText={(value) => update('profileImageUri', value)}
                  placeholder="Optional image URL"
                  placeholderTextColor={colors.mutedText}
                  autoCapitalize="none"
                  keyboardType="url"
                  style={[styles.input, { color: colors.textDark, borderColor: colors.border }]}
                />
                {saveError ? <Text style={[styles.error, { color: '#C94A4A' }]}>{saveError}</Text> : null}
                <Text style={[styles.label, { color: colors.textDark, fontSize: 15 * draft.textScale }]}>Display name</Text>
                <TextInput
                  value={draft.displayName}
                  onChangeText={(value) => update('displayName', value)}
                  placeholder="Your display name"
                  placeholderTextColor={colors.mutedText}
                  style={[styles.input, { color: colors.textDark, borderColor: colors.border }]}
                />
                {['Update email', 'Update password', 'Delete account'].map((label) => (
                  <Pressable key={label} onPress={() => setPlaceholder(label)} style={[styles.action, { borderColor: colors.border }]}>
                    <Text style={[styles.actionText, { color: label === 'Delete account' ? '#C94A4A' : colors.textDark, fontSize: 16 * settings.textScale }]}>{label}</Text>
                    <Text style={[styles.comingSoon, { color: colors.mutedText, fontSize: 13 * settings.textScale }]}>Coming soon</Text>
                  </Pressable>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </View>

      <Modal visible={placeholder !== null} transparent animationType="fade" onRequestClose={() => setPlaceholder(null)}>
        <View style={styles.backdrop}>
          <View style={[styles.notice, { backgroundColor: colors.pageWhite }]}>
            <Text style={[styles.title, { color: colors.textDark }]}>{placeholder}</Text>
            <Text style={[styles.message, { color: colors.mutedText }]}>This setting will be available in a future update.</Text>
            <Pressable onPress={() => setPlaceholder(null)} style={[styles.action, { borderColor: colors.border }]}>
              <Text style={[styles.actionText, { color: colors.accent }]}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

function SettingToggle({ label, value, onChange, colors, textScale }: { label: string; value: boolean; onChange: (value: boolean) => void; colors: ThemeColors; textScale: number }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={[styles.settingText, { color: colors.textDark, fontSize: 17 * textScale }]}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: colors.accent }} />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.48)', alignItems: 'center', justifyContent: 'center' },
  panel: { overflow: 'hidden' },
  desktopPanel: { borderRadius: 18, maxWidth: 1000 },
  topBar: { minHeight: 64, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  title: { fontSize: 22, fontWeight: '700' },
  saveText: { fontSize: 16, fontWeight: '700' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 16, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabText: { fontSize: 15, fontWeight: '600' },
  content: { padding: 22, gap: 18 },
  toggleRow: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sliderSection: { gap: 4 },
  sliderHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingText: { fontSize: 17 },
  valueText: { fontSize: 14 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: -10 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16 },
  error: { fontSize: 14, lineHeight: 20 },
  action: { minHeight: 52, borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionText: { fontSize: 16, fontWeight: '600' },
  comingSoon: { fontSize: 13 },
  notice: { width: '86%', maxWidth: 420, borderRadius: 14, padding: 22, gap: 18 },
  message: { fontSize: 15, lineHeight: 22 },
});
