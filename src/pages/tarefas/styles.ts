import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/constants/tokens';

const cardSpace = {
  denseX: spacing.sm,
  denseY: spacing.xs,
  compactX: spacing.sm,
  compactY: spacing.xs + 2,
  regularX: spacing.sm + 2,
  regularY: spacing.sm + 2,
  spaciousX: spacing.sm + 4,
  spaciousY: spacing.sm + 4
} as const;

const DARK_BLUE = '#072C78';
const PILL_BASE_AGENDA = '#EEF2F7';
const PILL_BORDER_AGENDA = '#E1E8F1';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm
  },
  eyebrow: {
    color: '#6A7482',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 1.8
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    color: colors.onSurface,
    fontSize: 32,
    lineHeight: 40,
    marginTop: 0,
    paddingBottom: 2
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E4E8ED',
    minHeight: 46,
    paddingHorizontal: spacing.sm
  },
  searchIcon: {
    marginRight: spacing.xs,
    marginTop: -1
  },
  searchInput: {
    flex: 1,
    color: '#182238',
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    paddingVertical: 0
  },
  iconAction: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: DARK_BLUE,
    backgroundColor: DARK_BLUE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconActionIcon: {
    marginTop: -1
  },
  selectionBar: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: cardSpace.compactX,
    paddingVertical: cardSpace.compactY,
    borderRadius: radius.md,
    backgroundColor: DARK_BLUE
  },
  selectionText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    fontSize: 12
  },
  selectionAction: {
    fontFamily: 'Inter_700Bold',
    color: '#CFE0FF',
    fontSize: 12
  },
  headerStatsRow: {
    flexDirection: 'row',
    gap: spacing.xs
  },
  headerStatPill: {
    flex: 1,
    minHeight: 32,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: PILL_BORDER_AGENDA,
    backgroundColor: PILL_BASE_AGENDA,
    position: 'relative',
    overflow: 'hidden'
  },
  headerStatPillFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: radius.pill
  },
  headerStatPillFillFocus: {
    backgroundColor: '#DCEAFF'
  },
  headerStatPillFillPending: {
    backgroundColor: '#DCEAFF'
  },
  headerStatPillContent: {
    minHeight: 32,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 1
  },
  headerStatPillLabel: {
    fontFamily: 'Inter_500Medium',
    color: '#1F3658',
    fontSize: 10,
    letterSpacing: 0.5
  },
  headerStatPillValue: {
    fontFamily: 'Inter_700Bold',
    color: '#0B3D9B',
    fontSize: 12
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: 108,
    paddingTop: spacing.xs
  },
  dateDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
    marginBottom: 2
  },
  dateDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D8E0EB'
  },
  dateDividerLabel: {
    color: '#6E7E93',
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase'
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: 12,
    paddingHorizontal: cardSpace.regularX,
    paddingVertical: cardSpace.regularY,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: '#E7EBF1'
  },
  cardToneProva: {
    borderRightWidth: 3,
    borderRightColor: '#E53935'
  },
  cardToneTrabalho: {
    borderRightWidth: 3,
    borderRightColor: '#16A34A'
  },
  cardToneAtividade: {
    borderRightWidth: 3,
    borderRightColor: '#2563EB'
  },
  cardToneLeitura: {
    borderRightWidth: 3,
    borderRightColor: '#E6B800'
  },
  cardCompleted: {
    backgroundColor: '#F7F9FC',
    borderColor: '#DDE5F0',
    paddingVertical: cardSpace.compactY,
    paddingHorizontal: cardSpace.compactX,
    gap: 4,
    opacity: 0.72,
    transform: [{ scale: 0.985 }]
  },
  cardCompletedCollapsed: {
    paddingVertical: cardSpace.denseY,
    paddingHorizontal: cardSpace.denseX,
    gap: 2
  },
  cardSelected: {
    borderColor: DARK_BLUE
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  typeBadge: {
    borderRadius: radius.pill,
    minHeight: 19,
    paddingHorizontal: 8,
    justifyContent: 'center'
  },
  badgeProva: {
    backgroundColor: '#FDE6E5'
  },
  badgeTrabalho: {
    backgroundColor: '#DDFBE9'
  },
  badgeAtividade: {
    backgroundColor: '#E8F0FF'
  },
  badgeLeitura: {
    backgroundColor: '#FFF4CC'
  },
  typeBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: '#2B3F5E',
    letterSpacing: 0.5
  },
  doneBadge: {
    borderRadius: radius.pill,
    minHeight: 19,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#E7F6EE',
    borderWidth: 1,
    borderColor: '#C1E7D2'
  },
  doneBadgeText: {
    fontFamily: 'Inter_700Bold',
    color: '#1B8E54',
    fontSize: 8,
    letterSpacing: 0.35
  },
  doneToggleChip: {
    marginLeft: 'auto',
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    minHeight: 22,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF3FB',
    borderWidth: 1,
    borderColor: '#D5E0F2'
  },
  taskTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#1F2A3A',
    fontSize: 19,
    lineHeight: 23
  },
  taskTitleCompleted: {
    color: '#5F6978',
    fontSize: 16,
    lineHeight: 19,
    textDecorationLine: 'line-through'
  },
  taskDescription: {
    color: '#1F2A3A',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 18
  },
  taskDescriptionCompleted: {
    color: '#8993A1',
    fontSize: 12,
    lineHeight: 15
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  metaIcon: {
    marginTop: -1
  },
  meta: {
    color: '#7A828E',
    fontFamily: 'Inter_500Medium',
    fontSize: 12
  },
  metaCompleted: {
    color: '#9AA3B0'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  footerRowCollapsed: {
    marginTop: 1
  },
  concludeButton: {
    minHeight: 30,
    borderRadius: radius.sm,
    backgroundColor: DARK_BLUE,
    justifyContent: 'center',
    paddingHorizontal: 14
  },
  concludeButtonCompact: {
    minHeight: 24,
    paddingHorizontal: 10
  },
  concludeButtonDone: {
    backgroundColor: '#E8F5EE',
    borderWidth: 1,
    borderColor: '#BDE1CC'
  },
  concludeButtonText: {
    color: colors.onPrimary,
    fontFamily: 'Inter_700Bold',
    fontSize: 11
  },
  concludeButtonTextDone: {
    color: '#1F7E4F'
  },
  concludeButtonTextCompact: {
    fontSize: 10
  },
  moreButton: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D9E3F2',
    backgroundColor: '#F3F7FD',
    alignItems: 'center',
    justifyContent: 'center'
  },
  moreButtonIcon: {
    marginTop: -1
  },
  shareQuickButton: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D2E0F5',
    backgroundColor: '#EEF4FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shareSheetCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE6F2',
    backgroundColor: '#FFFFFF',
    padding: spacing.sm,
    gap: spacing.xs
  },
  shareSheetTaskTitle: {
    color: '#1C304D',
    fontFamily: 'Inter_700Bold',
    fontSize: 15
  },
  shareSheetTaskHint: {
    color: '#72839A',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  shareSheetEmptyCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E3EAF4',
    backgroundColor: '#F9FBFF',
    padding: spacing.sm,
    gap: spacing.xs
  },
  shareSheetEmptyTitle: {
    color: '#2A3C55',
    fontFamily: 'Inter_700Bold',
    fontSize: 13
  },
  shareSheetEmptyText: {
    color: '#73849B',
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    lineHeight: 16
  },
  shareSheetEmptyActions: {
    flexDirection: 'row',
    gap: spacing.xs
  },
  shareSheetSecondaryAction: {
    flex: 1,
    minHeight: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D1DBEA',
    backgroundColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shareSheetSecondaryActionText: {
    color: '#3B5275',
    fontFamily: 'Inter_700Bold',
    fontSize: 11
  },
  shareSheetPrimaryAction: {
    flex: 1,
    minHeight: 34,
    borderRadius: radius.pill,
    backgroundColor: '#0D458F',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shareSheetPrimaryActionText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 11
  },
  shareGroupsList: {
    gap: 8
  },
  shareGroupItem: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DDE6F3',
    backgroundColor: '#F8FBFF',
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  shareGroupIconWrap: {
    width: 30,
    height: 30,
    borderRadius: radius.md,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shareGroupTexts: {
    flex: 1
  },
  shareGroupName: {
    color: '#213A5F',
    fontFamily: 'Inter_700Bold',
    fontSize: 13
  },
  shareGroupMeta: {
    marginTop: 1,
    color: '#7A8CA4',
    fontFamily: 'Inter_500Medium',
    fontSize: 10
  },
  taskActionsSheetCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE6F2',
    backgroundColor: '#FFFFFF',
    padding: spacing.sm,
    gap: spacing.xs
  },
  taskActionsSheetTitle: {
    color: '#1A2C45',
    fontFamily: 'Inter_700Bold',
    fontSize: 15
  },
  taskActionsSheetSubtitle: {
    color: '#73849B',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  taskActionsList: {
    marginTop: 4,
    gap: 8
  },
  taskActionItem: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DEE6F2',
    backgroundColor: '#F7FAFF',
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  taskActionItemDanger: {
    borderColor: '#F2D4D4',
    backgroundColor: '#FFF3F3'
  },
  taskActionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: '#E6EFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  taskActionIconWrapDanger: {
    backgroundColor: '#FDE7E7'
  },
  taskActionLabel: {
    color: '#233A5B',
    fontFamily: 'Inter_700Bold',
    fontSize: 13
  },
  taskActionLabelDanger: {
    color: '#A63A3A',
    fontFamily: 'Inter_700Bold',
    fontSize: 13
  },
  selectedHint: {
    fontFamily: 'Inter_600SemiBold',
    color: '#0A3D9F',
    fontSize: 11,
    marginTop: -2
  },
  promoCard: {
    borderRadius: 12,
    paddingHorizontal: cardSpace.spaciousX,
    paddingVertical: cardSpace.spaciousY,
    gap: spacing.xs
  },
  promoTitle: {
    color: colors.onPrimary,
    fontFamily: 'Manrope_700Bold',
    fontSize: 21,
    lineHeight: 24
  },
  promoText: {
    color: '#BCD1FF',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17
  },
  promoProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4
  },
  promoProgressTrack: {
    flex: 1,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.24)',
    overflow: 'hidden'
  },
  promoProgressFill: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF'
  },
  promoProgressValue: {
    color: '#E7EEFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    minWidth: 38,
    textAlign: 'right'
  },
  promoButton: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    minHeight: 30,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceLowest,
    justifyContent: 'center',
    marginTop: 2
  },
  promoButtonText: {
    color: '#042D76',
    fontFamily: 'Inter_700Bold',
    fontSize: 11
  },
  empty: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.xl
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    color: colors.muted,
    textAlign: 'center'
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: radius.md,
    backgroundColor: DARK_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#062E77',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8
  },
  fabIcon: {
    marginTop: -1
  }
});
