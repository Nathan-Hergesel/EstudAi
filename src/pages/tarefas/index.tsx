import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { EditarModal } from '@/components/EditarModal';
import { FiltroModal } from '@/components/FiltroModal';
import { TarefaModal } from '@/components/TarefaModal';
import { Button } from '@/components/ui/Button';
import { useTasks } from '@/hooks/TasksContext';
import { Task } from '@/types/app.types';
import { parseUiDate, sameDay, startOfDay } from '@/utils/date';
import { styles } from '@/pages/tarefas/styles';

type DisplayItem =
  | { kind: 'task'; id: string; task: Task }
  | { kind: 'promo'; id: 'promo-card' };

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

export const TarefasPage = () => {
  const {
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

  const tasks = useMemo(
    () =>
      filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
      ),
    [filteredTasks, search]
  );

  const displayItems = useMemo<DisplayItem[]>(() => {
    if (tasks.length === 0) return [];

    const mapped: DisplayItem[] = tasks.map((task) => ({ kind: 'task', id: task.id, task }));
    const insertAt = Math.min(2, mapped.length);
    mapped.splice(insertAt, 0, { kind: 'promo', id: 'promo-card' });
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

  const onSaveTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    if (editingTask) {
      await updateTask(editingTask.id, task);
      setEditingTask(null);
      return;
    }

    await addTask(task);
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
          <MaterialCommunityIcons name="tune-variant" size={17} color="#1C355E" style={styles.iconActionIcon} />
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
                <Text style={styles.promoTitle}>Produtividade Acadêmica</Text>
                <Text style={styles.promoText}>
                  {`Concluídas ${productivity.completed} de ${productivity.total} tarefas da semana.`}
                </Text>
                <Pressable style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>{`Progresso ${productivity.rate}%`}</Text>
                </Pressable>
              </LinearGradient>
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

                    <Pressable
                      style={styles.moreButton}
                      onPress={() =>
                        Alert.alert('Ações da tarefa', task.title, [
                          {
                            text: 'Editar',
                            onPress: () => {
                              setEditingTask(task);
                              setShowTaskModal(true);
                            }
                          },
                          {
                            text: 'Excluir',
                            style: 'destructive',
                            onPress: () => void deleteTask(task.id)
                          },
                          { text: 'Cancelar', style: 'cancel' }
                        ])
                      }
                    >
                      <MaterialCommunityIcons name="dots-vertical" size={16} color="#7C8795" style={styles.moreButtonIcon} />
                    </Pressable>
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

      <TarefaModal
        visible={showTaskModal}
        initialTask={editingTask}
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
