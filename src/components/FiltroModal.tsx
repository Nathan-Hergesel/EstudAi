import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/tokens';
import { TaskFilters } from '@/types/app.types';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { Button } from '@/components/ui/Button';

type Props = {
  visible: boolean;
  filters: TaskFilters;
  onApply: (filters: Partial<TaskFilters>) => void;
  onClose: () => void;
};

const periods: TaskFilters['period'][] = ['Todos', 'Hoje', 'Esta semana', 'Este mês', 'Próximos 7 dias'];
const types: TaskFilters['type'][] = ['Todos', 'ATIVIDADE', 'LEITURA', 'TRABALHO', 'PROVA'];
const statusList: TaskFilters['status'][] = ['Todos', 'Concluídas'];

const ChipRow = <T extends string>({
  title,
  items,
  value,
  onPick
}: {
  title: string;
  items: T[];
  value: T;
  onPick: (item: T) => void;
}) => (
  <View style={styles.group}>
    <Text style={styles.groupTitle}>{title}</Text>
    <View style={styles.chips}>
      {items.map((item) => {
        const active = item === value;
        return (
          <Pressable key={item} style={[styles.chip, active && styles.chipActive]} onPress={() => onPick(item)}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

export const FiltroModal = ({ visible, filters, onApply, onClose }: Props) => (
  <ModalSheet visible={visible} title="Filtros" onClose={onClose}>
    <ChipRow title="Período" items={periods} value={filters.period} onPick={(item) => onApply({ period: item })} />
    <ChipRow title="Tipo" items={types} value={filters.type} onPick={(item) => onApply({ type: item })} />
    <ChipRow title="Status" items={statusList} value={filters.status} onPick={(item) => onApply({ status: item })} />

    <Button
      title="Limpar filtros"
      variant="secondary"
      onPress={() =>
        onApply({
          period: 'Todos',
          type: 'Todos',
          status: 'Todos'
        })
      }
    />
  </ModalSheet>
);

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE6F0',
    backgroundColor: colors.surfaceLowest,
    padding: spacing.sm
  },
  groupTitle: {
    fontFamily: 'Inter_600SemiBold',
    color: '#41546E',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 11
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs
  },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    minHeight: 32,
    justifyContent: 'center',
    backgroundColor: '#EEF2F7',
    borderWidth: 1,
    borderColor: '#E1E8F1'
  },
  chipActive: {
    backgroundColor: '#DCEAFF',
    borderColor: '#BFD4F8'
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    color: '#324863',
    fontSize: 12
  },
  chipTextActive: {
    fontFamily: 'Inter_700Bold',
    color: '#0E3F9E'
  }
});
