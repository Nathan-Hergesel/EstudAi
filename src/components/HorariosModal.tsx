import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { Button } from '@/components/ui/Button';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { colors, radius, spacing } from '@/constants/tokens';
import { HorarioCompleto, Materia } from '@/types/database.types';

type Props = {
  visible: boolean;
  materias: Materia[];
  horarios: HorarioCompleto[];
  onAdd: (payload: { materiaId: string; dia: number; inicio: string; fim: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
};

export const HorariosModal = ({ visible, materias, horarios, onAdd, onDelete, onClose }: Props) => {
  const [createVisible, setCreateVisible] = useState(false);
  const [materiaId, setMateriaId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [inicioDate, setInicioDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0, 0);
  });
  const [fimDate, setFimDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 30, 0, 0);
  });
  const [activePicker, setActivePicker] = useState<null | 'date' | 'inicio' | 'fim'>(null);

  useEffect(() => {
    if (!visible) {
      setCreateVisible(false);
      setActivePicker(null);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (materias.length === 0) {
      setMateriaId('');
      return;
    }
    if (!materiaId) setMateriaId(materias[0].id);
  }, [visible, materias, materiaId]);

  const materiaColorById = useMemo(() => {
    const map: Record<string, string> = {};
    materias.forEach((materia) => {
      map[materia.id] = materia.cor || '#2563EB';
    });
    return map;
  }, [materias]);

  const pad = (value: number): string => `${value}`.padStart(2, '0');

  const formatDate = (value: Date): string =>
    `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}`;

  const formatTime = (value: Date): string => `${pad(value.getHours())}:${pad(value.getMinutes())}`;

  const submit = async () => {
    if (!materiaId) return;

    await onAdd({
      materiaId,
      dia: selectedDate.getDay(),
      inicio: formatTime(inicioDate),
      fim: formatTime(fimDate)
    });

    const base = new Date(selectedDate);
    setInicioDate(new Date(base.getFullYear(), base.getMonth(), base.getDate(), 19, 0, 0, 0));
    setFimDate(new Date(base.getFullYear(), base.getMonth(), base.getDate(), 20, 30, 0, 0));
    setActivePicker(null);
    setCreateVisible(false);
  };

  const dayLabels: Record<number, string> = {
    0: 'Domingo',
    1: 'Segunda',
    2: 'Terça',
    3: 'Quarta',
    4: 'Quinta',
    5: 'Sexta',
    6: 'Sábado'
  };

  const selectedDayLabel = (dayLabels[selectedDate.getDay()] || 'Dia').toUpperCase();

  const pickerValue =
    activePicker === 'date' ? selectedDate : activePicker === 'inicio' ? inicioDate : activePicker === 'fim' ? fimDate : selectedDate;

  const pickerMode = activePicker === 'date' ? 'date' : 'time';

  const handlePickerChange = (event: DateTimePickerEvent, value?: Date) => {
    const field = activePicker;
    if (!field) return;

    if (Platform.OS === 'android') {
      setActivePicker(null);
      if (event.type !== 'set' || !value) return;
    }

    if (!value) return;

    if (field === 'date') {
      setSelectedDate(new Date(value.getFullYear(), value.getMonth(), value.getDate()));
      return;
    }

    const merged = new Date(selectedDate);
    merged.setHours(value.getHours(), value.getMinutes(), 0, 0);

    if (field === 'inicio') {
      setInicioDate(merged);
      return;
    }

    setFimDate(merged);
  };

  return (
    <>
      <ModalSheet visible={visible} title="Horários" onClose={onClose}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryTexts}>
            <Text style={styles.sectionTitle}>Planejamento semanal</Text>
            <Text style={styles.helper}>
              {horarios.length > 0
                ? `${horarios.length} horário(s) cadastrado(s).`
                : 'Cadastre seus horários para visualizar a rotina da semana.'}
            </Text>
          </View>

          <Button
            title="Novo horário"
            variant="secondary"
            disabled={materias.length === 0}
            onPress={() => {
              setActivePicker(null);
              setCreateVisible(true);
            }}
          />

          {materias.length === 0 ? <Text style={styles.helper}>Cadastre uma matéria antes de criar horários.</Text> : null}
        </View>

        <View style={styles.list}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Horários cadastrados</Text>
            <View style={styles.listCountBadge}>
              <Text style={styles.listCountText}>{horarios.length}</Text>
            </View>
          </View>

          {horarios.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="calendar-clock-outline" size={18} color="#7B8CA3" />
              <Text style={styles.emptyTitle}>Nenhum horário cadastrado</Text>
              <Text style={styles.emptySubtitle}>Toque em Novo horário para cadastrar o primeiro horário.</Text>
            </View>
          ) : (
            horarios.map((horario) => {
              const dayLabel = dayLabels[horario.dia_semana] || `D${horario.dia_semana}`;
              const accentColor = materiaColorById[horario.materia_id] || '#2854A6';

              return (
                <View key={horario.id} style={[styles.item, { borderLeftColor: accentColor }]}>
                  <View style={styles.itemInfo}>
                    <View style={[styles.itemDot, { backgroundColor: accentColor }]} />

                    <View style={styles.itemTexts}>
                      <View style={styles.itemTopRow}>
                        <Text style={styles.itemTitle}>{horario.materia_nome || horario.materia_id}</Text>
                        <View style={styles.dayBadge}>
                          <Text style={styles.dayBadgeText}>{dayLabel.slice(0, 3).toUpperCase()}</Text>
                        </View>
                      </View>

                      <Text style={styles.itemSubtitle}>{`${dayLabel} | ${horario.hora_inicio} - ${horario.hora_fim}`}</Text>
                    </View>
                  </View>

                  <Pressable style={styles.deleteButton} onPress={() => onDelete(horario.id)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={15} color={colors.error} />
                  </Pressable>
                </View>
              );
            })
          )}
        </View>
      </ModalSheet>

      <ModalSheet
        visible={visible && createVisible}
        title="Novo horário"
        onClose={() => {
          setCreateVisible(false);
          setActivePicker(null);
        }}
      >
        <View style={styles.form}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Selecionar matéria</Text>
            <View style={styles.chips}>
              {materias.map((item) => {
                const active = materiaId === item.id;

                return (
                  <Pressable key={item.id} style={[styles.chip, active && styles.chipActive]} onPress={() => setMateriaId(item.id)}>
                    <View style={styles.chipContent}>
                      <View style={[styles.chipDot, { backgroundColor: item.cor || '#2563EB' }]} />
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.nome}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Data e horário</Text>
            <Text style={styles.helper}>Selecione uma data e o app define automaticamente o dia da semana.</Text>

            <View style={styles.dateTimeGrid}>
              <Pressable style={styles.selectorCard} onPress={() => setActivePicker('date')}>
                <Text style={styles.selectorLabel}>Data</Text>
                <Text style={styles.selectorValue}>{formatDate(selectedDate)}</Text>
                <Text style={styles.selectorHint}>{selectedDayLabel}</Text>
              </Pressable>

              <Pressable style={styles.selectorCard} onPress={() => setActivePicker('inicio')}>
                <Text style={styles.selectorLabel}>Início</Text>
                <Text style={styles.selectorValue}>{formatTime(inicioDate)}</Text>
              </Pressable>

              <Pressable style={styles.selectorCard} onPress={() => setActivePicker('fim')}>
                <Text style={styles.selectorLabel}>Fim</Text>
                <Text style={styles.selectorValue}>{formatTime(fimDate)}</Text>
              </Pressable>
            </View>

            {activePicker && Platform.OS === 'ios' ? (
              <View style={styles.pickerWrap}>
                <DateTimePicker
                  value={pickerValue}
                  mode={pickerMode}
                  display="spinner"
                  onChange={handlePickerChange}
                  is24Hour
                />

                <Pressable style={styles.donePickerButton} onPress={() => setActivePicker(null)}>
                  <Text style={styles.donePickerText}>Concluir seleção</Text>
                </Pressable>
              </View>
            ) : null}

            {activePicker && Platform.OS === 'android' ? (
              <DateTimePicker
                value={pickerValue}
                mode={pickerMode}
                display="default"
                onChange={handlePickerChange}
                is24Hour
              />
            ) : null}
          </View>

          <Button title="Adicionar horário" onPress={submit} />
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
    gap: spacing.xs
  },
  sectionTitle: {
    color: '#41546E',
    fontFamily: 'Inter_700Bold',
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
    minHeight: 32,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    backgroundColor: '#EEF2F7',
    borderWidth: 1,
    borderColor: '#E1E8F1'
  },
  chipActive: {
    backgroundColor: '#DCEAFF',
    borderColor: '#BFD4F8'
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill
  },
  chipText: {
    color: '#324863',
    fontFamily: 'Inter_500Medium',
    fontSize: 12
  },
  chipTextActive: {
    color: '#0E3F9E',
    fontFamily: 'Inter_700Bold'
  },
  helper: {
    fontFamily: 'Inter_400Regular',
    color: colors.muted,
    fontSize: 12
  },
  dateTimeGrid: {
    gap: spacing.xs
  },
  selectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DDE5EF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  selectorLabel: {
    fontFamily: 'Inter_600SemiBold',
    color: '#607189',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  selectorValue: {
    marginTop: 2,
    fontFamily: 'Inter_700Bold',
    color: '#132F5D',
    fontSize: 16
  },
  selectorHint: {
    marginTop: 2,
    color: '#6D7C92',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  pickerWrap: {
    marginTop: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DDE5EF',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden'
  },
  donePickerButton: {
    borderTopWidth: 1,
    borderTopColor: '#E2E9F3',
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  donePickerText: {
    fontFamily: 'Inter_700Bold',
    color: '#11429F',
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
    flex: 1,
    paddingRight: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  itemDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill
  },
  itemTexts: {
    flex: 1
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xs
  },
  itemTitle: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.onSurface,
    fontSize: 13
  },
  dayBadge: {
    minHeight: 18,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    backgroundColor: '#EAF1FE',
    borderWidth: 1,
    borderColor: '#CFDDF4',
    justifyContent: 'center'
  },
  dayBadgeText: {
    color: '#2A4A82',
    fontFamily: 'Inter_700Bold',
    fontSize: 10
  },
  itemSubtitle: {
    color: colors.muted,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
    fontSize: 12
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
