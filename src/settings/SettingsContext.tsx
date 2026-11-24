import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { getAccessibleThemeColors, type ThemeColors } from '@/constants/theme';

const SETTINGS_KEY = 'studybuddy.app-settings';

export type AppSettings = {
  darkMode: boolean;
  highContrast: boolean;
  textScale: number;
  secrets: boolean;
  partyMode: boolean;
  profileImageUri: string;
  displayName: string;
};

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  highContrast: false,
  textScale: 1,
  secrets: false,
  partyMode: false,
  profileImageUri: '',
  displayName: '',
};

type SettingsContextValue = {
  settings: AppSettings;
  colors: ThemeColors;
  saveSettings: (settings: AppSettings) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children, initialDisplayName = '' }: { children: ReactNode; initialDisplayName?: string }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [rainbowHue, setRainbowHue] = useState(0);

  useEffect(() => {
    void AsyncStorage.getItem(SETTINGS_KEY).then((stored) => {
      if (!stored) {
        setSettings((current) => ({ ...current, displayName: initialDisplayName }));
        return;
      }
      try {
        const savedSettings = JSON.parse(stored) as Partial<AppSettings>;
        setSettings({
          ...DEFAULT_SETTINGS,
          ...savedSettings,
          displayName: savedSettings.displayName || initialDisplayName,
        });
      } catch {
        // Ignore invalid local settings and keep defaults.
      }
    });
  }, [initialDisplayName]);

  useEffect(() => {
    if (!settings.partyMode) return;
    const interval = setInterval(() => setRainbowHue((hue) => (hue + 8) % 360), 80);
    return () => clearInterval(interval);
  }, [settings.partyMode]);

  const colors = useMemo(
    () => getAccessibleThemeColors(settings.darkMode, settings.highContrast, settings.partyMode ? `hsl(${rainbowHue}, 85%, 55%)` : ''),
    [rainbowHue, settings.darkMode, settings.highContrast, settings.partyMode],
  );

  const saveSettings = (nextSettings: AppSettings) => {
    setSettings(nextSettings);
    void AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
  };

  return <SettingsContext.Provider value={{ settings, colors, saveSettings }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used inside SettingsProvider');
  return context;
}
