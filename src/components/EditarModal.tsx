import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { colors, spacing } from '@/constants/tokens';

type Props = {
  visible: boolean;
  totalSelecionadas: number;
  onConcluir: () => void;
  onExcluir: () => void;
  onClose: () => void;
};

export const EditarModal = ({ visible, totalSelecionadas, onConcluir, onExcluir, onClose }: Props) => (
  <ModalSheet visible={visible} title="Edição em lote" onClose={onClose}>
    <View style={styles.content}>
      <View style={styles.infoCard}>
        <Text style={styles.subtitle}>{totalSelecionadas} tarefa(s) selecionada(s)</Text>
        <Text style={styles.caption}>Aplique alterações em lote com segurança.</Text>
      </View>
      <Button title="Marcar como concluídas" onPress={onConcluir} />
      <Button title="Excluir selecionadas" onPress={onExcluir} variant="secondary" />
    </View>
  </ModalSheet>
);

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFE6F0',
    backgroundColor: colors.surfaceLowest,
    padding: spacing.sm,
    gap: 2
  },
  subtitle: {
    color: '#304964',
    fontFamily: 'Inter_700Bold',
    fontSize: 13
  },
  caption: {
    color: colors.muted,
    fontFamily: 'Inter_400Regular',
    fontSize: 12
  }
});
