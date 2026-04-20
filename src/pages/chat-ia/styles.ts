import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/constants/tokens';

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm
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
  },
  heroCard: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heroLabel: {
    color: '#9EC0FF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.8
  },
  heroStatusChip: {
    minHeight: 22,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  heroStatusDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: '#3EE089'
  },
  heroStatusText: {
    color: '#F1F6FF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10
  },
  heroTitle: {
    marginTop: 2,
    color: '#FFFFFF',
    fontFamily: 'Manrope_700Bold',
    fontSize: 25,
    lineHeight: 30
  },
  heroSubtitle: {
    color: '#C3D6FB',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18
  },
  sectionTitle: {
    marginTop: spacing.xs,
    color: '#1B2B45',
    fontFamily: 'Manrope_700Bold',
    fontSize: 23
  },
  promptGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs
  },
  promptChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#DBE4F2',
    backgroundColor: '#EFF3F9',
    minHeight: 34,
    paddingHorizontal: 12,
    justifyContent: 'center'
  },
  promptChipText: {
    color: '#27446F',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11
  },
  topicList: {
    gap: spacing.xs
  },
  topicCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E3E9F2',
    backgroundColor: '#FFFFFF',
    minHeight: 72,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  topicIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topicTexts: {
    flex: 1
  },
  topicTitle: {
    color: '#1C2C45',
    fontFamily: 'Inter_700Bold',
    fontSize: 14
  },
  topicSubtitle: {
    marginTop: 2,
    color: '#76839A',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  composerCard: {
    marginTop: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DCE4F0',
    backgroundColor: '#F7FAFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs
  },
  composerLabel: {
    color: '#294671',
    fontFamily: 'Inter_700Bold',
    fontSize: 12
  },
  composerRow: {
    minHeight: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D8E2F0',
    backgroundColor: '#FFFFFF',
    paddingLeft: 12,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs
  },
  composerPlaceholder: {
    flex: 1,
    color: '#8996AA',
    fontFamily: 'Inter_400Regular',
    fontSize: 12
  },
  composerSendButton: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: '#072C78',
    alignItems: 'center',
    justifyContent: 'center'
  }
});