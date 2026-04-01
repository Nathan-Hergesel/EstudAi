import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/constants/tokens';

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
    borderColor: '#DFE4EA',
    backgroundColor: '#F9FAFC',
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#ECF3FF'
  },
  selectionText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#16386D',
    fontSize: 12
  },
  selectionAction: {
    fontFamily: 'Inter_700Bold',
    color: '#0B3EA4',
    fontSize: 12
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: 108,
    paddingTop: spacing.xs
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: 12,
    padding: 14,
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 4,
    opacity: 0.72,
    transform: [{ scale: 0.985 }]
  },
  cardCompletedCollapsed: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 2
  },
  cardSelected: {
    borderColor: '#0B3EA4'
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
  footerRowCollapsed: {
    marginTop: 1
  },
  concludeButton: {
    minHeight: 30,
    borderRadius: radius.sm,
    backgroundColor: '#072C78',
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
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center'
  },
  moreButtonIcon: {
    marginTop: -1
  },
  selectedHint: {
    fontFamily: 'Inter_600SemiBold',
    color: '#0A3D9F',
    fontSize: 11,
    marginTop: -2
  },
  promoCard: {
    borderRadius: 12,
    padding: spacing.md,
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
    backgroundColor: '#0A3D9F',
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
