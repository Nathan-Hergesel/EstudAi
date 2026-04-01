import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ModalSheet } from '@/components/ui/ModalSheet';
import { useTasks } from '@/hooks/TasksContext';
import { parseUiDate, sameDay, startOfDay } from '@/utils/date';
import { styles } from '@/pages/agenda/styles';
import { Task } from '@/types/app.types';

type Props = {
  onGoTasks: () => void;
};

const weekLabels = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'] as const;

const ESTIMATED_MINUTES_BY_TYPE: Record<Task['type'], number> = {
  PROVA: 120,
  ATIVIDADE: 60,
  TRABALHO: 60,
  LEITURA: 30
};

const pad = (value: number): string => `${value}`.padStart(2, '0');

const toTaskDate = (raw: string): Date => new Date(parseUiDate(raw));

const dateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const formatDuration = (minutes: number, withLeadingHour = false): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hourLabel = withLeadingHour ? pad(h) : `${h}`;
  return `${hourLabel}h ${pad(m)}m`;
};

const relativeDateLabel = (target: Date, now: Date): string => {
  const today = startOfDay(now);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (sameDay(target, today)) return 'Hoje';
  if (sameDay(target, tomorrow)) return 'Amanhã';
  return `${pad(target.getDate())}/${pad(target.getMonth() + 1)}`;
};

const typeBadgeLabel = (type: Task['type']): string => {
  return type;
};

const taskDurationMinutes = (type: Task['type']): number => ESTIMATED_MINUTES_BY_TYPE[type] || 60;

const capitalize = (value: string): string => {
  if (!value) return value;
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
};

export const AgendaPage = ({ onGoTasks }: Props) => {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [monthCursor, setMonthCursor] = useState<Date>(() => {
    const current = new Date();
    return new Date(current.getFullYear(), current.getMonth(), 1);
  });

  const tasksCountByDay = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((task) => {
      const key = dateKey(toTaskDate(task.date));
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [tasks]);

  const countByDate = (date: Date): number => tasksCountByDay[dateKey(date)] || 0;

  const calendarDays = useMemo(() => {
    const monday = new Date(selectedDate);
    const weekDay = monday.getDay();
    const offset = weekDay === 0 ? -6 : 1 - weekDay;
    monday.setDate(monday.getDate() + offset);

    return weekLabels.map((label, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return { label, date };
    });
  }, [selectedDate]);

  const monthLabel = useMemo(() => {
    const month = selectedDate.toLocaleDateString('pt-BR', { month: 'long' });
    return `${capitalize(month)} ${selectedDate.getFullYear()}`;
  }, [selectedDate]);

  const monthPickerLabel = useMemo(() => {
    const month = monthCursor.toLocaleDateString('pt-BR', { month: 'long' });
    return `${capitalize(month)} ${monthCursor.getFullYear()}`;
  }, [monthCursor]);

  const monthGridDays = useMemo(() => {
    const first = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const weekDay = first.getDay();
    const offset = weekDay === 0 ? -6 : 1 - weekDay;
    const start = new Date(first);
    start.setDate(first.getDate() + offset);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        date,
        inCurrentMonth: date.getMonth() === monthCursor.getMonth()
      };
    });
  }, [monthCursor]);

  const openMonthCalendar = () => {
    setMonthCursor(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setMonthModalVisible(true);
  };

  const selectedTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const date = toTaskDate(task.date);
        return sameDay(date, selectedDate);
      }),
    [selectedDate, tasks]
  );

  const todayTasks = useMemo(
    () => [...selectedTasks].sort((a, b) => toTaskDate(a.date).getTime() - toTaskDate(b.date).getTime()),
    [selectedTasks]
  );

  const tomorrowTasks = useMemo(() => {
    const selectedDay = startOfDay(selectedDate);
    const tomorrow = new Date(selectedDay);
    tomorrow.setDate(selectedDay.getDate() + 1);

    return [...tasks]
      .filter((task) => sameDay(toTaskDate(task.date), tomorrow))
      .sort((a, b) => toTaskDate(a.date).getTime() - toTaskDate(b.date).getTime());
  }, [selectedDate, tasks]);

  const suggestedMinutes = selectedTasks.reduce((acc, task) => acc + taskDurationMinutes(task.type), 0);

  const completed = tasks.filter((task) => task.completed).length;
  const focusTotal = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const pendingCount = tasks.filter((task) => !task.completed).length;
  const focusHint = tasks.length > 0 ? `${completed} de ${tasks.length} concluídas` : 'Sem tarefas registradas';

  const renderCommitmentCard = (task: Task, keyPrefix: string) => {
    const due = toTaskDate(task.date);
    const typeTone =
      task.type === 'PROVA'
        ? styles.provaTone
        : task.type === 'TRABALHO'
          ? styles.trabalhoTone
          : task.type === 'ATIVIDADE'
            ? styles.atividadeTone
            : styles.leituraTone;

    return (
      <Pressable key={`${keyPrefix}${task.id}`} style={[styles.commitmentCard, typeTone]} onPress={onGoTasks}>
        <View style={styles.commitmentHeader}>
          <View
            style={[
              styles.typeBadge,
              task.type === 'PROVA'
                ? styles.badgeProva
                : task.type === 'TRABALHO'
                  ? styles.badgeTrabalho
                  : task.type === 'ATIVIDADE'
                    ? styles.badgeAtividade
                    : styles.badgeLeitura
            ]}
          >
            <Text style={styles.typeBadgeText}>{typeBadgeLabel(task.type)}</Text>
          </View>
        </View>

        <Text style={styles.commitmentTitle}>{task.title}</Text>

        <View style={styles.commitmentFooter}>
          <Text style={styles.commitmentMeta}>{`${relativeDateLabel(due, selectedDate)}, ${pad(due.getHours())}:${pad(due.getMinutes())}`}</Text>
          <MaterialCommunityIcons name="dots-vertical" size={16} color="#8D97A6" style={styles.commitmentMoreIcon} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>CALENDÁRIO DE ESTUDO</Text>
        <Text style={styles.title}>Agenda de Estudos</Text>

        <View style={styles.monthRow}>
          <Text style={styles.monthTitle}>{monthLabel}</Text>
          <Pressable onPress={openMonthCalendar}>
            <Text style={styles.monthAction}>{'Ver Mês >'}</Text>
          </Pressable>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.weekHeaderRow}>
            {calendarDays.map((item) => (
              <Text key={`${item.label}-${item.date.getDate()}`} style={styles.weekHeaderText}>
                {item.label}
              </Text>
            ))}
          </View>
          <View style={styles.weekDaysRow}>
            {calendarDays.map((item) => {
              const active = sameDay(item.date, selectedDate);
              const dayCount = countByDate(item.date);

              return (
                <Pressable
                  key={item.date.toISOString()}
                  style={[styles.dayButton, active && styles.dayButtonActive]}
                  onPress={() => setSelectedDate(new Date(item.date))}
                >
                  <Text style={[styles.dayButtonText, active && styles.dayButtonTextActive]}>{pad(item.date.getDate())}</Text>
                  {dayCount > 0 ? (
                    <View style={[styles.dayCountBadge, active && styles.dayCountBadgeActive]}>
                      <Text style={[styles.dayCountBadgeText, active && styles.dayCountBadgeTextActive]}>
                        {dayCount > 9 ? '9+' : `${dayCount}`}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <LinearGradient colors={['#0C358D', '#082A73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.studyCard}>
          <View style={styles.studyTopRow}>
            <Text style={styles.studyLabel}>TEMPO SUGERIDO</Text>
            <View style={styles.studyBadge}>
              <MaterialCommunityIcons name="timer-outline" size={13} color="#FFFFFF" style={styles.studyBadgeIcon} />
            </View>
          </View>
          <Text style={styles.studyTime}>{formatDuration(suggestedMinutes, true)}</Text>
          <Text style={styles.studyHint}>
            {suggestedMinutes > 0
              ? 'Sugestão calculada com base no tipo e na quantidade de tarefas do dia selecionado.'
              : 'Sem tarefas para o dia selecionado. Adicione uma tarefa para ver o tempo sugerido.'}
          </Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Para hoje</Text>

        {todayTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Sem compromissos para hoje</Text>
            <Text style={styles.emptySubtitle}>As tarefas do dia selecionado aparecerão aqui.</Text>
          </View>
        ) : (
          todayTasks.map((task) => renderCommitmentCard(task, 'today-'))
        )}

        <Text style={styles.sectionTitle}>Para amanhã</Text>

        {tomorrowTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Sem compromissos para amanhã</Text>
            <Text style={styles.emptySubtitle}>As tarefas do dia seguinte aparecerão aqui.</Text>
          </View>
        ) : (
          tomorrowTasks.map((task) => renderCommitmentCard(task, 'tomorrow-'))
        )}

        <View style={styles.bottomStatsRow}>
          <View style={styles.bottomStatCard}>
            <Text style={styles.bottomStatLabel}>FOCO TOTAL</Text>
            <Text style={styles.bottomStatValue}>{`${focusTotal}%`}</Text>
            <Text style={styles.bottomStatHint}>{focusHint}</Text>
          </View>

          <View style={styles.bottomStatCard}>
            <Text style={styles.bottomStatLabel}>PENDÊNCIAS</Text>
            <Text style={styles.bottomStatValue}>{pad(pendingCount)}</Text>
            <Text style={styles.bottomStatWarn}>{pendingCount > 0 ? 'Urgência Alta' : 'No prazo'}</Text>
          </View>
        </View>
      </ScrollView>

      <ModalSheet visible={monthModalVisible} title="Calendário mensal" onClose={() => setMonthModalVisible(false)}>
        <View style={styles.monthPickerHeader}>
          <Pressable
            style={styles.monthPickerNavButton}
            onPress={() =>
              setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
            }
          >
            <MaterialCommunityIcons name="chevron-left" size={19} color="#29477B" />
          </Pressable>

          <Text style={styles.monthPickerLabel}>{monthPickerLabel}</Text>

          <Pressable
            style={styles.monthPickerNavButton}
            onPress={() =>
              setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
            }
          >
            <MaterialCommunityIcons name="chevron-right" size={19} color="#29477B" />
          </Pressable>
        </View>

        <View style={styles.monthPickerWeekHeaderRow}>
          {weekLabels.map((label) => (
            <Text key={`month-${label}`} style={styles.monthPickerWeekHeaderText}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.monthPickerGrid}>
          {monthGridDays.map((item) => {
            const active = sameDay(item.date, selectedDate);
            const dayCount = countByDate(item.date);

            return (
              <Pressable
                key={`month-day-${item.date.toISOString()}`}
                style={[
                  styles.monthPickerDay,
                  !item.inCurrentMonth && styles.monthPickerDayMuted,
                  active && styles.monthPickerDayActive
                ]}
                onPress={() => {
                  setSelectedDate(new Date(item.date));
                  setMonthModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.monthPickerDayText,
                    !item.inCurrentMonth && styles.monthPickerDayTextMuted,
                    active && styles.monthPickerDayTextActive
                  ]}
                >
                  {pad(item.date.getDate())}
                </Text>

                {dayCount > 0 ? (
                  <View style={[styles.monthPickerDayBadge, active && styles.monthPickerDayBadgeActive]}>
                    <Text style={[styles.monthPickerDayBadgeText, active && styles.monthPickerDayBadgeTextActive]}>
                      {dayCount > 9 ? '9+' : `${dayCount}`}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ModalSheet>
    </View>
  );
};
