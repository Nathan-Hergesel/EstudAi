import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/constants/tokens';

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
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs
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
    backgroundColor: '#0A3D9F'
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
    padding: spacing.sm,
    marginTop: spacing.xs,
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
    marginTop: spacing.sm,
    fontFamily: 'Manrope_700Bold',
    color: '#1B2B45',
    fontSize: 23
  },
  commitmentCard: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E6EAF0',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderLeftWidth: 3,
    gap: 4
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
  commitmentMoreIcon: {
    marginRight: -2
  },
  emptyCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E6EAF0',
    backgroundColor: colors.surfaceLowest,
    padding: spacing.md
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
  bottomStatsRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    gap: spacing.xs
  },
  bottomStatCard: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E7ECF2',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    minHeight: 78
  },
  bottomStatLabel: {
    color: '#A0A8B4',
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    letterSpacing: 0.8
  },
  bottomStatValue: {
    color: '#1D2B43',
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    lineHeight: 32,
    marginTop: 2
  },
  bottomStatHint: {
    color: '#2AB486',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9
  },
  bottomStatWarn: {
    color: '#DB4343',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9
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
    backgroundColor: '#0A3D9F'
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
});
