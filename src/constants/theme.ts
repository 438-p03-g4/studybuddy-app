export type ThemeColors = {
  accent: string;
  pageWhite: string;
  textDark: string;
  mutedText: string;
  todoBackground: string;
  tagBackground: string;
  border: string;
};

export const lightColors: ThemeColors = {
  accent: '#F46524',
  pageWhite: '#FFFFFF',
  textDark: '#242424',
  mutedText: '#777777',
  todoBackground: '#FFF7F2',
  tagBackground: '#FFE8DC',
  border: '#D6D6D6',
};

export const darkColors: ThemeColors = {
  accent: '#404be3',
  pageWhite: '#1E2732',
  textDark: '#F1F5F4',
  mutedText: '#AAB8B5',
  todoBackground: '#293743',
  tagBackground: '#344A4B',
  border: '#52625F',
};

export function getThemeColors(darkMode: boolean, accent = ''): ThemeColors {
  return { ...(darkMode ? darkColors : lightColors), ...(accent ? { accent } : {}) };
}

// Legacy static styles use the light theme until they are rendered with the settings context.
export const colors = lightColors;

export const spacing = {
  pageHorizontal: 20,
  pageVertical: 22,
};
