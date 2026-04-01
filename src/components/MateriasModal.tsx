import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { colors, radius, spacing } from '@/constants/tokens';
import { Materia } from '@/types/database.types';

type Props = {
  visible: boolean;
  materias: Materia[];
  onAdd: (payload: Pick<Materia, 'nome' | 'codigo' | 'professor' | 'cor'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
};

const colorPresets = ['#2563EB', '#0EA5E9', '#20C781', '#E6B800', '#EA4242', '#7C59E6'];

export const MateriasModal = ({ visible, materias, onAdd, onDelete, onClose }: Props) => {
  const [createVisible, setCreateVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [professor, setProfessor] = useState('');
  const [cor, setCor] = useState('#2563EB');

  const resetForm = () => {
    setNome('');
    setCodigo('');
    setProfessor('');
    setCor('#2563EB');
  };

  useEffect(() => {
    if (!visible) {
      setCreateVisible(false);
      resetForm();
    }
  }, [visible]);

  const submit = async () => {
    if (!nome.trim()) return;
    await onAdd({
      nome: nome.trim(),
      codigo: codigo.trim(),
      professor: professor.trim(),
      cor
    });
    resetForm();
    setCreateVisible(false);
  };

  return (
    <>
      <ModalSheet visible={visible} title="Matérias" onClose={onClose}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryTexts}>
            <Text style={styles.sectionTitle}>Suas matérias</Text>
            <Text style={styles.sectionHint}>
              {materias.length > 0
                ? `${materias.length} matéria(s) cadastrada(s).`
                : 'Cadastre a primeira matéria para organizar tarefas e horários.'}
            </Text>
          </View>

          <Button
            title="Nova matéria"
            variant="secondary"
            onPress={() => {
              resetForm();
              setCreateVisible(true);
            }}
          />
        </View>

        <View style={styles.list}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Matérias cadastradas</Text>
            <View style={styles.listCountBadge}>
              <Text style={styles.listCountText}>{materias.length}</Text>
            </View>
          </View>

          {materias.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="book-open-variant" size={18} color="#7B8CA3" />
              <Text style={styles.emptyTitle}>Nenhuma matéria cadastrada</Text>
              <Text style={styles.emptySubtitle}>Toque em Nova matéria para criar a primeira disciplina.</Text>
            </View>
          ) : (
            materias.map((materia) => (
              <View key={materia.id} style={[styles.item, { borderLeftColor: materia.cor || '#2563EB' }]}>
                <View style={styles.itemInfo}>
                  <View style={[styles.itemColorDot, { backgroundColor: materia.cor || '#2563EB' }]} />

                  <View style={styles.itemTexts}>
                    <Text style={styles.itemTitle}>{materia.nome}</Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.itemCodeChip}>{materia.codigo || 'Sem código'}</Text>
                      <Text style={styles.itemSubtitle}>{materia.professor || 'Professor não informado'}</Text>
                    </View>
                  </View>
                </View>

                <Pressable style={styles.deleteButton} onPress={() => onDelete(materia.id)}>
                  <MaterialCommunityIcons name="trash-can-outline" size={15} color={colors.error} />
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ModalSheet>

      <ModalSheet
        visible={visible && createVisible}
        title="Nova matéria"
        onClose={() => {
          setCreateVisible(false);
        }}
      >
        <View style={styles.form}>
          <Input label="Nome" value={nome} onChangeText={setNome} />
          <Input label="Código" value={codigo} onChangeText={setCodigo} />
          <Input label="Professor" value={professor} onChangeText={setProfessor} />

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Cor rápida</Text>
            <View style={styles.colorPaletteRow}>
              {colorPresets.map((preset) => {
                const active = cor.toLowerCase() === preset.toLowerCase();
                return (
                  <Pressable
                    key={preset}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: preset },
                      active ? styles.colorSwatchActive : null
                    ]}
                    onPress={() => setCor(preset)}
                  />
                );
              })}
            </View>
            <View style={styles.selectedColorRow}>
              <View style={[styles.selectedColorDot, { backgroundColor: cor }]} />
              <Text style={styles.selectedColorText}>{`Selecionada: ${cor}`}</Text>
            </View>
          </View>

          <Button title="Adicionar matéria" onPress={submit} />
        </View>
      </ModalSheet>
    </>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE6F0',
    backgroundColor: colors.surfaceLowest,
    padding: spacing.sm,
    gap: spacing.sm
  },
  summaryTexts: {
    gap: 2
  },
  form: {
    gap: spacing.sm
  },
  sectionCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE6F0',
    backgroundColor: colors.surfaceLowest,
    padding: spacing.sm,
    gap: 2
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#2D4764',
    fontSize: 13
  },
  sectionHint: {
    fontFamily: 'Inter_400Regular',
    color: colors.muted,
    fontSize: 12
  },
  colorPaletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  colorSwatchActive: {
    borderColor: '#1C3E7E',
    transform: [{ scale: 1.08 }]
  },
  selectedColorRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  selectedColorDot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill
  },
  selectedColorText: {
    color: '#4B5E77',
    fontFamily: 'Inter_500Medium',
    fontSize: 12
  },
  list: {
    gap: spacing.xs
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: 2
  },
  listTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#41546E',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 11
  },
  listCountBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: '#EAF1FE',
    borderWidth: 1,
    borderColor: '#C8D9F8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  listCountText: {
    color: '#1D4F9E',
    fontFamily: 'Inter_700Bold',
    fontSize: 11
  },
  emptyCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE6F0',
    backgroundColor: '#F8FAFD',
    padding: spacing.md,
    alignItems: 'center',
    gap: 4
  },
  emptyTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#334A68',
    fontSize: 13
  },
  emptySubtitle: {
    color: '#7A8698',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    textAlign: 'center'
  },
  item: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E1E8F2',
    borderLeftWidth: 4,
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    paddingRight: spacing.sm
  },
  itemColorDot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill
  },
  itemTexts: {
    flex: 1
  },
  itemTitle: {
    fontFamily: 'Inter_600SemiBold',
    color: '#22334B',
    fontSize: 13
  },
  metaRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap'
  },
  itemCodeChip: {
    color: '#2A4A82',
    backgroundColor: '#EAF1FE',
    borderWidth: 1,
    borderColor: '#CFDDF4',
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    minHeight: 18,
    textAlignVertical: 'center',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10
  },
  itemSubtitle: {
    color: colors.muted,
    fontFamily: 'Inter_400Regular',
    fontSize: 11
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCECEC'
  }
});
