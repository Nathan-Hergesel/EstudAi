import React, { useMemo, useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '../../constants/colors';
import { agendaStyles as styles } from './styles';
import { useTasks } from '../../hooks/TasksContext';
import type { Task } from '../../hooks/useTarefas';
import TarefaModal from '../../components/TarefaModal';
import { styles as tarefasStyles } from '../tarefas/styles';

// Util: parse dd/MM/yyyy HH:mm
const parseTaskDate = (dateStr: string): Date | null => {
  const m = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
  if (!m) return null;
  const [_, dd, mm, yyyy, HH = '00', MM = '00'] = m;
  return new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10), parseInt(HH, 10), parseInt(MM, 10));
};

const monthName = (d: Date) => d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const estimateHours = (t: Task): number => {
  switch (t.difficulty) {
    case 'Fácil':
      return 1;
    case 'Médio':
      return 1.5;
    case 'Difícil':
      return 2;
    default:
      return 1;
  }
};

interface AgendaScreenProps {
  onNavigate?: (screen: string) => void;
}

export default function AgendaScreen({ onNavigate }: AgendaScreenProps) {
  const { tasks, addTask, loading } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Tarefas por dia (yyyy-mm-dd)
  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(t => {
      const dt = parseTaskDate(t.date);
      if (!dt) return;
      const key = dt.toISOString().slice(0, 10);
      const arr = map.get(key) || [];
      arr.push(t);
      map.set(key, arr);
    });
    return map;
  }, [tasks]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const gridDays: { date: Date; inMonth: boolean }[] = [];
  // leading blanks from prev month
  for (let i = 0; i < firstWeekday; i++) {
    const d = new Date(currentMonth);
    d.setDate(-i);
    gridDays.unshift({ date: d, inMonth: false });
  }
  // days of this month
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(currentMonth);
    d.setDate(day);
    gridDays.push({ date: d, inMonth: true });
  }
  // trailing to complete rows to multiple of 7
  while (gridDays.length % 7 !== 0) {
    const last = gridDays[gridDays.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    gridDays.push({ date: d, inMonth: false });
  }

  const selectedKey = selectedDate.toISOString().slice(0, 10);
  const selectedTasks = tasksByDay.get(selectedKey) || [];
  const totalHours = selectedTasks.reduce((acc, t) => acc + estimateHours(t), 0);

  const dayDots = (list: Task[]) => {
    // até 3 tipos
    const types = Array.from(new Set(list.map(t => t.type)));
    const colorByType: Record<Task['type'], string> = {
      ATIVIDADE: colors.atividade,
      TRABALHO: colors.trabalho,
      PROVA: colors.prova,
    };
    return (
      <View style={styles.dayDotsRow}>
        {types.slice(0, 3).map(tp => (
          <View key={tp} style={[styles.dot, { backgroundColor: colorByType[tp] }]} />
        ))}
      </View>
    );
  };

  const formatTimeRange = (t: Task) => {
    const base = estimateHours(t);
    const min = Math.max(0.5, base - 0.5);
    const max = base + 0.5;
    return `${min}hr ~ ${max}hr`;
  };

  const formatShortDate = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  const formatTime = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const sortedSelected = [...selectedTasks].sort((a, b) => {
    const da = parseTaskDate(a.date) || new Date();
    const db = parseTaskDate(b.date) || new Date();
    if (da.getTime() !== db.getTime()) return da.getTime() - db.getTime();
    const order: Record<Task['difficulty'], number> = { 'Fácil': 1, 'Médio': 2, 'Difícil': 3 };
    return order[b.difficulty] - order[a.difficulty];
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.fundo} />

      {/* Navegação Superior (mesmo estilo da tela de Tarefas) */}
      <View style={tarefasStyles.topNavigation}>
        {['Criar', 'AGENDA', 'Editar'].map((item) => {
          const isActionCreate = item === 'Criar';
          const isActionEdit = item === 'Editar';
          const isActive = item === 'AGENDA';
          return (
            <TouchableOpacity
              key={item}
              style={[
                tarefasStyles.navButton,
                isActive ? tarefasStyles.navButtonActive : tarefasStyles.navButtonInactive,
              ]}
              onPress={() => {
                if (isActionCreate) {
                  setIsEditing(false);
                  setModalVisible(true);
                } else if (isActionEdit) {
                  onNavigate?.('Tarefas');
                }
              }}
            >
              <Text
                style={[
                  tarefasStyles.navButtonText,
                  isActive ? tarefasStyles.navButtonTextActive : tarefasStyles.navButtonTextInactive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.content}>
          {/* Cabeçalho do mês */}
          <View style={styles.monthHeader}>
            <TouchableOpacity
              onPress={() => {
                const d = new Date(currentMonth);
                d.setMonth(d.getMonth() - 1);
                setCurrentMonth(d);
              }}
              style={styles.monthNavBtn}
            >
              <Text style={styles.monthNavText}>{'‹'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthName(currentMonth).replace(/^./, c => c.toUpperCase())}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const d = new Date(currentMonth);
                d.setMonth(d.getMonth() + 1);
                setCurrentMonth(d);
              }}
              style={styles.monthNavBtn}
            >
              <Text style={styles.monthNavText}>{'›'}</Text>
            </TouchableOpacity>
          </View>

          {/* Calendário */}
          <View style={styles.calendarBox}>
            <View style={styles.weekHeader}>
              {weekDays.map(d => (
                <Text key={d} style={styles.weekHeaderText}>{d}</Text>
              ))}
            </View>
            <View style={styles.grid}>
              {gridDays.map(({ date, inMonth }) => {
                const key = date.toISOString().slice(0, 10);
                const items = tasksByDay.get(key) || [];
                const isSelected = key === selectedKey;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.dayCell, isSelected && styles.daySelected]}
                    onPress={() => setSelectedDate(date)}
                    disabled={!inMonth}
                  >
                    <Text style={[styles.dayNumber, !inMonth && styles.dayMuted]}>{date.getDate()}</Text>
                    {items.length > 0 && dayDots(items)}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Tempo de Estudo */}
          <View style={styles.studyTimeRow}>
            <Text style={styles.studyLabel}>Tempo de Estudo:</Text>
            <Text style={styles.studyValue}>{totalHours}hr</Text>
          </View>
          <Text style={styles.sectionSubtle}>Sugestão Otimizada para hoje:</Text>

          {/* Sugestões */}
          {sortedSelected.slice(0, 5).map((t) => {
            const dt = parseTaskDate(t.date) || new Date();
            const pillTypeStyle =
              t.type === 'TRABALHO' ? styles.pillWork : t.type === 'PROVA' ? styles.pillExam : styles.pillActivity;
            const diffStyle = styles.pillDiff; // vermelho para "Difícil" (mock)
            return (
              <View key={t.id} style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.pill, pillTypeStyle]}>
                    <Text style={styles.pillText}>{t.type}</Text>
                  </View>
                  <View style={[styles.pill, diffStyle]}>
                    <Text style={styles.pillText}>{t.difficulty}</Text>
                  </View>
                  <View style={styles.cardRight}>
                    <Text style={styles.timeRange}>Tempo: {formatTimeRange(t)}</Text>
                    <Text style={styles.tinyText}>
                      {formatShortDate(dt)} às {formatTime(dt)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>{t.title}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal de criação de tarefa direto da Agenda */}
      <TarefaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={async (task) => {
          await addTask(task);
          setModalVisible(false);
        }}
        isEditing={isEditing}
      />
    </View>
  );
}
