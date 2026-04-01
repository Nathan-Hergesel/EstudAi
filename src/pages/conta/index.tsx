import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ConfiguracoesModal } from '@/components/ConfiguracoesModal';
import { EditarPerfilModal } from '@/components/EditarPerfilModal';
import { HorariosModal } from '@/components/HorariosModal';
import { MateriasModal } from '@/components/MateriasModal';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/TasksContext';
import { supabaseService } from '@/services/supabase.service';
import { Configuracao, HorarioCompleto, Materia } from '@/types/database.types';
import { parseUiDate, startOfDay } from '@/utils/date';
import { styles } from '@/pages/conta/styles';

type ModalKind = 'perfil' | 'materias' | 'horarios' | 'config' | null;

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type QuickAction = {
  id: ModalKind;
  title: string;
  subtitle: string;
  icon: IconName;
};

const quickActions: QuickAction[] = [
  { id: 'horarios', title: 'Horários', subtitle: 'Grade do semestre atual', icon: 'calendar-clock-outline' },
  { id: 'materias', title: 'Matérias', subtitle: 'Conteúdos e materiais', icon: 'book-open-page-variant-outline' },
  { id: 'perfil', title: 'Editar Conta', subtitle: 'Dados pessoais e senha', icon: 'account-edit-outline' },
  { id: 'config', title: 'Configurações', subtitle: 'Preferências do aplicativo', icon: 'cog-outline' }
];

export const ContaPage = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { tasks } = useTasks();
  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [horarios, setHorarios] = useState<HorarioCompleto[]>([]);
  const [configuracoes, setConfiguracoes] = useState<Configuracao | null>(null);

  const loadData = async () => {
    if (!user?.id) return;

    const [materiasResult, horariosResult, configResult] = await Promise.all([
      supabaseService.listarMaterias(user.id),
      supabaseService.listarHorarios(user.id),
      supabaseService.obterConfiguracoes(user.id)
    ]);

    if (materiasResult.success && materiasResult.data) setMaterias(materiasResult.data);
    if (horariosResult.success && horariosResult.data) setHorarios(horariosResult.data);
    if (configResult.success && configResult.data) setConfiguracoes(configResult.data);
  };

  useEffect(() => {
    void loadData();
  }, [user?.id]);

  const firstName = profile?.nome?.trim().split(' ')[0] || 'Aluno';

  const { weeklyProgress, weeklyCompleted, weekTotal, doneScore, doneRate } = useMemo(() => {
    const now = new Date();
    const weekStart = startOfDay(new Date(now));
    const weekDay = weekStart.getDay();
    const offset = weekDay === 0 ? -6 : 1 - weekDay;
    weekStart.setDate(weekStart.getDate() + offset);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekTasks = tasks.filter((task) => {
      const due = new Date(parseUiDate(task.date));
      return due >= weekStart && due <= weekEnd;
    });

    const weeklyCompleted = weekTasks.filter((task) => task.completed).length;
    const progress = weekTasks.length > 0 ? Math.round((weeklyCompleted / weekTasks.length) * 100) : 0;

    const totalCompleted = tasks.filter((task) => task.completed).length;
    const doneRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

    return {
      weeklyProgress: progress,
      weeklyCompleted,
      weekTotal: weekTasks.length,
      doneScore: totalCompleted,
      doneRate
    };
  }, [tasks]);

  return (
    <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.avatarOuter}>
          <View style={styles.avatarInner}>
            <MaterialCommunityIcons name="account" size={46} color="#E7EDF7" style={styles.avatarFace} />
          </View>
          <View style={styles.avatarBadge}>
            <MaterialCommunityIcons name="check" size={12} color="#FFFFFF" style={styles.avatarBadgeText} />
          </View>
        </View>

        <Text style={styles.name}>{`Olá, ${firstName}`}</Text>
        <Text style={styles.info}>Bem-vindo de volta à sua jornada acadêmica.</Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>ENTREGAS DA SEMANA</Text>
          <Text style={styles.metricValue}>{`${weeklyProgress}%`}</Text>
          <View style={styles.metricTrack}>
            <View style={[styles.metricFill, { width: `${weeklyProgress}%` }]} />
          </View>
          <Text style={styles.metricMeta}>{`${weeklyCompleted} de ${weekTotal} concluídas`}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>ATIVIDADES FEITAS</Text>
          <Text style={styles.metricValue}>{doneScore}</Text>
          <Text style={styles.metricMeta}>{`Taxa geral ${doneRate}%`}</Text>
        </View>
      </View>

      <View style={styles.actionsList}>
        {quickActions.map((action) => {
          const actionCount = action.id === 'horarios' ? horarios.length : action.id === 'materias' ? materias.length : null;

          return (
            <Pressable
              key={action.id || 'none'}
              style={[
                styles.actionRow,
                action.id === 'horarios' ? styles.actionRowHorarios : null,
                action.id === 'materias' ? styles.actionRowMaterias : null
              ]}
              onPress={() => setActiveModal(action.id)}
            >
              <View style={styles.actionIconWrap}>
                <MaterialCommunityIcons name={action.icon} size={15} color="#324A6F" style={styles.actionIcon} />
              </View>

              <View style={styles.actionTexts}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>

              <View style={styles.actionTrailing}>
                {actionCount !== null ? (
                  <View style={styles.actionCountBadge}>
                    <Text style={styles.actionCountText}>{actionCount}</Text>
                  </View>
                ) : null}
                <MaterialCommunityIcons name="chevron-right" size={18} color="#ABB3BE" style={styles.actionChevron} />
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.logoutButton} onPress={() => void signOut()}>
        <MaterialCommunityIcons name="logout" size={13} color="#B32020" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </Pressable>

      <View style={styles.footerBrand}>
        <Image source={require('../../img/Logo EstudAI (1).png')} style={styles.footerLogo} resizeMode="contain" />
        <Text style={styles.footerTitle}>EstudAi</Text>
        <Text style={styles.footerSubtitle}>{profile?.instituicao || 'Universidade de Sorocaba'}</Text>
        <Text style={styles.footerCaption}>{profile?.curso || 'Versão 2.0 | EnSUSU'}</Text>
      </View>

      <EditarPerfilModal
        visible={activeModal === 'perfil'}
        profile={profile}
        onClose={() => setActiveModal(null)}
        onSave={async (payload) => {
          if (!user?.id) return;
          await supabaseService.atualizarPerfil(user.id, payload);
          await refreshProfile();
        }}
      />

      <MateriasModal
        visible={activeModal === 'materias'}
        materias={materias}
        onClose={() => setActiveModal(null)}
        onAdd={async (payload) => {
          if (!user?.id) return;
          await supabaseService.criarMateria({ ...payload, user_id: user.id });
          await loadData();
        }}
        onDelete={async (id) => {
          await supabaseService.removerMateria(id);
          await loadData();
        }}
      />

      <HorariosModal
        visible={activeModal === 'horarios'}
        materias={materias}
        horarios={horarios}
        onClose={() => setActiveModal(null)}
        onAdd={async (payload) => {
          if (!user?.id) return;
          await supabaseService.criarHorario({
            user_id: user.id,
            materia_id: payload.materiaId,
            dia_semana: payload.dia,
            hora_inicio: payload.inicio,
            hora_fim: payload.fim
          });
          await loadData();
        }}
        onDelete={async (id) => {
          await supabaseService.removerHorario(id);
          await loadData();
        }}
      />

      <ConfiguracoesModal
        visible={activeModal === 'config'}
        configuracoes={configuracoes}
        onClose={() => setActiveModal(null)}
        onChange={async (updates) => {
          if (!user?.id) return;
          const result = await supabaseService.atualizarConfiguracoes(user.id, updates);
          if (!result.success) return;
          setConfiguracoes(result.data || null);
        }}
      />
    </ScrollView>
  );
};
