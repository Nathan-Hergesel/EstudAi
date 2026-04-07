import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { EditarModal } from '@/components/EditarModal';
import { FiltroModal } from '@/components/FiltroModal';
import { TarefaModal } from '@/components/TarefaModal';
import { ActionPopup } from '@/components/ui/ActionPopup';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/TasksContext';
import { supabaseService } from '@/services/supabase.service';
import { Task } from '@/types/app.types';
import { GrupoDoUsuario, Materia } from '@/types/database.types';
import { parseUiDate, sameDay, startOfDay } from '@/utils/date';
import { styles } from '@/pages/tarefas/styles';

type DisplayItem =
  | { kind: 'task'; id: string; task: Task }
  | { kind: 'promo'; id: 'promo-card' }
  | { kind: 'date-separator'; id: string; label: string };

const typeToneByTask: Record<Task['type'], 'prova' | 'trabalho' | 'atividade' | 'leitura'> = {
  PROVA: 'prova',
  TRABALHO: 'trabalho',
  ATIVIDADE: 'atividade',
  LEITURA: 'leitura'
};

const typeLabel = (value: Task['type']): string => {
  return value;
};

const pad = (value: number): string => `${value}`.padStart(2, '0');

const formatTaskMeta = (rawDate: string): string => {
  const date = new Date(parseUiDate(rawDate));
  if (Number.isNaN(date.getTime())) return rawDate;

  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  if (sameDay(date, today)) return `Hoje, ${time}`;
  if (sameDay(date, tomorrow)) return `Amanhã, ${time}`;
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}, ${time}`;
};

const dateSectionKey = (rawDate: string): string => {
  const date = new Date(parseUiDate(rawDate));
  if (Number.isNaN(date.getTime())) return rawDate;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const dateSectionLabel = (rawDate: string): string => {
  const date = new Date(parseUiDate(rawDate));
  if (Number.isNaN(date.getTime())) return rawDate;

  const today = startOfDay(new Date());
  if (sameDay(date, today)) return 'Hoje';
  return `${date.getDate()}/${pad(date.getMonth() + 1)}`;
};

export const TarefasPage = () => {
  const { user } = useAuth();
  const {
    tasks: allTasks,
    filteredTasks,
    selectedTasks,
    filters,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    toggleTaskSelection,
    batchDelete,
    batchUpdate,
    applyFilters
  } = useTasks();

  const [search, setSearch] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showBatchEdit, setShowBatchEdit] = useState(false);
  const [collapsedCompleted, setCollapsedCompleted] = useState<Record<string, boolean>>({});
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskActionsTarget, setTaskActionsTarget] = useState<Task | null>(null);
  const [deleteTaskTarget, setDeleteTaskTarget] = useState<Task | null>(null);
  const [shareTaskTarget, setShareTaskTarget] = useState<Task | null>(null);
  const [groups, setGroups] = useState<GrupoDoUsuario[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);

  const loadMaterias = async () => {
    if (!user?.id) {
      setMaterias([]);
      return;
    }

    const result = await supabaseService.listarMaterias(user.id);
    if (!result.success) {
      setMaterias([]);
      return;
    }

    setMaterias(result.data || []);
  };

  const loadGroups = async () => {
    if (!user?.id) {
      setGroups([]);
      return;
    }

    const result = await supabaseService.listarGruposDoUsuario(user.id);
    if (!result.success) {
      setGroups([]);
      return;
    }

    setGroups(result.data || []);
  };

  useEffect(() => {
    void loadGroups();
    void loadMaterias();
  }, [user?.id]);

  const resolveMateriaName = async (materiaName: string): Promise<string | null> => {
    if (!user?.id) {
      Alert.alert('Matéria', 'Faça login para usar matérias.');
      return null;
    }

    const normalizedName = materiaName.trim();
    if (!normalizedName) return null;

    const existingMateria = materias.find(
      (materia) => materia.nome.trim().toLowerCase() === normalizedName.toLowerCase()
    );

    if (existingMateria) {
      return existingMateria.id;
    }

    const createResult = await supabaseService.criarMateria({
      user_id: user.id,
      nome: normalizedName
    });

    if (!createResult.success || !createResult.data) {
      Alert.alert('Matéria', createResult.error || 'Não foi possível criar essa matéria.');
      return null;
    }

    const createdMateria = createResult.data;

    setMaterias((prev) => [...prev, createdMateria].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')));

    return createdMateria.id;
  };

  const tasks = useMemo(
    () =>
      [...filteredTasks]
        .filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => new Date(parseUiDate(a.date)).getTime() - new Date(parseUiDate(b.date)).getTime()),
    [filteredTasks, search]
  );

  const displayItems = useMemo<DisplayItem[]>(() => {
    if (tasks.length === 0) return [];

    const mapped: DisplayItem[] = [{ kind: 'promo', id: 'promo-card' }];
    let previousSection = '';

    tasks.forEach((task, index) => {
      const currentSection = dateSectionKey(task.date);
      if (currentSection !== previousSection) {
        mapped.push({
          kind: 'date-separator',
          id: `date-separator-${currentSection}-${index}`,
          label: dateSectionLabel(task.date)
        });
        previousSection = currentSection;
      }

      mapped.push({ kind: 'task', id: task.id, task });
    });

    return mapped;
  }, [tasks]);

  const toggleCompletedCard = (taskId: string) => {
    setCollapsedCompleted((prev) => {
      const currentState = prev[taskId] ?? true;

      return {
        ...prev,
        [taskId]: !currentState
      };
    });
  };

  const productivity = useMemo(() => {
    const today = startOfDay(new Date());
    const weekStart = new Date(today);
    const day = weekStart.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + offset);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekTasks = filteredTasks.filter((task) => {
      const due = new Date(parseUiDate(task.date));
      return due >= weekStart && due <= weekEnd;
    });

    const completed = weekTasks.filter((task) => task.completed).length;
    const total = weekTasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completed,
      total,
      rate,
      pending: Math.max(total - completed, 0)
    };
  }, [filteredTasks]);

  const globalStats = useMemo(() => {
    const completed = allTasks.filter((task) => task.completed).length;
    const total = allTasks.length;
    const focusTotal = total > 0 ? Math.round((completed / total) * 100) : 0;
    const pending = Math.max(total - completed, 0);
    const pendingRate = total > 0 ? Math.round((pending / total) * 100) : 0;

    return {
      focusTotal,
      pending,
      pendingRate
    };
  }, [allTasks]);

  const shareTaskInGroup = async (task: Task, group: GrupoDoUsuario): Promise<boolean> => {
    if (!user?.id) {
      Alert.alert('Aviso', 'Faça login para compartilhar tarefas.');
      return false;
    }

    const result = await supabaseService.compartilharTarefaComGrupo({
      grupo_id: group.grupo_id,
      tarefa_id: task.id,
      compartilhado_por: user.id
    });

    if (!result.success) {
      const raw = (result.error || '').toLowerCase();
      const isDuplicate = raw.includes('duplicate') || raw.includes('unique');

      Alert.alert(
        'Compartilhar tarefa',
        isDuplicate
          ? 'Essa tarefa já foi compartilhada nesse grupo.'
          : result.error || 'Não foi possível compartilhar a tarefa.'
      );
      return false;
    }

    Alert.alert('Compartilhar tarefa', `"${task.title}" enviada para ${group.nome}.`);
    return true;
  };

  const createQuickGroup = async () => {
    if (!user?.id) {
      Alert.alert('Aviso', 'Faça login para criar grupos.');
      return;
    }

    const result = await supabaseService.criarGrupoEstudo({
      nome: 'Grupo Geral',
      descricao: null
    });

    if (!result.success) {
      const raw = (result.error || '').toLowerCase();
      const isDuplicate = raw.includes('duplicate') || raw.includes('unique');

      if (!isDuplicate) {
        Alert.alert('Grupos', result.error || 'Não foi possível criar um grupo.');
        return;
      }
    }

    await loadGroups();
    Alert.alert('Grupos', 'Grupo Geral pronto. Agora você pode compartilhar tarefas.');
  };

  const openShareMenu = (task: Task) => {
    setShareTaskTarget(task);
  };

  const closeShareMenu = () => {
    setShareTaskTarget(null);
  };

  const handleShareWithGroup = async (group: GrupoDoUsuario) => {
    if (!shareTaskTarget) return;
    const success = await shareTaskInGroup(shareTaskTarget, group);
    if (success) {
      closeShareMenu();
    }
  };

  const closeTaskActions = () => {
    setTaskActionsTarget(null);
  };

  const closeDeleteTaskPopup = () => {
    setDeleteTaskTarget(null);
  };

  const executeDeleteTask = async (taskId: string) => {
    const result = await deleteTask(taskId);
    if (!result.success) {
      Alert.alert('Erro', result.error || 'Não foi possível excluir a tarefa.');
    }
  };

  const askTaskDelete = (task: Task) => {
    setDeleteTaskTarget(task);
  };

  const confirmTaskDelete = async () => {
    if (!deleteTaskTarget) return;

    const taskId = deleteTaskTarget.id;
    setDeleteTaskTarget(null);
    await executeDeleteTask(taskId);
  };

  const onSaveTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    if (editingTask) {
      const result = await updateTask(editingTask.id, task);
      if (!result.success) {
        Alert.alert('Erro', result.error || 'Não foi possível atualizar a tarefa.');
        return;
      }

      setEditingTask(null);
      return;
    }

    const result = await addTask(task);
    if (!result.success) {
      Alert.alert('Erro', result.error || 'Não foi possível criar a tarefa.');
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>FLUXO DE ESTUDO</Text>
      <Text style={styles.title}>Gestão de Tarefas</Text>

      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={17} color="#9AA3AE" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por prova ou matéria..."
            placeholderTextColor="#ADB3BC"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <Pressable style={styles.iconAction} onPress={() => setShowFilters(true)}>
          <MaterialCommunityIcons name="tune-variant" size={17} color="#FFFFFF" style={styles.iconActionIcon} />
        </Pressable>
      </View>

      {selectedTasks.length > 0 ? (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>{`${selectedTasks.length} selecionada(s)`}</Text>
          <Pressable onPress={() => setShowBatchEdit(true)}>
            <Text style={styles.selectionAction}>Editar lote</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.headerStatsRow}>
        <View style={styles.headerStatPill}>
          <View
            style={[
              styles.headerStatPillFill,
              styles.headerStatPillFillFocus,
              { width: `${globalStats.focusTotal}%` }
            ]}
          />
          <View style={styles.headerStatPillContent}>
            <Text style={styles.headerStatPillLabel}>Concluídas</Text>
            <Text style={styles.headerStatPillValue}>{`${globalStats.focusTotal}%`}</Text>
          </View>
        </View>

        <View style={styles.headerStatPill}>
          <View
            style={[
              styles.headerStatPillFill,
              styles.headerStatPillFillPending,
              { width: `${globalStats.pendingRate}%` }
            ]}
          />
          <View style={styles.headerStatPillContent}>
            <Text style={styles.headerStatPillLabel}>Pendentes</Text>
            <Text style={styles.headerStatPillValue}>{pad(globalStats.pending)}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={displayItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Sem tarefas para esse filtro.</Text>
          </View>
        }
        renderItem={({ item }) => {
          if (item.kind === 'promo') {
            return (
              <LinearGradient colors={['#08236E', '#00174F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.promoCard}>
                <Text style={styles.promoTitle}>Produtividade Semanal</Text>
                <Text style={styles.promoText}>
                  {`Concluídas ${productivity.completed} de ${productivity.total} tarefas da semana.`}
                </Text>

                <View style={styles.promoProgressRow}>
                  <View style={styles.promoProgressTrack}>
                    <View style={[styles.promoProgressFill, { width: `${productivity.rate}%` }]} />
                  </View>
                  <Text style={styles.promoProgressValue}>{`${productivity.rate}%`}</Text>
                </View>
              </LinearGradient>
            );
          }

          if (item.kind === 'date-separator') {
            return (
              <View style={styles.dateDividerRow}>
                <View style={styles.dateDividerLine} />
                <Text style={styles.dateDividerLabel}>{item.label}</Text>
                <View style={styles.dateDividerLine} />
              </View>
            );
          }

          const task = item.task;
          const selected = selectedTasks.includes(task.id);
          const tone = typeToneByTask[task.type];
          const completed = task.completed;
          const isCompletedCardCollapsed = completed ? (collapsedCompleted[task.id] ?? true) : false;
          const hideCompletedExtras = completed && isCompletedCardCollapsed;
          const rightToneStyle =
            task.type === 'PROVA'
              ? styles.cardToneProva
              : task.type === 'TRABALHO'
                ? styles.cardToneTrabalho
                : task.type === 'ATIVIDADE'
                  ? styles.cardToneAtividade
                  : styles.cardToneLeitura;

          return (
            <Pressable
              style={[
                styles.card,
                rightToneStyle,
                selected ? styles.cardSelected : null,
                completed ? styles.cardCompleted : null,
                completed && isCompletedCardCollapsed ? styles.cardCompletedCollapsed : null
              ]}
              onLongPress={() => toggleTaskSelection(task.id)}
            >
              <View style={styles.badgesRow}>
                <View
                  style={[
                    styles.typeBadge,
                    tone === 'prova'
                      ? styles.badgeProva
                      : tone === 'trabalho'
                        ? styles.badgeTrabalho
                        : tone === 'atividade'
                          ? styles.badgeAtividade
                          : styles.badgeLeitura
                  ]}
                >
                  <Text style={styles.typeBadgeText}>{typeLabel(task.type)}</Text>
                </View>
                {completed ? (
                  <>
                    <View style={styles.doneBadge}>
                      <MaterialCommunityIcons name="check-circle" size={11} color="#1B8E54" />
                      <Text style={styles.doneBadgeText}>CONCLUÍDA</Text>
                    </View>
                    <Pressable style={styles.doneToggleChip} onPress={() => toggleCompletedCard(task.id)}>
                      <MaterialCommunityIcons
                        name={isCompletedCardCollapsed ? 'chevron-down' : 'chevron-up'}
                        size={14}
                        color="#3B5D96"
                      />
                    </Pressable>
                  </>
                ) : null}
              </View>

              <Text style={[styles.taskTitle, completed ? styles.taskTitleCompleted : null]}>{task.title}</Text>
              {!completed || !isCompletedCardCollapsed ? (
                <Text style={[styles.taskDescription, completed ? styles.taskDescriptionCompleted : null]} numberOfLines={completed ? 1 : 3}>
                  {task.description}
                </Text>
              ) : null}

              {!hideCompletedExtras ? (
                <>
                  <View style={styles.metaRow}>
                    <Text style={[styles.meta, completed ? styles.metaCompleted : null]}>{formatTaskMeta(task.date)}</Text>
                  </View>

                  <View style={[styles.footerRow, completed && isCompletedCardCollapsed ? styles.footerRowCollapsed : null]}>
                    <Pressable
                      style={[
                        styles.concludeButton,
                        completed ? styles.concludeButtonDone : null,
                        completed && isCompletedCardCollapsed ? styles.concludeButtonCompact : null
                      ]}
                      onPress={() => toggleTaskCompletion(task.id)}
                    >
                      <Text
                        style={[
                          styles.concludeButtonText,
                          completed ? styles.concludeButtonTextDone : null,
                          completed && isCompletedCardCollapsed ? styles.concludeButtonTextCompact : null
                        ]}
                      >
                        {completed ? 'Reabrir' : 'Concluir'}
                      </Text>
                    </Pressable>

                    <View style={styles.cardActionsRight}>
                      <Pressable style={styles.shareQuickButton} onPress={() => openShareMenu(task)}>
                        <MaterialCommunityIcons name="share-variant-outline" size={14} color="#2A4C82" />
                      </Pressable>

                      <Pressable style={styles.moreButton} onPress={() => setTaskActionsTarget(task)}>
                        <MaterialCommunityIcons
                          name="dots-horizontal"
                          size={16}
                          color="#5E6E85"
                          style={styles.moreButtonIcon}
                        />
                      </Pressable>
                    </View>
                  </View>
                </>
              ) : null}

              {selected ? <Text style={styles.selectedHint}>Selecionada para lote</Text> : null}
            </Pressable>
          );
        }}
      />

      <Pressable style={styles.fab} onPress={() => setShowTaskModal(true)}>
        <MaterialCommunityIcons name="plus" size={29} color="#FFFFFF" style={styles.fabIcon} />
      </Pressable>

      <ActionPopup
        visible={Boolean(taskActionsTarget)}
        title={taskActionsTarget ? taskActionsTarget.title : 'Ações da tarefa'}
        subtitle={taskActionsTarget ? formatTaskMeta(taskActionsTarget.date) : undefined}
        onClose={closeTaskActions}
        items={[
          {
            key: 'share-task',
            label: 'Compartilhar com grupo',
            icon: 'share-variant-outline',
            onPress: () => {
              if (!taskActionsTarget) return;
              openShareMenu(taskActionsTarget);
            }
          },
          {
            key: 'edit-task',
            label: 'Editar tarefa',
            icon: 'pencil-outline',
            onPress: () => {
              if (!taskActionsTarget) return;
              setEditingTask(taskActionsTarget);
              setShowTaskModal(true);
            }
          },
          {
            key: 'delete-task',
            label: 'Excluir tarefa',
            icon: 'trash-can-outline',
            tone: 'danger',
            onPress: () => {
              if (!taskActionsTarget) return;
              askTaskDelete(taskActionsTarget);
            }
          }
        ]}
      />

      <ActionPopup
        visible={Boolean(deleteTaskTarget)}
        title="Excluir tarefa"
        subtitle={deleteTaskTarget ? `Deseja excluir "${deleteTaskTarget.title}"?` : undefined}
        onClose={closeDeleteTaskPopup}
        cancelLabel="Manter tarefa"
        items={[
          {
            key: 'confirm-delete-task',
            label: 'Sim, excluir tarefa',
            icon: 'trash-can-outline',
            tone: 'danger',
            onPress: () => {
              void confirmTaskDelete();
            }
          }
        ]}
      />

      <ModalSheet visible={Boolean(shareTaskTarget)} title="Compartilhar tarefa" onClose={closeShareMenu}>
        {shareTaskTarget ? (
          <View style={styles.shareSheetCard}>
            <Text style={styles.shareSheetTaskTitle}>{shareTaskTarget.title}</Text>
            <Text style={styles.shareSheetTaskHint}>Selecione o grupo para compartilhar:</Text>

            {groups.length === 0 ? (
              <View style={styles.shareSheetEmptyCard}>
                <Text style={styles.shareSheetEmptyTitle}>Sem grupos disponíveis</Text>
                <Text style={styles.shareSheetEmptyText}>
                  Crie um grupo rápido ou atualize a lista para compartilhar esta tarefa.
                </Text>

                <View style={styles.shareSheetEmptyActions}>
                  <Pressable style={styles.shareSheetSecondaryAction} onPress={() => void loadGroups()}>
                    <Text style={styles.shareSheetSecondaryActionText}>Atualizar</Text>
                  </Pressable>
                  <Pressable style={styles.shareSheetPrimaryAction} onPress={() => void createQuickGroup()}>
                    <Text style={styles.shareSheetPrimaryActionText}>Criar grupo rápido</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.shareGroupsList}>
                {groups.map((group) => (
                  <Pressable
                    key={group.grupo_id}
                    style={styles.shareGroupItem}
                    onPress={() => {
                      void handleShareWithGroup(group);
                    }}
                  >
                    <View style={styles.shareGroupIconWrap}>
                      <MaterialCommunityIcons name="account-group-outline" size={15} color="#244A83" />
                    </View>

                    <View style={styles.shareGroupTexts}>
                      <Text style={styles.shareGroupName}>{group.nome}</Text>
                      <Text style={styles.shareGroupMeta}>{group.papel === 'owner' ? 'Você é dono' : 'Você é membro'}</Text>
                    </View>

                    <MaterialCommunityIcons name="chevron-right" size={16} color="#92A2B8" />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ) : null}
      </ModalSheet>

      <TarefaModal
        visible={showTaskModal}
        initialTask={editingTask}
        materias={materias}
        onResolveMateriaName={resolveMateriaName}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSave={onSaveTask}
      />

      <FiltroModal visible={showFilters} filters={filters} onApply={applyFilters} onClose={() => setShowFilters(false)} />

      <EditarModal
        visible={showBatchEdit}
        totalSelecionadas={selectedTasks.length}
        onConcluir={() => void batchUpdate(selectedTasks, { completed: true })}
        onExcluir={() => void batchDelete(selectedTasks)}
        onClose={() => setShowBatchEdit(false)}
      />
    </View>
  );
};
