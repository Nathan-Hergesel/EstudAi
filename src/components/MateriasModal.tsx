import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { colors, radius, spacing } from '@/constants/tokens';
import { HorarioCompleto, Materia } from '@/types/database.types';

type Props = {
  visible: boolean;
  materias: Materia[];
  horarios: HorarioCompleto[];
  onAdd: (payload: Pick<Materia, 'nome' | 'codigo' | 'professor' | 'cor'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddHorario: (payload: { materiaId: string; dia: number; inicio: string; fim: string }) => Promise<void>;
  onDeleteHorario: (id: string) => Promise<void>;
  onClose: () => void;
};

const colorPresets = ['#2563EB', '#0EA5E9', '#20C781', '#E6B800', '#EA4242', '#7C59E6'];
const dayOptions: Array<{ value: number; label: string }> = [
  { value: 1, label: 'SEG' },
  { value: 2, label: 'TER' },
  { value: 3, label: 'QUA' },
  { value: 4, label: 'QUI' },
  { value: 5, label: 'SEX' },
  { value: 6, label: 'SAB' },
  { value: 0, label: 'DOM' }
];

const dayLabelByValue: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado'
};

const pad = (value: number): string => `${value}`.padStart(2, '0');

const createTime = (hour: number, minute: number): Date => {
  const value = new Date();
  value.setHours(hour, minute, 0, 0);
  return value;
};

const formatTime = (value: Date): string => `${pad(value.getHours())}:${pad(value.getMinutes())}`;

const formatStoredTime = (raw: string): string => {
  const [hour = '00', minute = '00'] = raw.split(':');
  return `${pad(Number(hour) || 0)}:${pad(Number(minute) || 0)}`;
};

const applyPickedTime = (base: Date): Date => createTime(base.getHours(), base.getMinutes());

export const MateriasModal = ({
  visible,
  materias,
  horarios,
  onAdd,
  onDelete,
  onAddHorario,
  onDeleteHorario,
  onClose
}: Props) => {
  const [createVisible, setCreateVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [professor, setProfessor] = useState('');
  const [cor, setCor] = useState('#2563EB');
  const [expandedMateriaId, setExpandedMateriaId] = useState<string | null>(null);
  const [diaSemana, setDiaSemana] = useState(1);
  const [horaInicio, setHoraInicio] = useState<Date>(() => createTime(19, 0));
  const [horaFim, setHoraFim] = useState<Date>(() => createTime(20, 30));
  const [activeTimePicker, setActiveTimePicker] = useState<null | 'inicio' | 'fim'>(null);
  const [actionError, setActionError] = useState('');
  const [scheduleError, setScheduleError] = useState('');

  const resetForm = () => {
    setNome('');
    setCodigo('');
    setProfessor('');
    setCor('#2563EB');
  };

  const resetScheduleForm = () => {
    setDiaSemana(1);
    setHoraInicio(createTime(19, 0));
    setHoraFim(createTime(20, 30));
    setActiveTimePicker(null);
    setActionError('');
    setScheduleError('');
  };

  const horariosByMateria = useMemo(() => {
    const map: Record<string, HorarioCompleto[]> = {};

    horarios.forEach((horario) => {
      if (!map[horario.materia_id]) {
        map[horario.materia_id] = [];
      }
      map[horario.materia_id].push(horario);
    });

    Object.keys(map).forEach((materiaId) => {
      map[materiaId].sort((a, b) => {
        if (a.dia_semana !== b.dia_semana) return a.dia_semana - b.dia_semana;
        return a.hora_inicio.localeCompare(b.hora_inicio);
      });
    });

    return map;
  }, [horarios]);

  useEffect(() => {
    if (!visible) {
      setCreateVisible(false);
      setExpandedMateriaId(null);
      resetForm();
      resetScheduleForm();
    }
  }, [visible]);

  const submit = async () => {
    if (!nome.trim()) return;

    setActionError('');

    try {
      await onAdd({
        nome: nome.trim(),
        codigo: codigo.trim(),
        professor: professor.trim(),
        cor
      });

      resetForm();
      setCreateVisible(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Não foi possível adicionar a matéria.');
    }
  };

  const submitHorario = async (materiaId: string) => {
    const normalizedInicio = formatTime(horaInicio);
    const normalizedFim = formatTime(horaFim);

    if (normalizedInicio >= normalizedFim) {
      setScheduleError('A hora de início precisa ser menor que a hora de fim.');
      return;
    }

    setScheduleError('');

    try {
      await onAddHorario({
        materiaId,
        dia: diaSemana,
        inicio: normalizedInicio,
        fim: normalizedFim
      });

      setExpandedMateriaId(null);
      resetScheduleForm();
    } catch (error) {
      setScheduleError(error instanceof Error ? error.message : 'Não foi possível adicionar o horário.');
    }
  };

  const handleTimePickerChange = (event: DateTimePickerEvent, value?: Date) => {
    const target = activeTimePicker;
    if (!target) return;

    if (Platform.OS === 'android') {
      setActiveTimePicker(null);
      if (event.type !== 'set' || !value) return;
    }

    if (!value) return;

    if (target === 'inicio') {
      setHoraInicio(applyPickedTime(value));
      return;
    }

    setHoraFim(applyPickedTime(value));
  };

  const totalHorarios = horarios.length;

  return (
    <>
      <ModalSheet visible={visible} title="Matérias e horários" onClose={onClose}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryTexts}>
            <Text style={styles.sectionTitle}>Sua organização acadêmica</Text>
            <Text style={styles.sectionHint}>
              {materias.length > 0
                ? `${materias.length} matéria(s) e ${totalHorarios} horário(s) cadastrado(s).`
                : 'Cadastre a primeira matéria e adicione os horários dentro dela.'}
            </Text>

            {actionError ? <Text style={styles.actionErrorText}>{actionError}</Text> : null}
          </View>

          <Button
            title="Nova matéria"
            variant="secondary"
            onPress={() => {
              setActionError('');
              resetForm();
              setCreateVisible(true);
            }}
          />
        </View>

        <View style={styles.list}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Matérias com horários</Text>
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
            materias.map((materia) => {
              const materiaHorarios = horariosByMateria[materia.id] || [];
              const expanded = expandedMateriaId === materia.id;

              return (
                <View key={materia.id} style={[styles.item, { borderLeftColor: materia.cor || '#2563EB' }]}>
                  <View style={styles.itemTopRow}>
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

                    <Pressable
                      style={styles.deleteButton}
                      onPress={async () => {
                        setActionError('');

                        try {
                          await onDelete(materia.id);
                        } catch (error) {
                          setActionError(error instanceof Error ? error.message : 'Não foi possível remover a matéria.');
                        }
                      }}
                    >
                      <MaterialCommunityIcons name="trash-can-outline" size={15} color={colors.error} />
                    </Pressable>
                  </View>

                  <View style={styles.scheduleSection}>
                    <View style={styles.scheduleHeaderRow}>
                      <Text style={styles.scheduleTitle}>Horários desta matéria</Text>

                      <Pressable
                        style={styles.addScheduleButton}
                        onPress={() => {
                          if (expanded) {
                            setExpandedMateriaId(null);
                            setActiveTimePicker(null);
                            setScheduleError('');
                            return;
                          }

                          setExpandedMateriaId(materia.id);
                          setActiveTimePicker(null);
                          setScheduleError('');
                        }}
                      >
                        <MaterialCommunityIcons
                          name={expanded ? 'close' : 'plus'}
                          size={13}
                          color={expanded ? '#A63A3A' : '#1E4F9E'}
                        />
                        <Text style={[styles.addScheduleButtonText, expanded && styles.addScheduleButtonTextDanger]}>
                          {expanded ? 'Cancelar' : 'Adicionar'}
                        </Text>
                      </Pressable>
                    </View>

                    {materiaHorarios.length === 0 ? (
                      <Text style={styles.scheduleEmptyText}>Nenhum horário cadastrado para esta matéria.</Text>
                    ) : (
                      materiaHorarios.map((horario) => {
                        const dayLabel = dayLabelByValue[horario.dia_semana] || `Dia ${horario.dia_semana}`;
                        return (
                          <View key={horario.id} style={styles.scheduleItem}>
                            <Text style={styles.scheduleItemText}>{`${dayLabel} | ${formatStoredTime(horario.hora_inicio)} - ${formatStoredTime(horario.hora_fim)}`}</Text>

                            <Pressable
                              style={styles.scheduleDeleteButton}
                              onPress={async () => {
                                setActionError('');

                                try {
                                  await onDeleteHorario(horario.id);
                                } catch (error) {
                                  setActionError(
                                    error instanceof Error
                                      ? error.message
                                      : 'Não foi possível remover o horário.'
                                  );
                                }
                              }}
                            >
                              <MaterialCommunityIcons name="trash-can-outline" size={13} color="#C34141" />
                            </Pressable>
                          </View>
                        );
                      })
                    )}

                    {expanded ? (
                      <View style={styles.scheduleFormCard}>
                        <Text style={styles.scheduleFormTitle}>Novo horário para {materia.nome}</Text>

                        <View style={styles.dayRow}>
                          {dayOptions.map((option) => {
                            const active = diaSemana === option.value;
                            return (
                              <Pressable
                                key={`${materia.id}-${option.value}`}
                                style={[styles.dayChip, active && styles.dayChipActive]}
                                onPress={() => setDiaSemana(option.value)}
                              >
                                <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>{option.label}</Text>
                              </Pressable>
                            );
                          })}
                        </View>

                        <View style={styles.scheduleTimeRow}>
                          <Pressable style={styles.scheduleTimeSelector} onPress={() => setActiveTimePicker('inicio')}>
                            <Text style={styles.scheduleTimeLabel}>Início</Text>
                            <Text style={styles.scheduleTimeValue}>{formatTime(horaInicio)}</Text>
                          </Pressable>

                          <Pressable style={styles.scheduleTimeSelector} onPress={() => setActiveTimePicker('fim')}>
                            <Text style={styles.scheduleTimeLabel}>Fim</Text>
                            <Text style={styles.scheduleTimeValue}>{formatTime(horaFim)}</Text>
                          </Pressable>
                        </View>

                        {activeTimePicker && Platform.OS === 'ios' ? (
                          <View style={styles.pickerWrap}>
                            <DateTimePicker
                              value={activeTimePicker === 'inicio' ? horaInicio : horaFim}
                              mode="time"
                              display="spinner"
                              onChange={handleTimePickerChange}
                              is24Hour
                            />

                            <Pressable style={styles.donePickerButton} onPress={() => setActiveTimePicker(null)}>
                              <Text style={styles.donePickerText}>Concluir seleção</Text>
                            </Pressable>
                          </View>
                        ) : null}

                        {activeTimePicker && Platform.OS === 'android' ? (
                          <DateTimePicker
                            value={activeTimePicker === 'inicio' ? horaInicio : horaFim}
                            mode="time"
                            display="default"
                            onChange={handleTimePickerChange}
                            is24Hour
                          />
                        ) : null}

                        {scheduleError ? <Text style={styles.scheduleErrorText}>{scheduleError}</Text> : null}

                        <Button title="Salvar horário" onPress={() => void submitHorario(materia.id)} />
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })
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
  actionErrorText: {
    marginTop: 4,
    color: '#C13A3A',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
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
    gap: spacing.xs
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xs
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
  },
  scheduleSection: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E3EAF5',
    backgroundColor: '#FAFCFF',
    padding: spacing.xs,
    gap: 6
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scheduleTitle: {
    color: '#3A5475',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  addScheduleButton: {
    minHeight: 26,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#CFE0F7',
    backgroundColor: '#ECF4FF',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  addScheduleButtonText: {
    color: '#1E4F9E',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11
  },
  addScheduleButtonTextDanger: {
    color: '#A63A3A'
  },
  scheduleEmptyText: {
    color: '#71839B',
    fontFamily: 'Inter_400Regular',
    fontSize: 11
  },
  scheduleItem: {
    minHeight: 30,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#DFE8F4',
    backgroundColor: '#FFFFFF',
    paddingLeft: spacing.xs,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6
  },
  scheduleItemText: {
    flex: 1,
    color: '#304866',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  scheduleDeleteButton: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDEFEF'
  },
  scheduleFormCard: {
    marginTop: 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D7E4F5',
    backgroundColor: '#FFFFFF',
    padding: spacing.xs,
    gap: spacing.xs
  },
  scheduleFormTitle: {
    color: '#2F4B6B',
    fontFamily: 'Inter_700Bold',
    fontSize: 12
  },
  dayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  dayChip: {
    minHeight: 28,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D8E3F3',
    backgroundColor: '#F3F7FC',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayChipActive: {
    borderColor: '#BFD4F8',
    backgroundColor: '#DCEAFF'
  },
  dayChipText: {
    color: '#4C5F79',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11
  },
  dayChipTextActive: {
    color: '#1049A9',
    fontFamily: 'Inter_700Bold'
  },
  scheduleTimeRow: {
    flexDirection: 'row',
    gap: spacing.xs
  },
  scheduleTimeSelector: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DDE5EF',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  scheduleTimeLabel: {
    fontFamily: 'Inter_600SemiBold',
    color: '#607189',
    fontSize: 10,
    letterSpacing: 0.7,
    textTransform: 'uppercase'
  },
  scheduleTimeValue: {
    marginTop: 2,
    fontFamily: 'Inter_700Bold',
    color: '#133260',
    fontSize: 16
  },
  pickerWrap: {
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
  scheduleErrorText: {
    color: '#C13A3A',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  }
});
