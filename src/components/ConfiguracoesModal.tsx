import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ModalSheet } from '@/components/ui/ModalSheet';
import { colors, radius, spacing } from '@/constants/tokens';
import { Configuracao } from '@/types/database.types';

type Props = {
  visible: boolean;
  configuracoes: Configuracao | null;
  onChange: (updates: Partial<Configuracao>) => Promise<void>;
  onClose: () => void;
};

type ToggleItem = {
  key: keyof Configuracao;
  label: string;
};

const toggles: ToggleItem[] = [
  { key: 'notificacoes_ativas', label: 'Notificações ativas' },
  { key: 'lembrete_tarefas', label: 'Lembrete de tarefas' },
  { key: 'alerta_vencimento', label: 'Alerta de vencimento' },
  { key: 'mostrar_concluidas', label: 'Mostrar concluídas' },
  { key: 'sincronizacao_auto', label: 'Sincronização automática' }
];

export const ConfiguracoesModal = ({ visible, configuracoes, onChange, onClose }: Props) => {
  if (!configuracoes) return null;

  return (
    <ModalSheet visible={visible} title="Configurações" onClose={onClose}>
      <View style={styles.listCard}>
        <Text style={styles.sectionTitle}>Preferências gerais</Text>
      </View>

      <View style={styles.list}>
        {toggles.map((item) => {
          const value = Boolean(configuracoes[item.key]);
          return (
            <Pressable key={item.key} style={styles.item} onPress={() => onChange({ [item.key]: !value })}>
              <Text style={styles.label}>{item.label}</Text>
              <View style={[styles.switchTrack, value && styles.switchTrackOn]}>
                <View style={[styles.switchThumb, value && styles.switchThumbOn]} />
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.hoursCard}>
        <Text style={styles.sectionTitle}>Horas de antecedência</Text>
        <View style={styles.hoursRow}>
        {[24, 48, 72].map((hours) => {
          const active = configuracoes.horas_antecedencia === hours;
          return (
            <Pressable
              key={hours}
              style={[styles.hourChip, active && styles.hourChipActive]}
              onPress={() => onChange({ horas_antecedencia: hours as 24 | 48 | 72 })}
            >
              <Text style={styles.hourText}>{`${hours}h`}</Text>
            </Pressable>
          );
        })}
        </View>
      </View>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  listCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE6F0',
    backgroundColor: colors.surfaceLowest,
    padding: spacing.sm,
    marginBottom: spacing.xs
  },
  sectionTitle: {
    color: '#41546E',
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 11
  },
  list: {
    gap: spacing.xs
  },
  item: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E1E8F2',
    minHeight: 46,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontFamily: 'Inter_500Medium',
    color: colors.onSurface,
    flex: 1,
    paddingRight: spacing.sm
  },
  switchTrack: {
    width: 36,
    height: 21,
    borderRadius: radius.pill,
    backgroundColor: '#D4DCE8',
    justifyContent: 'center',
    paddingHorizontal: 2
  },
  switchTrackOn: {
    backgroundColor: '#BBD2FF'
  },
  switchThumb: {
    width: 15,
    height: 15,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF'
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary
  },
  hoursCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE6F0',
    backgroundColor: colors.surfaceLowest,
    padding: spacing.sm,
    gap: spacing.sm,
    marginTop: spacing.xs
  },
  hoursRow: {
    flexDirection: 'row',
    gap: spacing.xs
  },
  hourChip: {
    minHeight: 34,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    backgroundColor: '#EEF2F7',
    borderWidth: 1,
    borderColor: '#E1E8F1'
  },
  hourChipActive: {
    backgroundColor: '#DCEAFF',
    borderColor: '#BFD4F8'
  },
  hourText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#324863',
    fontSize: 12
  }
});
