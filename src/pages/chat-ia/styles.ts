import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/constants/tokens';

export const landingStyles = StyleSheet.create({
  landingRoot: {
    flex: 1,
    backgroundColor: colors.surface
  },
  landingTop: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm
  },
  landingMiddle: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.xl
  },
  emptyStateText: {
    color: '#A0AFBF',
    fontFamily: 'Inter_400Regular',
    fontSize: 13
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
    color: colors.onSurface,
    fontFamily: 'Manrope_700Bold',
    fontSize: 32,
    lineHeight: 40
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
  recentList: {
    gap: spacing.xs
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E3E9F2',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 60
  },
  recentIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  recentTexts: {
    flex: 1
  },
  recentPreview: {
    color: '#1C2C45',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 18
  },
  recentDate: {
    marginTop: 2,
    color: '#76839A',
    fontFamily: 'Inter_400Regular',
    fontSize: 11
  },
  recentDeleteButton: {
    padding: spacing.xs
  }
});

export const chatStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E9F2',
    backgroundColor: '#FFFFFF'
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: '#F0F4FA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatHeaderTitle: {
    flex: 1,
    color: '#162944',
    fontFamily: 'Manrope_700Bold',
    fontSize: 16
  },
  chatHeaderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  chatHeaderStatusDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: '#3EE089'
  },
  chatHeaderStatusText: {
    color: '#3EE089',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11
  },
  messageList: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0A3D9F',
    borderBottomRightRadius: radius.sm
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E9F2',
    borderBottomLeftRadius: radius.sm
  },
  bubbleText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21
  },
  userText: {
    color: '#FFFFFF'
  },
  assistantText: {
    color: colors.onSurface
  },
  loadingDots: {
    color: '#8996AA',
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    letterSpacing: 4
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#D0DBEC',
    backgroundColor: '#FFFFFF',
    shadowColor: '#101F39',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 8
  },
  composerInput: {
    flex: 1,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#C8D6EA',
    backgroundColor: '#F4F8FF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 0,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurface
  },
  composerInputFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF'
  },
  sendButton: {
    minWidth: 52,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: '#072C78',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButtonDisabled: {
    backgroundColor: '#B0BEC5'
  }
});

export const markdownStyles = {
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: colors.onSurface,
    margin: 0,
    padding: 0
  },
  strong: {
    fontFamily: 'Inter_700Bold'
  },
  em: {
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic' as const
  },
  bullet_list: {
    marginTop: 2,
    marginBottom: 2
  },
  ordered_list: {
    marginTop: 2,
    marginBottom: 2
  },
  list_item: {
    marginTop: 1,
    marginBottom: 1
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 4
  },
  code_inline: {
    fontFamily: 'Inter_400Regular',
    backgroundColor: '#EEF3FA',
    color: '#1B335A',
    borderRadius: 4,
    paddingHorizontal: 4
  }
};
