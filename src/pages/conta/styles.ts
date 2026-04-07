import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/constants/tokens';

const cardSpace = {
  compactX: spacing.sm,
  compactY: spacing.xs + 2,
  regularX: spacing.sm + 2,
  regularY: spacing.sm + 2
} as const;

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md
  },
  hero: {
    alignItems: 'center',
    gap: spacing.xs
  },
  avatarOuter: {
    width: 102,
    height: 102,
    borderRadius: radius.pill,
    backgroundColor: '#E6EAEF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInner: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: '#101D2C',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarFace: {
    marginTop: 2
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 10,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: '#0B3EA4',
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarBadgeText: {
    marginTop: -1
  },
  name: {
    fontFamily: 'Manrope_700Bold',
    color: '#1B2430',
    fontSize: 32,
    lineHeight: 36
  },
  info: {
    fontFamily: 'Inter_400Regular',
    color: '#6D7580',
    textAlign: 'center',
    fontSize: 13,
    maxWidth: 260,
    lineHeight: 17
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radius.md,
    paddingVertical: cardSpace.regularY,
    paddingHorizontal: cardSpace.regularX,
    borderWidth: 1,
    borderColor: '#E7EBF1',
    minHeight: 96
  },
  metricLabel: {
    fontFamily: 'Inter_700Bold',
    color: '#3B5F99',
    fontSize: 8,
    letterSpacing: 0.8
  },
  metricValue: {
    fontFamily: 'Inter_700Bold',
    color: '#1B2A42',
    fontSize: 34,
    lineHeight: 36,
    marginTop: 4
  },
  metricTrack: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: '#E5EBF3',
    marginTop: spacing.xs,
    overflow: 'hidden'
  },
  metricFill: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: '#0B3EA4'
  },
  metricMeta: {
    marginTop: 4,
    color: '#5C6F8A',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10
  },
  actionsList: {
    gap: spacing.xs
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D7DFEA',
    borderRadius: radius.md,
    minHeight: 66,
    paddingVertical: cardSpace.compactY,
    paddingHorizontal: cardSpace.compactX,
    gap: spacing.sm
  },
  actionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: radius.md,
    backgroundColor: '#EFF3F8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionIcon: {
    marginTop: 0
  },
  actionTexts: {
    flex: 1
  },
  actionTitle: {
    color: '#1E2B3F',
    fontFamily: 'Inter_700Bold',
    fontSize: 15
  },
  actionSubtitle: {
    color: '#8A929E',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 1
  },
  actionTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  actionCountBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    backgroundColor: '#EFF3F8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionCountText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: '#51647F'
  },
  actionChevron: {
    marginRight: -2
  },
  logoutButton: {
    marginTop: spacing.xs,
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: '#F5DCDD',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs
  },
  logoutIcon: {
    marginTop: -1
  },
  logoutText: {
    color: '#B32020',
    fontFamily: 'Inter_700Bold',
    fontSize: 13
  },
  footerBrand: {
    marginTop: spacing.xl,
    alignItems: 'center'
  },
  footerLogo: {
    width: 92,
    height: 92
  },
  footerTitle: {
    marginTop: 6,
    color: '#1A2B48',
    fontFamily: 'Inter_700Bold',
    fontSize: 22
  },
  footerSubtitle: {
    marginTop: 4,
    color: '#737C88',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  footerCaption: {
    marginTop: 3,
    color: '#A1A7B0',
    fontFamily: 'Inter_400Regular',
    fontSize: 9
  }
});
