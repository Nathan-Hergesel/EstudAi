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
  heroLabel: {
    color: '#9EC0FF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.8
  },
  heroTitle: {
    color: '#FFFFFF',
    fontFamily: 'Manrope_700Bold',
    fontSize: 29,
    lineHeight: 33
  },
  heroPillsRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    gap: spacing.xs
  },
  heroPill: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    minHeight: 62,
    justifyContent: 'center'
  },
  heroPillValue: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    lineHeight: 24
  },
  heroPillLabel: {
    marginTop: 2,
    color: '#D8E5FF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10
  },
  sectionTitle: {
    marginTop: spacing.xs,
    color: '#1B2B45',
    fontFamily: 'Manrope_700Bold',
    fontSize: 23
  },
  groupsList: {
    gap: spacing.xs
  },
  groupCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E3E9F2',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs
  },
  groupTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  groupMainButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  groupOptionsButton: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D7E1F0',
    backgroundColor: '#F4F8FE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  groupIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  groupTexts: {
    flex: 1
  },
  groupNotificationBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: radius.pill,
    paddingHorizontal: 5,
    backgroundColor: '#E64040',
    alignItems: 'center',
    justifyContent: 'center'
  },
  groupNotificationBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    lineHeight: 11
  },
  groupName: {
    color: '#1C2C45',
    fontFamily: 'Inter_700Bold',
    fontSize: 14
  },
  groupDetails: {
    marginTop: 2,
    color: '#76839A',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  invitesList: {
    gap: spacing.xs
  },
  inviteCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F2',
    backgroundColor: '#F8FAFD',
    minHeight: 64,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  inviteText: {
    flex: 1,
    color: '#2A3D5A',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16
  },
  inviteAcceptButton: {
    minHeight: 28,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    backgroundColor: '#072C78',
    justifyContent: 'center'
  },
  inviteAcceptText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 11
  },
  createGroupButton: {
    marginTop: spacing.xs,
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: '#072C78',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs
  },
  createGroupText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 13
  },
  roomContainer: {
    flex: 1,
    backgroundColor: colors.surface
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E9F2',
    backgroundColor: '#FFFFFF'
  },
  roomBackButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  roomHeaderTexts: {
    flex: 1
  },
  roomHeaderTitle: {
    color: '#1B2C45',
    fontFamily: 'Inter_700Bold',
    fontSize: 15
  },
  roomHeaderSubtitle: {
    marginTop: 1,
    color: '#75849A',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  roomHeaderAction: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: '#EEF3FA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  roomHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  roomHeaderActionInvite: {
    borderWidth: 1,
    borderColor: '#CFE0F8',
    backgroundColor: '#EAF2FF'
  },
  roomScroll: {
    flex: 1
  },
  roomFeed: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.xs
  },
  roomDayDivider: {
    alignSelf: 'center',
    minHeight: 24,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    backgroundColor: '#E8EEF7',
    justifyContent: 'center',
    marginBottom: spacing.xs
  },
  roomDayDividerText: {
    color: '#4E6588',
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.4
  },
  roomTaskBubble: {
    maxWidth: '88%',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    gap: 6
  },
  roomTaskBubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#E3E9F2'
  },
  roomTaskBubbleMine: {
    alignSelf: 'flex-end',
    backgroundColor: '#EAF1FF',
    borderColor: '#CADBFD'
  },
  roomTaskSender: {
    color: '#456793',
    fontFamily: 'Inter_700Bold',
    fontSize: 10
  },
  roomTaskTitle: {
    color: '#1E2F47',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 18
  },
  roomTaskTitleMine: {
    color: '#133E7D'
  },
  roomTaskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  roomTaskTypeChip: {
    minHeight: 19,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    backgroundColor: '#EFF3F8',
    justifyContent: 'center'
  },
  roomTaskTypeChipMine: {
    backgroundColor: '#D8E5FF'
  },
  roomTaskTypeText: {
    color: '#33517C',
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    letterSpacing: 0.3
  },
  roomTaskTypeTextMine: {
    color: '#143E7A'
  },
  roomTaskDue: {
    color: '#7D8898',
    fontFamily: 'Inter_500Medium',
    fontSize: 10
  },
  roomTaskDueMine: {
    color: '#44669A'
  },
  roomTaskSaveButton: {
    alignSelf: 'flex-start',
    minHeight: 24,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    backgroundColor: '#072C78',
    justifyContent: 'center'
  },
  roomTaskSaveText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 10
  },
  roomTaskMineHint: {
    color: '#3D6095',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10
  },
  roomEmptyCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F2',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: 2
  },
  roomEmptyTitle: {
    color: '#1E2F47',
    fontFamily: 'Inter_700Bold',
    fontSize: 14
  },
  roomEmptyText: {
    color: '#7A879B',
    fontFamily: 'Inter_500Medium',
    fontSize: 12
  },
  roomComposerWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E3E9F2',
    backgroundColor: '#FFFFFF'
  },
  roomComposerActionPrimary: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.md,
    backgroundColor: '#072C78',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  roomComposerActionPrimaryText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 12
  },
  roomComposerActionSecondary: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D5E0F0',
    backgroundColor: '#F2F7FF',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  roomComposerActionSecondaryText: {
    color: '#1E4F8F',
    fontFamily: 'Inter_700Bold',
    fontSize: 12
  },
  roomActionCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DEE6F2',
    backgroundColor: '#FFFFFF',
    padding: spacing.sm,
    gap: spacing.xs
  },
  roomActionTitle: {
    color: '#1A2F4B',
    fontFamily: 'Inter_700Bold',
    fontSize: 15
  },
  roomActionHint: {
    color: '#72839A',
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    lineHeight: 16
  },
  roomActionEmptyCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E1E8F3',
    backgroundColor: '#F8FBFF',
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm
  },
  roomActionEmptyText: {
    color: '#70839E',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    textAlign: 'center'
  },
  roomSelectableList: {
    gap: 8
  },
  roomSelectableItem: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE7F3',
    backgroundColor: '#F7FAFF',
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  roomSelectableItemSelected: {
    borderColor: '#BFD4F8',
    backgroundColor: '#E8F1FF'
  },
  roomSelectableCheck: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#B6C5DA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  roomSelectableCheckSelected: {
    borderColor: '#2159A8',
    backgroundColor: '#2159A8'
  },
  roomSelectableTexts: {
    flex: 1
  },
  roomSelectableTitle: {
    color: '#1D3557',
    fontFamily: 'Inter_700Bold',
    fontSize: 13
  },
  roomSelectableMeta: {
    marginTop: 1,
    color: '#71839E',
    fontFamily: 'Inter_500Medium',
    fontSize: 10
  },
  roomMeetingGrid: {
    flexDirection: 'row',
    gap: spacing.xs
  },
  roomMeetingCell: {
    flex: 1
  },
  groupEditCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DEE6F2',
    backgroundColor: '#FFFFFF',
    padding: spacing.sm,
    gap: spacing.xs
  },
  groupInviteAddButton: {
    alignSelf: 'flex-start',
    minHeight: 30,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#CADAF4',
    backgroundColor: '#EDF4FF',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  groupInviteAddButtonText: {
    color: '#0F4DAF',
    fontFamily: 'Inter_700Bold',
    fontSize: 11
  },
  groupInviteHelperText: {
    color: '#6F7F95',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  groupInviteEmailsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  groupInviteEmailChip: {
    maxWidth: '100%',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D7E3F6',
    backgroundColor: '#F4F8FF',
    minHeight: 28,
    paddingLeft: 10,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  groupInviteEmailChipText: {
    color: '#294A78',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    flexShrink: 1
  },
  groupInviteErrorText: {
    color: '#C13A3A',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  groupMembersList: {
    gap: 8
  },
  groupMemberItem: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE7F2',
    backgroundColor: '#F7FAFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs
  },
  groupMemberIdentity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  groupMemberAvatar: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: '#E9F0FC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  groupMemberTexts: {
    flex: 1,
    gap: 1
  },
  groupMemberName: {
    color: '#1E324F',
    fontFamily: 'Inter_700Bold',
    fontSize: 12
  },
  groupMemberEmail: {
    color: '#6E809C',
    fontFamily: 'Inter_500Medium',
    fontSize: 10
  },
  groupMemberRoleChip: {
    minHeight: 22,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D4DFEE',
    backgroundColor: '#EDF3FC',
    paddingHorizontal: 9,
    justifyContent: 'center'
  },
  groupMemberRoleChipOwner: {
    borderColor: '#CADCF8',
    backgroundColor: '#E4EEFF'
  },
  groupMemberRoleText: {
    color: '#5A7398',
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.3
  },
  groupMemberRoleTextOwner: {
    color: '#1D4F90'
  }
});
