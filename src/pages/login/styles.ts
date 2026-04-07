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
    paddingBottom: spacing.lg,
    overflow: 'hidden'
  },
  waveTopArea: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 294
  },
  waveSvg: {
    width: '100%',
    height: '100%'
  },
  card: {
    width: '100%',
    maxWidth: 460,
    justifyContent: 'center',
    gap: spacing.xs,
    zIndex: 1
  },
  logo: {
    width: 156,
    height: 156,
    alignSelf: 'center',
    marginTop: -6
  },
  brand: {
    fontFamily: 'Inter_700Bold',
    fontSize: 34,
    color: '#0A2E77',
    textAlign: 'center',
    marginTop: -16
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
  feedbackOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 22, 43, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg
  },
  feedbackPopup: {
    width: '100%',
    maxWidth: 420,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
    shadowColor: '#0D2346',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10
  },
  feedbackPopupSuccess: {
    backgroundColor: '#EDFBF3',
    borderColor: '#BEE8CC'
  },
  feedbackPopupError: {
    backgroundColor: '#FEF1F1',
    borderColor: '#F4C8C8'
  },
  feedbackPopupInfo: {
    backgroundColor: '#EDF5FF',
    borderColor: '#C7DBF8'
  },
  feedbackTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: '#1E2D43'
  },
  feedbackMessage: {
    fontFamily: 'Inter_400Regular',
    color: '#4A5C77',
    fontSize: 12,
    lineHeight: 18
  },
  feedbackCloseButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
    minHeight: 34,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CAD8ED',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm
  },
  feedbackCloseText: {
    fontFamily: 'Inter_700Bold',
    color: '#214C8F',
    fontSize: 12
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
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2
  },
  switchText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#4A5668',
    fontSize: 13
  },
  switchHighlight: {
    fontFamily: 'Inter_700Bold',
    color: '#0D4EB4',
    textDecorationLine: 'underline'
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
