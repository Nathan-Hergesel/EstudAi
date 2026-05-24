import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { CriarGrupoModal } from '@/components/CriarGrupoModal';
import { supabase } from '@/config/supabase.config';
import { ActionPopup } from '@/components/ui/ActionPopup';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { useAuth } from '@/contexts/AuthContext';
import { styles } from '@/pages/grupos/styles';
import { supabaseService } from '@/services/supabase.service';
import { normalizeEmail, parseEmailDraft } from '@/utils/email';
import {
  GrupoDoUsuario,
  GrupoMembroDetalhado,
  ReuniaoGrupoCompleta,
  TarefaCompartilhadaCompleta,
  TarefaCompleta
} from '@/types/database.types';

type GroupTask = {
  id: string;
  groupId: string;
  title: string;
  owner: string;
  due: string;
  type: string;
  mine: boolean;
  saved: boolean;
  completed: boolean;
  source: TarefaCompartilhadaCompleta;
};

type MeetingFeedItem = {
  id: string;
  title: string;
  details: string;
  at: string;
  groupId: string;
  createdBy: string;
  groupOwnerId: string;
};

type RoomActionMode = 'share-task' | 'meeting' | null;

const pad = (value: number): string => `${value}`.padStart(2, '0');

const formatDateTime = (raw: string): string => {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatDateInput = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const GruposPage = () => {
  const { user } = useAuth();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groups, setGroups] = useState<GrupoDoUsuario[]>([]);
  const [sharedByGroup, setSharedByGroup] = useState<Record<string, TarefaCompartilhadaCompleta[]>>({});
  const [meetingsByGroup, setMeetingsByGroup] = useState<Record<string, ReuniaoGrupoCompleta[]>>({});
  const [savedSharedIds, setSavedSharedIds] = useState<Record<string, boolean>>({});
  const [availableTasks, setAvailableTasks] = useState<TarefaCompleta[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingAvailableTasks, setLoadingAvailableTasks] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const [editingGroup, setEditingGroup] = useState<GrupoDoUsuario | null>(null);
  const [groupActionsTarget, setGroupActionsTarget] = useState<GrupoDoUsuario | null>(null);
  const [deleteGroupTarget, setDeleteGroupTarget] = useState<GrupoDoUsuario | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [savingGroupChanges, setSavingGroupChanges] = useState(false);

  const [invitingMembersGroup, setInvitingMembersGroup] = useState<GrupoDoUsuario | null>(null);
  const [inviteEmailDraft, setInviteEmailDraft] = useState('');
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteError, setInviteError] = useState('');
  const [sendingInvites, setSendingInvites] = useState(false);

  const [membersListGroup, setMembersListGroup] = useState<GrupoDoUsuario | null>(null);
  const [loadingGroupMembers, setLoadingGroupMembers] = useState(false);
  const [groupMembers, setGroupMembers] = useState<GrupoMembroDetalhado[]>([]);
  const [groupMembersError, setGroupMembersError] = useState('');

  const [leavingGroupId, setLeavingGroupId] = useState<string | null>(null);
  const [deletingMeetingId, setDeletingMeetingId] = useState<string | null>(null);

  const [roomActionMode, setRoomActionMode] = useState<RoomActionMode>(null);
  const [roomActionBusy, setRoomActionBusy] = useState(false);
  const [selectedShareTasks, setSelectedShareTasks] = useState<Record<string, boolean>>({});
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [meetingDate, setMeetingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateInput(tomorrow);
  });
  const [meetingTime, setMeetingTime] = useState('19:00');

  // ── Data loading ──────────────────────────────────────────────

  const loadData = useCallback(async () => {
    if (!user?.id) {
      setGroups([]);
      setSharedByGroup({});
      setMeetingsByGroup({});
      setSavedSharedIds({});
      return;
    }

    setLoading(true);

    const groupsResult = await supabaseService.listarGruposDoUsuario(user.id);
    if (!groupsResult.success) {
      setGroups([]);
      setSharedByGroup({});
      setMeetingsByGroup({});
      setSavedSharedIds({});
      setLoading(false);
      return;
    }

    const currentGroups = groupsResult.data || [];
    setGroups(currentGroups);

    const [savedResult, sharedResults, meetingsResults] = await Promise.all([
      supabaseService.listarTarefasSalvasDoUsuario(user.id),
      Promise.all(currentGroups.map((g) => supabaseService.listarTarefasCompartilhadasDoGrupo(g.grupo_id))),
      Promise.all(currentGroups.map((g) => supabaseService.listarReunioesGrupo(g.grupo_id)))
    ]);

    const nextSaved: Record<string, boolean> = {};
    if (savedResult.success) {
      (savedResult.data || []).forEach((item) => { nextSaved[item.tarefa_compartilhada_id] = true; });
    }

    const nextSharedByGroup: Record<string, TarefaCompartilhadaCompleta[]> = {};
    const nextMeetingsByGroup: Record<string, ReuniaoGrupoCompleta[]> = {};

    currentGroups.forEach((group, index) => {
      nextSharedByGroup[group.grupo_id] = sharedResults[index]?.success ? sharedResults[index].data || [] : [];
      nextMeetingsByGroup[group.grupo_id] = meetingsResults[index]?.success ? meetingsResults[index].data || [] : [];
    });

    setSavedSharedIds(nextSaved);
    setSharedByGroup(nextSharedByGroup);
    setMeetingsByGroup(nextMeetingsByGroup);
    setLoading(false);
  }, [user?.id]);

  const loadAvailableTasks = useCallback(async () => {
    if (!user?.id) { setAvailableTasks([]); return; }

    setLoadingAvailableTasks(true);
    const result = await supabaseService.listarTarefas(user.id);
    if (!result.success) { setAvailableTasks([]); setLoadingAvailableTasks(false); return; }

    const ordered = [...(result.data || [])].sort(
      (a, b) => new Date(a.data_entrega).getTime() - new Date(b.data_entrega).getTime()
    );
    setAvailableTasks(ordered);
    setLoadingAvailableTasks(false);
  }, [user?.id]);

  useEffect(() => { void loadData(); }, [loadData]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`grupos-realtime-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tarefas_compartilhadas_grupo' }, () => { void loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tarefas_salvas_grupo' }, () => { void loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reunioes_grupo' }, () => { void loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'grupos_membros' }, () => { void loadData(); })
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [loadData, user?.id]);

  // ── Derived state ─────────────────────────────────────────────

  const selectedGroup = useMemo(
    () => groups.find((g) => g.grupo_id === selectedGroupId) ?? null,
    [groups, selectedGroupId]
  );

  const groupTasksById = useMemo(() => {
    const mapped: Record<string, GroupTask[]> = {};
    groups.forEach((group) => {
      mapped[group.grupo_id] = (sharedByGroup[group.grupo_id] || []).map((item) => {
        const mine = item.compartilhado_por === user?.id;
        return {
          id: item.id,
          groupId: group.grupo_id,
          title: item.titulo,
          owner: mine ? 'Você' : item.compartilhado_por_nome || 'Integrante',
          due: formatDateTime(item.data_entrega),
          type: item.tipo.toUpperCase(),
          mine,
          saved: !mine && Boolean(savedSharedIds[item.id]),
          completed: item.completed,
          source: item
        };
      });
    });
    return mapped;
  }, [groups, sharedByGroup, user?.id, savedSharedIds]);

  const meetingsFeed = useMemo<MeetingFeedItem[]>(
    () =>
      groups
        .flatMap((group) =>
          (meetingsByGroup[group.grupo_id] || []).map((meeting) => ({
            id: meeting.id,
            title: meeting.titulo,
            details: `${group.nome} · ${formatDateTime(meeting.data_reuniao)}`,
            at: meeting.data_reuniao,
            groupId: group.grupo_id,
            createdBy: meeting.criado_por,
            groupOwnerId: group.owner_id
          }))
        )
        .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
        .slice(0, 4),
    [groups, meetingsByGroup]
  );

  const inviteEmailsDeduplicated = useMemo(
    () => Array.from(new Set(inviteEmails.map(normalizeEmail))),
    [inviteEmails]
  );

  const groupNotificationsById = useMemo(() => {
    const now = new Date();
    const upcomingLimit = new Date(now);
    upcomingLimit.setDate(now.getDate() + 7);

    const mapped: Record<string, number> = {};
    groups.forEach((group) => {
      const pendingShared = (groupTasksById[group.grupo_id] || []).filter(
        (task) => !task.mine && !task.saved
      ).length;

      const upcomingMeetings = (meetingsByGroup[group.grupo_id] || []).filter((meeting) => {
        const meetingAt = new Date(meeting.data_reuniao);
        return !Number.isNaN(meetingAt.getTime()) && meetingAt >= now && meetingAt <= upcomingLimit;
      }).length;

      mapped[group.grupo_id] = pendingShared + upcomingMeetings;
    });
    return mapped;
  }, [groupTasksById, groups, meetingsByGroup]);

  // ── Group actions ─────────────────────────────────────────────

  const createGroup = async (payload: { nome: string; emails: string[] }) => {
    if (!user?.id) return { success: false, error: 'Faça login para criar grupos.' };

    setCreatingGroup(true);
    const result = await supabaseService.criarGrupoEstudo({ nome: payload.nome, descricao: null });

    if (!result.success) {
      setCreatingGroup(false);
      return { success: false, error: result.error || 'Não foi possível criar o grupo.' };
    }

    let resumoConvites = '';
    const createdGroupId = result.data?.id;

    if (createdGroupId && payload.emails.length > 0) {
      const conviteResult = await supabaseService.convidarMembrosPorEmail(createdGroupId, payload.emails);
      if (!conviteResult.success) {
        resumoConvites = 'Grupo criado, mas não foi possível processar os convites por email.';
      } else {
        resumoConvites = buildInviteSummary(conviteResult.data || []);
      }
    }

    await loadData();
    setCreatingGroup(false);
    setShowCreateModal(false);
    Alert.alert('Grupos', resumoConvites ? `Grupo criado com sucesso.\n${resumoConvites}` : 'Grupo criado com sucesso.');
    return { success: true };
  };

  const submitGroupEdit = async () => {
    if (!editingGroup) return;
    setSavingGroupChanges(true);

    const result = await supabaseService.atualizarGrupoEstudo(editingGroup.grupo_id, {
      nome: editGroupName,
      descricao: null
    });

    if (!result.success) {
      setSavingGroupChanges(false);
      Alert.alert('Grupos', result.error || 'Não foi possível editar o grupo.');
      return;
    }

    await loadData();
    setSavingGroupChanges(false);
    setEditingGroup(null);
    Alert.alert('Grupos', 'Grupo atualizado com sucesso.');
  };

  const executeDeleteGroup = async () => {
    if (!deleteGroupTarget) return;
    const group = deleteGroupTarget;
    setDeleteGroupTarget(null);

    const result = await supabaseService.removerGrupoEstudo(group.grupo_id);
    if (!result.success) {
      Alert.alert('Grupos', result.error || 'Não foi possível excluir o grupo.');
      return;
    }

    if (selectedGroupId === group.grupo_id) setSelectedGroupId(null);
    await loadData();
    Alert.alert('Grupos', 'Grupo excluído com sucesso.');
  };

  const executeLeaveGroup = async (group: GrupoDoUsuario) => {
    if (!user?.id || leavingGroupId) return;
    setLeavingGroupId(group.grupo_id);

    const result = await supabaseService.sairDoGrupo(group.grupo_id, user.id);
    setLeavingGroupId(null);

    if (!result.success) {
      Alert.alert('Grupos', result.error || 'Não foi possível sair do grupo.');
      return;
    }

    if (selectedGroupId === group.grupo_id) setSelectedGroupId(null);
    await loadData();
    Alert.alert('Grupos', 'Você saiu do grupo com sucesso.');
  };

  const confirmLeaveGroup = (group: GrupoDoUsuario) => {
    Alert.alert('Sair do grupo', `Deseja sair de "${group.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => { void executeLeaveGroup(group); } }
    ]);
  };

  // ── Invite members ────────────────────────────────────────────

  const openInviteMembersModal = (group: GrupoDoUsuario) => {
    setGroupActionsTarget(null);
    setInvitingMembersGroup(group);
    setInviteEmailDraft('');
    setInviteEmails([]);
    setInviteError('');
  };

  const closeInviteMembersModal = () => {
    if (sendingInvites) return;
    setInvitingMembersGroup(null);
    setInviteEmailDraft('');
    setInviteEmails([]);
    setInviteError('');
  };

  const addInviteEmailsFromDraft = () => {
    const parsed = parseEmailDraft(inviteEmailDraft, true);
    if (parsed.error) { setInviteError(parsed.error); return; }
    setInviteEmails((prev) => [...prev, ...parsed.emails]);
    setInviteEmailDraft('');
    setInviteError('');
  };

  const removeInviteEmail = (email: string) => {
    setInviteEmails((prev) => prev.filter((item) => item !== email));
  };

  const submitInvites = async () => {
    if (!invitingMembersGroup) return;

    const parsedDraft = parseEmailDraft(inviteEmailDraft, false);
    if (parsedDraft.error) { setInviteError(parsedDraft.error); return; }

    const emailsToSend = Array.from(
      new Set([...inviteEmailsDeduplicated, ...parsedDraft.emails].map(normalizeEmail))
    );

    if (emailsToSend.length === 0) {
      setInviteError('Adicione pelo menos um e-mail para convidar.');
      return;
    }

    setSendingInvites(true);
    setInviteError('');

    const conviteResult = await supabaseService.convidarMembrosPorEmail(
      invitingMembersGroup.grupo_id,
      emailsToSend
    );

    setSendingInvites(false);

    if (!conviteResult.success) {
      setInviteError(conviteResult.error || 'Não foi possível enviar convites.');
      return;
    }

    const summary = buildInviteSummary(conviteResult.data || []);
    closeInviteMembersModal();
    await loadData();
    Alert.alert('Convites', summary || 'Convites processados.');
  };

  // ── Members list ──────────────────────────────────────────────

  const openMembersListModal = async (group: GrupoDoUsuario) => {
    setMembersListGroup(group);
    setLoadingGroupMembers(true);
    setGroupMembers([]);
    setGroupMembersError('');

    const result = await supabaseService.listarIntegrantesGrupo(group.grupo_id);
    if (!result.success) {
      setLoadingGroupMembers(false);
      setGroupMembersError(result.error || 'Não foi possível carregar a lista de integrantes.');
      return;
    }

    const members = result.data || [];
    setGroupMembers(members);
    setLoadingGroupMembers(false);
    if (members.length === 0) setGroupMembersError('Nenhum integrante encontrado para este grupo.');
  };

  const closeMembersListModal = () => {
    setMembersListGroup(null);
    setLoadingGroupMembers(false);
    setGroupMembers([]);
    setGroupMembersError('');
  };

  // ── Meetings ──────────────────────────────────────────────────

  const executeDeleteMeeting = async (meeting: MeetingFeedItem) => {
    if (deletingMeetingId) return;
    setDeletingMeetingId(meeting.id);

    const result = await supabaseService.removerReuniaoGrupo(meeting.id);
    setDeletingMeetingId(null);

    if (!result.success) {
      Alert.alert('Reuniões', result.error || 'Não foi possível excluir a reunião.');
      return;
    }

    await loadData();
    Alert.alert('Reuniões', 'Reunião excluída com sucesso.');
  };

  const confirmDeleteMeeting = (meeting: MeetingFeedItem) => {
    Alert.alert('Excluir reunião', `Deseja excluir "${meeting.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { void executeDeleteMeeting(meeting); } }
    ]);
  };

  // ── Room actions ──────────────────────────────────────────────

  const openShareTaskAction = () => {
    setRoomActionMode('share-task');
    setSelectedShareTasks({});
    void loadAvailableTasks();
  };

  const openMeetingAction = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMeetingTitle('');
    setMeetingDescription('');
    setMeetingDate(formatDateInput(tomorrow));
    setMeetingTime('19:00');
    setRoomActionMode('meeting');
  };

  const closeRoomActionModal = () => {
    if (roomActionBusy) return;
    setRoomActionMode(null);
    setSelectedShareTasks({});
  };

  const toggleShareTask = (taskId: string) => {
    setSelectedShareTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const submitShareTasks = async () => {
    if (!selectedGroup || !user?.id) return;

    const taskIds = Object.keys(selectedShareTasks).filter((id) => selectedShareTasks[id]);
    if (taskIds.length === 0) {
      Alert.alert('Compartilhar tarefa', 'Selecione pelo menos uma tarefa para compartilhar.');
      return;
    }

    setRoomActionBusy(true);

    const results = await Promise.all(
      taskIds.map((taskId) =>
        supabaseService.compartilharTarefaComGrupo({
          grupo_id: selectedGroup.grupo_id,
          tarefa_id: taskId,
          compartilhado_por: user.id
        })
      )
    );

    let enviadas = 0;
    let duplicadas = 0;
    let falhas = 0;

    results.forEach((result) => {
      if (result.success) { enviadas += 1; return; }
      const rawError = (result.error || '').toLowerCase();
      if (rawError.includes('duplicate') || rawError.includes('unique')) { duplicadas += 1; return; }
      falhas += 1;
    });

    await loadData();
    setRoomActionBusy(false);
    setRoomActionMode(null);
    setSelectedShareTasks({});

    const resumo: string[] = [];
    if (enviadas > 0) resumo.push(`${enviadas} enviada(s)`);
    if (duplicadas > 0) resumo.push(`${duplicadas} duplicada(s)`);
    if (falhas > 0) resumo.push(`${falhas} com falha`);

    Alert.alert('Compartilhar tarefa', resumo.length > 0 ? resumo.join(' | ') : 'Nenhuma tarefa compartilhada.');
  };

  const submitMeeting = async () => {
    if (!selectedGroup || !user?.id) return;

    const titulo = meetingTitle.trim();
    if (!titulo) { Alert.alert('Marcar reunião', 'Informe um título para a reunião.'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meetingDate)) { Alert.alert('Marcar reunião', 'Data inválida. Use o formato AAAA-MM-DD.'); return; }
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(meetingTime)) { Alert.alert('Marcar reunião', 'Hora inválida. Use o formato HH:MM.'); return; }

    const meetingDateTime = new Date(`${meetingDate}T${meetingTime}:00`);
    if (Number.isNaN(meetingDateTime.getTime())) {
      Alert.alert('Marcar reunião', 'Não foi possível interpretar data e hora.');
      return;
    }

    setRoomActionBusy(true);

    const result = await supabaseService.criarReuniaoGrupo({
      grupo_id: selectedGroup.grupo_id,
      criado_por: user.id,
      titulo,
      descricao: meetingDescription.trim() || null,
      data_reuniao: meetingDateTime.toISOString()
    });

    if (!result.success) {
      setRoomActionBusy(false);
      Alert.alert('Marcar reunião', result.error || 'Não foi possível marcar a reunião.');
      return;
    }

    await loadData();
    setRoomActionBusy(false);
    setRoomActionMode(null);
    Alert.alert('Marcar reunião', 'Reunião marcada com sucesso.');
  };

  const saveSharedTask = async (task: GroupTask) => {
    if (!user?.id) { Alert.alert('Aviso', 'Faça login para salvar tarefas compartilhadas.'); return; }
    if (savedSharedIds[task.id]) return;

    const saveResult = await supabaseService.salvarTarefaCompartilhada({
      tarefa_compartilhada_id: task.id,
      user_id: user.id
    });

    if (!saveResult.success) {
      Alert.alert('Salvar tarefa', saveResult.error || 'Não foi possível salvar esta tarefa.');
      return;
    }

    const createResult = await supabaseService.criarTarefa({
      user_id: user.id,
      materia_id: null,
      tipo: task.source.tipo,
      dificuldade: 'Medio',
      titulo: task.source.titulo,
      descricao: task.source.descricao,
      data_entrega: task.source.data_entrega,
      completed: false
    });

    Alert.alert(
      'Salvar tarefa',
      createResult.success
        ? 'Tarefa salva na sua lista com sucesso.'
        : 'A tarefa foi marcada como salva, mas não entrou na sua lista.'
    );

    setSavedSharedIds((prev) => ({ ...prev, [task.id]: true }));
  };

  // ── Render ────────────────────────────────────────────────────

  const roomTasks = selectedGroup ? (groupTasksById[selectedGroup.grupo_id] || []) : [];

  return (
    <View style={styles.pageRoot}>

      {/* ══ ROOM VIEW ══════════════════════════════════════════ */}
      {selectedGroup ? (
        <View style={styles.roomContainer}>
          <View style={styles.roomHeader}>
            <Pressable style={styles.roomBackButton} onPress={() => setSelectedGroupId(null)}>
              <MaterialCommunityIcons name="chevron-left" size={20} color="#1D3F76" />
            </Pressable>

            <View style={styles.roomHeaderTexts}>
              <Text style={styles.roomHeaderTitle}>{selectedGroup.nome}</Text>
              <Text style={styles.roomHeaderSubtitle}>
                {selectedGroup.papel === 'owner' ? 'Você é dono' : 'Você é membro'}
              </Text>
            </View>

            <View style={styles.roomHeaderActions}>
              <Pressable style={styles.roomHeaderAction} onPress={() => void openMembersListModal(selectedGroup)}>
                <MaterialCommunityIcons name="account-group-outline" size={18} color="#325987" />
              </Pressable>

              {selectedGroup.papel === 'owner' ? (
                <Pressable
                  style={[styles.roomHeaderAction, styles.roomHeaderActionInvite]}
                  onPress={() => openInviteMembersModal(selectedGroup)}
                >
                  <MaterialCommunityIcons name="account-plus-outline" size={18} color="#1D4F90" />
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.roomHeaderAction, styles.roomHeaderActionLeave]}
                  onPress={() => confirmLeaveGroup(selectedGroup)}
                  disabled={leavingGroupId === selectedGroup.grupo_id}
                >
                  <MaterialCommunityIcons name="logout-variant" size={17} color="#A34141" />
                </Pressable>
              )}
            </View>
          </View>

          <ScrollView style={styles.roomScroll} contentContainerStyle={styles.roomFeed} showsVerticalScrollIndicator={false}>
            <View style={styles.roomDayDivider}>
              <Text style={styles.roomDayDividerText}>Tarefas compartilhadas</Text>
            </View>

            {roomTasks.length === 0 ? (
              <View style={styles.roomEmptyCard}>
                <Text style={styles.roomEmptyTitle}>Nenhuma tarefa no grupo</Text>
                <Text style={styles.roomEmptyText}>Compartilhe a primeira tarefa para começar.</Text>
              </View>
            ) : (
              roomTasks.map((task) => (
                <View
                  key={task.id}
                  style={[styles.roomTaskBubble, task.mine ? styles.roomTaskBubbleMine : styles.roomTaskBubbleOther]}
                >
                  {!task.mine ? <Text style={styles.roomTaskSender}>{task.owner}</Text> : null}

                  <Text style={[styles.roomTaskTitle, task.mine && styles.roomTaskTitleMine]}>{task.title}</Text>

                  <View style={styles.roomTaskMetaRow}>
                    <View style={[styles.roomTaskTypeChip, task.mine && styles.roomTaskTypeChipMine]}>
                      <Text style={[styles.roomTaskTypeText, task.mine && styles.roomTaskTypeTextMine]}>{task.type}</Text>
                    </View>
                    <Text style={[styles.roomTaskDue, task.mine && styles.roomTaskDueMine]}>{task.due}</Text>
                    {task.completed ? (
                      <MaterialCommunityIcons name="check-circle" size={13} color={task.mine ? '#DCE7FF' : '#3A67A6'} />
                    ) : null}
                  </View>

                  {!task.mine ? (
                    task.saved ? (
                      <View style={styles.roomTaskSavedChip}>
                        <Text style={styles.roomTaskSavedText}>Salva</Text>
                      </View>
                    ) : (
                      <Pressable style={styles.roomTaskSaveButton} onPress={() => void saveSharedTask(task)}>
                        <Text style={styles.roomTaskSaveText}>Salvar</Text>
                      </Pressable>
                    )
                  ) : (
                    <Text style={styles.roomTaskMineHint}>{task.completed ? 'Tarefa concluída' : 'Enviada por você'}</Text>
                  )}
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.roomComposerWrap}>
            <Pressable style={styles.roomComposerActionPrimary} onPress={openShareTaskAction}>
              <MaterialCommunityIcons name="share-variant-outline" size={16} color="#FFFFFF" />
              <Text style={styles.roomComposerActionPrimaryText}>Compartilhar tarefa</Text>
            </Pressable>

            <Pressable style={styles.roomComposerActionSecondary} onPress={openMeetingAction}>
              <MaterialCommunityIcons name="calendar-plus" size={16} color="#1E4F8F" />
              <Text style={styles.roomComposerActionSecondaryText}>Marcar reunião</Text>
            </Pressable>
          </View>

          {/* Room-specific modal: share task or schedule meeting */}
          <ModalSheet
            visible={roomActionMode !== null}
            title={roomActionMode === 'share-task' ? 'Compartilhar tarefa' : 'Marcar reunião'}
            onClose={closeRoomActionModal}
          >
            {roomActionMode === 'share-task' ? (
              <View style={styles.roomActionCard}>
                <Text style={styles.roomActionTitle}>{selectedGroup.nome}</Text>
                <Text style={styles.roomActionHint}>Selecione as tarefas para enviar ao grupo.</Text>

                {loadingAvailableTasks ? (
                  <View style={styles.roomActionEmptyCard}>
                    <Text style={styles.roomActionEmptyText}>Carregando tarefas...</Text>
                  </View>
                ) : availableTasks.length === 0 ? (
                  <View style={styles.roomActionEmptyCard}>
                    <Text style={styles.roomActionEmptyText}>Você não possui tarefas para compartilhar.</Text>
                  </View>
                ) : (
                  <View style={styles.roomSelectableList}>
                    {availableTasks.map((task) => {
                      const isSelected = Boolean(selectedShareTasks[task.id]);
                      return (
                        <Pressable
                          key={task.id}
                          style={[styles.roomSelectableItem, isSelected && styles.roomSelectableItemSelected]}
                          onPress={() => toggleShareTask(task.id)}
                        >
                          <View style={[styles.roomSelectableCheck, isSelected && styles.roomSelectableCheckSelected]}>
                            {isSelected ? <MaterialCommunityIcons name="check" size={12} color="#FFFFFF" /> : null}
                          </View>
                          <View style={styles.roomSelectableTexts}>
                            <Text style={styles.roomSelectableTitle}>{task.titulo}</Text>
                            <Text style={styles.roomSelectableMeta}>
                              {`${formatDateTime(task.data_entrega)}${task.materia_nome ? ` · ${task.materia_nome}` : ''}`}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                )}

                <Button
                  title={roomActionBusy ? 'Enviando...' : 'Enviar para o grupo'}
                  onPress={() => void submitShareTasks()}
                  disabled={roomActionBusy || loadingAvailableTasks}
                />
              </View>
            ) : (
              <View style={styles.roomActionCard}>
                <Input label="Título da reunião" value={meetingTitle} onChangeText={setMeetingTitle} placeholder="Ex: Revisão para prova de cálculo" />
                <Input label="Descrição" value={meetingDescription} onChangeText={setMeetingDescription} placeholder="Tópicos e observações" multiline />

                <View style={styles.roomMeetingGrid}>
                  <View style={styles.roomMeetingCell}>
                    <Input label="Data" value={meetingDate} onChangeText={setMeetingDate} placeholder="2026-04-20" />
                  </View>
                  <View style={styles.roomMeetingCell}>
                    <Input label="Hora" value={meetingTime} onChangeText={setMeetingTime} placeholder="19:30" />
                  </View>
                </View>

                <Text style={styles.roomActionHint}>Use data no formato AAAA-MM-DD e hora no formato HH:MM.</Text>

                <Button
                  title={roomActionBusy ? 'Salvando...' : 'Marcar reunião no grupo'}
                  onPress={() => void submitMeeting()}
                  disabled={roomActionBusy}
                />
              </View>
            )}
          </ModalSheet>
        </View>

      ) : (

      /* ══ LIST VIEW ═════════════════════════════════════════ */
        <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>COLABORAÇÃO</Text>
            <Text style={styles.title}>Grupos de Estudo</Text>
          </View>

          <Text style={styles.sectionTitle}>Meus grupos</Text>

          {loading ? (
            <View style={styles.invitesList}>
              <View style={styles.inviteCard}>
                <Text style={styles.groupDetails}>Carregando grupos...</Text>
              </View>
            </View>
          ) : groups.length === 0 ? (
            <View style={styles.invitesList}>
              <View style={styles.inviteCard}>
                <View style={styles.groupTexts}>
                  <Text style={styles.groupName}>Você ainda não participa de grupos</Text>
                  <Text style={styles.groupDetails}>Crie seu primeiro grupo para compartilhar tarefas.</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.groupsList}>
              {groups.map((group) => {
                const taskCount = (groupTasksById[group.grupo_id] || []).length;
                const notificationCount = groupNotificationsById[group.grupo_id] || 0;

                return (
                  <View key={group.grupo_id} style={styles.groupCard}>
                    <View style={styles.groupTopRow}>
                      <Pressable style={styles.groupMainButton} onPress={() => setSelectedGroupId(group.grupo_id)}>
                        <View style={styles.groupIconWrap}>
                          <MaterialCommunityIcons name="account-group-outline" size={16} color="#2E4E7D" />
                        </View>
                        <View style={styles.groupTexts}>
                          <Text style={styles.groupName}>{group.nome}</Text>
                          <Text style={styles.groupDetails}>{`${taskCount} tarefa(s) compartilhada(s)`}</Text>
                        </View>
                        {notificationCount > 0 ? (
                          <View style={styles.groupNotificationBadge}>
                            <Text style={styles.groupNotificationBadgeText}>
                              {notificationCount > 9 ? '9+' : `${notificationCount}`}
                            </Text>
                          </View>
                        ) : null}
                        <MaterialCommunityIcons name="chevron-right" size={18} color="#9AA8BC" />
                      </Pressable>

                      {group.papel === 'owner' ? (
                        <Pressable style={styles.groupOptionsButton} onPress={() => setGroupActionsTarget(group)}>
                          <MaterialCommunityIcons name="dots-horizontal" size={16} color="#5B6D86" />
                        </Pressable>
                      ) : (
                        <Pressable
                          style={styles.groupLeaveButton}
                          onPress={() => confirmLeaveGroup(group)}
                          disabled={leavingGroupId === group.grupo_id}
                        >
                          <MaterialCommunityIcons name="logout-variant" size={16} color="#A34141" />
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <Text style={styles.sectionTitle}>Reuniões na agenda</Text>

          {meetingsFeed.length === 0 ? (
            <View style={styles.invitesList}>
              <View style={styles.inviteCard}>
                <Text style={styles.groupDetails}>Sem reuniões cadastradas.</Text>
              </View>
            </View>
          ) : (
            <View style={styles.invitesList}>
              {meetingsFeed.map((meeting) => (
                <View key={meeting.id} style={styles.inviteCard}>
                  <View style={styles.groupTexts}>
                    <Text style={styles.groupName}>{meeting.title}</Text>
                    <Text style={styles.groupDetails}>{meeting.details}</Text>
                  </View>

                  {meeting.createdBy === user?.id || meeting.groupOwnerId === user?.id ? (
                    <Pressable
                      style={styles.inviteDeleteButton}
                      onPress={() => confirmDeleteMeeting(meeting)}
                      disabled={deletingMeetingId === meeting.id}
                    >
                      <Text style={styles.inviteDeleteText}>
                        {deletingMeetingId === meeting.id ? 'Excluindo...' : 'Excluir'}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.inviteAcceptButton}
                      onPress={() => setSelectedGroupId(meeting.groupId)}
                    >
                      <Text style={styles.inviteAcceptText}>Abrir</Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          )}

          <Pressable style={styles.createGroupButton} onPress={() => setShowCreateModal(true)}>
            <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.createGroupText}>Criar grupo</Text>
          </Pressable>

          {/* List-specific modals */}
          <CriarGrupoModal
            visible={showCreateModal}
            loading={creatingGroup}
            onClose={() => { if (!creatingGroup) setShowCreateModal(false); }}
            onSubmit={createGroup}
          />

          <ActionPopup
            visible={Boolean(groupActionsTarget)}
            title={groupActionsTarget ? groupActionsTarget.nome : 'Gerenciar grupo'}
            subtitle="Escolha uma ação"
            onClose={() => setGroupActionsTarget(null)}
            items={[
              {
                key: 'invite-members',
                label: 'Adicionar pessoas',
                icon: 'account-plus-outline',
                onPress: () => { if (groupActionsTarget) openInviteMembersModal(groupActionsTarget); }
              },
              {
                key: 'edit-group',
                label: 'Editar grupo',
                icon: 'pencil-outline',
                onPress: () => {
                  if (!groupActionsTarget) return;
                  setGroupActionsTarget(null);
                  setEditingGroup(groupActionsTarget);
                  setEditGroupName(groupActionsTarget.nome);
                }
              },
              {
                key: 'delete-group',
                label: 'Excluir grupo',
                icon: 'trash-can-outline',
                tone: 'danger',
                onPress: () => { if (groupActionsTarget) setDeleteGroupTarget(groupActionsTarget); }
              }
            ]}
          />

          <ActionPopup
            visible={Boolean(deleteGroupTarget)}
            title="Excluir grupo"
            subtitle={deleteGroupTarget ? `Deseja excluir "${deleteGroupTarget.nome}"?` : undefined}
            onClose={() => setDeleteGroupTarget(null)}
            cancelLabel="Manter grupo"
            items={[
              {
                key: 'confirm-delete-group',
                label: 'Sim, excluir grupo',
                icon: 'trash-can-outline',
                tone: 'danger',
                onPress: () => { void executeDeleteGroup(); }
              }
            ]}
          />

          <ModalSheet visible={Boolean(editingGroup)} title="Editar grupo" onClose={() => { if (!savingGroupChanges) setEditingGroup(null); }}>
            {editingGroup ? (
              <View style={styles.groupEditCard}>
                <Input label="Nome do grupo" value={editGroupName} onChangeText={setEditGroupName} placeholder="Nome do grupo" />
                <Button
                  title={savingGroupChanges ? 'Salvando...' : 'Salvar alterações'}
                  onPress={() => void submitGroupEdit()}
                  disabled={savingGroupChanges}
                />
              </View>
            ) : null}
          </ModalSheet>
        </ScrollView>
      )}

      {/* ══ SHARED MODALS — acessíveis de ambas as views ════════ */}

      <ModalSheet visible={Boolean(invitingMembersGroup)} title="Adicionar pessoas" onClose={closeInviteMembersModal}>
        {invitingMembersGroup ? (
          <View style={styles.groupEditCard}>
            <Text style={styles.roomActionHint}>{`Convide pessoas para ${invitingMembersGroup.nome}.`}</Text>

            <Input
              label="Emails"
              value={inviteEmailDraft}
              onChangeText={setInviteEmailDraft}
              placeholder="Digite emails separados por vírgula"
              keyboardType="email-address"
            />

            <Pressable style={styles.groupInviteAddButton} onPress={addInviteEmailsFromDraft}>
              <MaterialCommunityIcons name="email-plus-outline" size={14} color="#0F4DAF" />
              <Text style={styles.groupInviteAddButtonText}>Adicionar emails</Text>
            </Pressable>

            {inviteEmailsDeduplicated.length === 0 ? (
              <Text style={styles.groupInviteHelperText}>Nenhum convite adicionado ainda.</Text>
            ) : (
              <View style={styles.groupInviteEmailsWrap}>
                {inviteEmailsDeduplicated.map((email) => (
                  <View key={email} style={styles.groupInviteEmailChip}>
                    <Text style={styles.groupInviteEmailChipText}>{email}</Text>
                    <Pressable onPress={() => removeInviteEmail(email)} hitSlop={8}>
                      <MaterialCommunityIcons name="close" size={14} color="#5A6B85" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {inviteError ? <Text style={styles.groupInviteErrorText}>{inviteError}</Text> : null}

            <Button
              title={sendingInvites ? 'Enviando...' : 'Enviar convites'}
              onPress={() => void submitInvites()}
              disabled={sendingInvites}
            />
          </View>
        ) : null}
      </ModalSheet>

      <ModalSheet visible={Boolean(membersListGroup)} title="Integrantes" onClose={closeMembersListModal}>
        {membersListGroup ? (
          <View style={styles.groupEditCard}>
            <Text style={styles.roomActionHint}>{`Pessoas no grupo ${membersListGroup.nome}.`}</Text>

            {loadingGroupMembers ? (
              <View style={styles.roomActionEmptyCard}>
                <Text style={styles.roomActionEmptyText}>Carregando integrantes...</Text>
              </View>
            ) : groupMembers.length === 0 ? (
              <View style={styles.roomActionEmptyCard}>
                <Text style={styles.roomActionEmptyText}>{groupMembersError || 'Sem integrantes para exibir.'}</Text>
              </View>
            ) : (
              <View style={styles.groupMembersList}>
                {groupMembers.map((member) => {
                  const displayName = member.nome || member.email || 'Integrante';
                  const roleLabel = member.papel === 'owner' ? 'Dono' : 'Membro';
                  const isCurrentUser = member.user_id === user?.id;

                  return (
                    <View key={member.user_id} style={styles.groupMemberItem}>
                      <View style={styles.groupMemberIdentity}>
                        <View style={styles.groupMemberAvatar}>
                          <MaterialCommunityIcons name="account-outline" size={15} color="#466998" />
                        </View>
                        <View style={styles.groupMemberTexts}>
                          <Text style={styles.groupMemberName}>
                            {isCurrentUser ? `${displayName} (você)` : displayName}
                          </Text>
                          {member.email ? <Text style={styles.groupMemberEmail}>{member.email}</Text> : null}
                        </View>
                      </View>

                      <View style={[styles.groupMemberRoleChip, member.papel === 'owner' && styles.groupMemberRoleChipOwner]}>
                        <Text style={[styles.groupMemberRoleText, member.papel === 'owner' && styles.groupMemberRoleTextOwner]}>
                          {roleLabel}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ) : null}
      </ModalSheet>

    </View>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────

type ConviteItem = { status: 'convidado' | 'ja_eh_membro' | 'nao_encontrado' };

const buildInviteSummary = (convites: ConviteItem[]): string => {
  const partes: string[] = [];
  const enviados = convites.filter((c) => c.status === 'convidado').length;
  const jaMembros = convites.filter((c) => c.status === 'ja_eh_membro').length;
  const naoEncontrados = convites.filter((c) => c.status === 'nao_encontrado').length;
  if (enviados > 0) partes.push(`${enviados} convite(s) enviado(s)`);
  if (jaMembros > 0) partes.push(`${jaMembros} já era(m) membro(s)`);
  if (naoEncontrados > 0) partes.push(`${naoEncontrados} email(s) não encontrado(s)`);
  return partes.join(' | ');
};
