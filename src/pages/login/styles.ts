import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/constants/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg
  },
  card: {
    width: '100%',
    maxWidth: 460,
    justifyContent: 'center',
    gap: spacing.xs
  },
  logo: {
    width: 156,
    height: 156,
    alignSelf: 'center'
  },
  brand: {
    fontFamily: 'Inter_700Bold',
    fontSize: 34,
    color: '#0A2E77',
    textAlign: 'center',
    marginTop: -22
  },
  title: {
    fontFamily: 'Inter_700Bold',
    color: colors.onSurface,
    fontSize: 38,
    lineHeight: 44,
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: '#565E69',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: spacing.sm
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DEE3E8'
  },
  dividerText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 1.4,
    color: '#8A9199',
    textTransform: 'uppercase'
  },
  form: {
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  forgot: {
    fontFamily: 'Inter_600SemiBold',
    color: '#11377F',
    textAlign: 'right',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: -2
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: -2
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#B7BEC8',
    backgroundColor: colors.surfaceLowest,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxActive: {
    borderColor: '#11377F'
  },
  checkboxDot: {
    width: 7,
    height: 7,
    borderRadius: radius.sm,
    backgroundColor: '#11377F'
  },
  rememberText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#5B6270'
  },
  switchMode: {
    marginTop: spacing.xs,
    alignSelf: 'center'
  },
  switchText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#27364D',
    fontSize: 13
  },
  footerText: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.sm,
    textAlign: 'center',
    color: '#8A9199',
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    letterSpacing: 0.3
  }
});
