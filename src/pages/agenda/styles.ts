import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/constants/tokens';

const cardSpace = {
  compactX: spacing.sm,
  compactY: spacing.xs + 2,
  regularX: spacing.sm + 2,
  regularY: spacing.sm + 2,
  spaciousX: spacing.sm + 4,
  spaciousY: spacing.sm + 4
} as const;
const DARK_BLUE = '#072C78';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  screen: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.surface
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
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  monthTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#102A57',
    fontSize: 18
  },
  monthAction: {
    fontFamily: 'Inter_600SemiBold',
    color: '#2854A6',
    fontSize: 12
  },
  calendarCard: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E5EAF1',
    paddingVertical: cardSpace.regularY,
    paddingHorizontal: cardSpace.regularX,
    gap: spacing.xs
  },
  registeredCard: {
    backgroundColor: '#F7FAFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DBE6F4',
    paddingVertical: cardSpace.regularY,
    paddingHorizontal: cardSpace.regularX,
    gap: spacing.xs
  },
  registeredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  registeredTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#17355F',
    fontSize: 13
  },
  registeredMeta: {
    fontFamily: 'Inter_600SemiBold',
    color: '#6680A5',
    fontSize: 11
  },
  registeredHint: {
    color: '#647D9E',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  registerWeekdaysRow: {
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  registerWeekdayChip: {
    width: 42,
    minHeight: 32,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#E1E8F1',
    backgroundColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  registerWeekdayChipActive: {
    backgroundColor: DARK_BLUE,
    borderColor: DARK_BLUE
  },
  registerWeekdayChipText: {
    fontFamily: 'Inter_500Medium',
    color: '#324863',
    fontSize: 10,
    letterSpacing: 0.5
  },
  registerWeekdayChipTextActive: {
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF'
  },
  registerWeekdayHelper: {
    color: '#6A7F9E',
    fontFamily: 'Inter_500Medium',
    fontSize: 10
  },
  weekHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  weekHeaderText: {
    width: 42,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    color: '#929AA6',
    fontSize: 9,
    letterSpacing: 0.5
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dayButton: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F6F9'
  },
  dayButtonActive: {
    backgroundColor: DARK_BLUE
  },
  dayButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#4A5567',
    fontSize: 12
  },
  dayButtonTextActive: {
    color: colors.onPrimary
  },
  dayCountBadge: {
    position: 'absolute',
    right: 2,
    top: 2,
    minWidth: 14,
    height: 14,
    borderRadius: radius.pill,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E64040'
  },
  dayCountBadgeActive: {
    backgroundColor: '#FFFFFF'
  },
  dayCountBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: '#FFFFFF',
    lineHeight: 10
  },
  dayCountBadgeTextActive: {
    color: '#123C90'
  },
  studyCard: {
    borderRadius: radius.md,
    paddingVertical: cardSpace.spaciousY,
    paddingHorizontal: cardSpace.spaciousX,
    gap: spacing.xs
  },
  studyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  studyLabel: {
    fontFamily: 'Inter_600SemiBold',
    color: '#9EC0FF',
    fontSize: 10,
    letterSpacing: 0.6
  },
  studyBadge: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  studyBadgeIcon: {
    marginTop: -1
  },
  studyTime: {
    fontFamily: 'Manrope_700Bold',
    color: colors.onPrimary,
    fontSize: 38,
    lineHeight: 40
  },
  studyMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  studyMetaLabel: {
    color: '#C4D8FF',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  studyMetaValue: {
    color: '#E3ECFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 12
  },
  studyTrack: {
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden'
  },
  studyFill: {
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: '#12C97A'
  },
  studyHint: {
    color: '#B5CCFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    lineHeight: 14
  },
  sectionTitle: {
    fontFamily: 'Manrope_700Bold',
    color: '#1B2B45',
    fontSize: 23
  },
  commitmentCard: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E6EAF0',
    paddingHorizontal: cardSpace.regularX,
    paddingVertical: cardSpace.regularY,
    borderLeftWidth: 3,
    gap: 4
  },
  commitmentCardCompleted: {
    backgroundColor: '#F7F9FC',
    borderColor: '#DDE5F0',
    opacity: 0.82
  },
  provaTone: {
    borderLeftColor: '#EA4242'
  },
  trabalhoTone: {
    borderLeftColor: '#20C781'
  },
  atividadeTone: {
    borderLeftColor: '#2563EB'
  },
  leituraTone: {
    borderLeftColor: '#E6B800'
  },
  commitmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  commitmentDoneBadge: {
    borderRadius: radius.pill,
    minHeight: 18,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: '#C1E7D2',
    backgroundColor: '#E7F6EE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  commitmentDoneBadgeText: {
    fontFamily: 'Inter_700Bold',
    color: '#1B8E54',
    fontSize: 8,
    letterSpacing: 0.35
  },
  typeBadge: {
    borderRadius: radius.pill,
    minHeight: 18,
    paddingHorizontal: 8,
    justifyContent: 'center'
  },
  badgeProva: {
    backgroundColor: '#FFE8E6'
  },
  badgeTrabalho: {
    backgroundColor: '#DDFBE8'
  },
  badgeAtividade: {
    backgroundColor: '#E8F0FF'
  },
  badgeLeitura: {
    backgroundColor: '#FFF4CC'
  },
  typeBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: '#334A68',
    letterSpacing: 0.5
  },
  commitmentTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#1E2D43',
    fontSize: 17,
    lineHeight: 20
  },
  commitmentTitleCompleted: {
    color: '#5F6978',
    textDecorationLine: 'line-through'
  },
  commitmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commitmentMeta: {
    color: '#8A929F',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  commitmentMetaCompleted: {
    color: '#98A1AE'
  },
  commitmentMoreIcon: {
    marginRight: -2
  },
  emptyCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E6EAF0',
    backgroundColor: colors.surfaceLowest,
    paddingVertical: cardSpace.regularY,
    paddingHorizontal: cardSpace.regularX
  },
  emptyTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#1F2C40',
    fontSize: 16
  },
  emptySubtitle: {
    color: '#778091',
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
    fontSize: 12
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
  },
  monthPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  monthPickerNavButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: '#E8EEF8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  monthPickerLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#16305F'
  },
  monthPickerWeekHeaderRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  monthPickerWeekHeaderText: {
    width: 40,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    color: '#8B95A3',
    fontSize: 10,
    letterSpacing: 0.5
  },
  monthPickerGrid: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
    columnGap: 6,
    justifyContent: 'space-between'
  },
  monthPickerDay: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: '#F2F5FA',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  monthPickerDayMuted: {
    opacity: 0.42
  },
  monthPickerDayActive: {
    backgroundColor: DARK_BLUE
  },
  monthPickerDayText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#43536A',
    fontSize: 12
  },
  monthPickerDayTextMuted: {
    color: '#768298'
  },
  monthPickerDayTextActive: {
    color: '#FFFFFF'
  },
  monthPickerDayBadge: {
    position: 'absolute',
    right: 1,
    top: 1,
    minWidth: 14,
    height: 14,
    borderRadius: radius.pill,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E64040'
  },
  monthPickerDayBadgeActive: {
    backgroundColor: '#FFFFFF'
  },
  monthPickerDayBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    lineHeight: 10,
    color: '#FFFFFF'
  },
  monthPickerDayBadgeTextActive: {
    color: '#123C90'
  },
  weekdayModalList: {
    gap: spacing.xs
  },
  weekdayModalItem: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE8F5',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: cardSpace.regularX,
    paddingVertical: cardSpace.regularY,
    gap: spacing.xs
  },
  weekdayModalItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  weekdayModalDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill
  },
  weekdayModalSubject: {
    flex: 1,
    color: '#1D2E46',
    fontFamily: 'Inter_700Bold',
    fontSize: 14
  },
  weekdayModalTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  weekdayModalTime: {
    color: '#446189',
    fontFamily: 'Inter_500Medium',
    fontSize: 12
  },
  weekdayModalEmptyCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E1E8F4',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: cardSpace.regularX,
    paddingVertical: cardSpace.regularY,
    gap: spacing.xs
  },
  weekdayModalEmptyTitle: {
    color: '#20324C',
    fontFamily: 'Inter_700Bold',
    fontSize: 14
  },
  weekdayModalEmptyText: {
    color: '#6C7F99',
    fontFamily: 'Inter_500Medium',
    fontSize: 12
  },
});
