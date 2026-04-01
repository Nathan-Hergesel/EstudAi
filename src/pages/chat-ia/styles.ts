import { StyleSheet } from 'react-native';

import { colors, spacing } from '@/constants/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md
  },
  header: {
    gap: spacing.sm
  },
  eyebrow: {
    color: '#6A7482',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 1.8
  },
  title: {
    marginTop: 0,
    color: colors.onSurface,
    fontFamily: 'Manrope_700Bold',
    fontSize: 32,
    lineHeight: 40,
    paddingBottom: 2
  }
});
