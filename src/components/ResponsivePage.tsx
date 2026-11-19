import type { ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors } from '@/constants/theme';

type ResponsivePageProps = {
  children: ReactNode;
};

/**
 * Keeps page content full-width on phones and centered within a readable
 * maximum width on larger web screens.
 */
export function ResponsivePage({ children }: ResponsivePageProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={styles.outer}>
      <View style={[styles.content, isDesktop && styles.desktopContent]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.pageWhite,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.pageWhite,
  },
  desktopContent: {
    maxWidth: 1100,
  },
});
