import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { colors, radius, spacing } from '@/constants/tokens';
import { Task, TaskType } from '@/types/app.types';
import { formatUiDate, parseUiDate } from '@/utils/date';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  initialTask?: Task | null;
};

type TypeOption = {
  value: TaskType;
  label: string;
  atividade?: boolean;
  leitura?: boolean;
  trabalho?: boolean;
  prova?: boolean;
};

const typeOptions: TypeOption[] = [
  { value: 'ATIVIDADE', label: 'ATIVIDADE', atividade: true },
  { value: 'LEITURA', label: 'LEITURA', leitura: true },
  { value: 'TRABALHO', label: 'TRABALHO', trabalho: true },
  { value: 'PROVA', label: 'PROVA', prova: true }
];

export const TarefaModal = ({ visible, onClose, onSave, initialTask }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(() => new Date());
  const [activePicker, setActivePicker] = useState<null | 'date' | 'time'>(null);
  const [type, setType] = useState<TaskType>('ATIVIDADE');

  const pad = (value: number): string => `${value}`.padStart(2, '0');
  const formatDate = (value: Date): string => `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}`;
  const formatTime = (value: Date): string => `${pad(value.getHours())}:${pad(value.getMinutes())}`;

  useEffect(() => {
    if (!initialTask) {
      const now = new Date();
      setTitle('');
      setDescription('');
      setSelectedDateTime(now);
      setDate(formatUiDate(now.toISOString()));
      setActivePicker(null);
      setType('ATIVIDADE');
      return;
    }

    const parsed = new Date(parseUiDate(initialTask.date));
    const safeDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;

    setTitle(initialTask.title);
    setDescription(initialTask.description);
    setSelectedDateTime(safeDate);
    setDate(formatUiDate(safeDate.toISOString()));
    setActivePicker(null);
    setType(initialTask.type);
  }, [initialTask, visible]);

  const handlePickerChange = (event: DateTimePickerEvent, value?: Date) => {
    const field = activePicker;
    if (!field) return;

    if (Platform.OS === 'android') {
      setActivePicker(null);
      if (event.type !== 'set' || !value) return;
    }

    if (!value) return;

    const merged = new Date(selectedDateTime);

    if (field === 'date') {
      merged.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
    } else {
      merged.setHours(value.getHours(), value.getMinutes(), 0, 0);
    }

    setSelectedDateTime(merged);
    setDate(formatUiDate(merged.toISOString()));
  };

  const pickerMode = activePicker === 'date' ? 'date' : 'time';

  const submit = async () => {
    if (!title || !description || !date) return;
    await onSave({
      title,
      description,
      date,
      type,
      materiaId: initialTask?.materiaId || null
    });
    onClose();
  };

  return (
    <ModalSheet visible={visible} title={initialTask ? 'Editar tarefa' : 'Nova tarefa'} onClose={onClose}>
      <Input label="Título" value={title} onChangeText={setTitle} placeholder="Ex: Revisão de cálculo" />
      <Input label="Descrição" value={description} onChangeText={setDescription} multiline />

      <View style={styles.sectionCard}>
        <Text style={styles.groupTitle}>Data e horário</Text>
        <View style={styles.dateTimeRow}>
          <Pressable style={[styles.selectorCard, styles.selectorCardDate]} onPress={() => setActivePicker('date')}>
            <Text style={styles.selectorLabel}>Data</Text>
            <Text style={styles.selectorValue}>{formatDate(selectedDateTime)}</Text>
          </Pressable>

          <Pressable style={styles.selectorCard} onPress={() => setActivePicker('time')}>
            <Text style={styles.selectorLabel}>Hora</Text>
            <Text style={styles.selectorValue}>{formatTime(selectedDateTime)}</Text>
          </Pressable>
        </View>

        {activePicker && Platform.OS === 'ios' ? (
          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={selectedDateTime}
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
            value={selectedDateTime}
            mode={pickerMode}
            display="default"
            onChange={handlePickerChange}
            is24Hour
          />
        ) : null}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Tipo</Text>
          <View style={styles.row}>
            {typeOptions.map((item) => {
              const active = type === item.value;

              return (
                <Pressable
                  key={item.label}
                  style={[
                    styles.chip,
                    item.atividade ? styles.chipAtividade : null,
                    item.leitura ? styles.chipLeitura : null,
                    item.trabalho ? styles.chipTrabalho : null,
                    item.prova ? styles.chipProva : null,
                    active ? styles.chipActive : null,
                    active && item.atividade ? styles.chipAtividadeActive : null,
                    active && item.leitura ? styles.chipLeituraActive : null,
                    active && item.trabalho ? styles.chipTrabalhoActive : null,
                    active && item.prova ? styles.chipProvaActive : null
                  ]}
                  onPress={() => setType(item.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      item.atividade ? styles.chipTextAtividade : null,
                      item.leitura ? styles.chipTextLeitura : null,
                      item.trabalho ? styles.chipTextTrabalho : null,
                      item.prova ? styles.chipTextProva : null,
                      active ? styles.chipTextActive : null,
                      active && item.atividade ? styles.chipTextAtividadeActive : null,
                      active && item.leitura ? styles.chipTextLeituraActive : null,
                      active && item.trabalho ? styles.chipTextTrabalhoActive : null,
                      active && item.prova ? styles.chipTextProvaActive : null
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <Button title="Salvar tarefa" onPress={submit} />
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE6F0',
    backgroundColor: colors.surfaceLowest,
    padding: spacing.sm
  },
  group: {
    gap: spacing.xs
  },
  groupTitle: {
    fontFamily: 'Inter_600SemiBold',
    color: '#41546E',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 11
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: spacing.xs
  },
  selectorCard: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DDE5EF',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  selectorCardDate: {
    flex: 1.35
  },
  selectorLabel: {
    fontFamily: 'Inter_600SemiBold',
    color: '#607189',
    fontSize: 10,
    letterSpacing: 0.7,
    textTransform: 'uppercase'
  },
  selectorValue: {
    marginTop: 2,
    fontFamily: 'Inter_700Bold',
    color: '#133260',
    fontSize: 16
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
  chip: {
    minHeight: 32,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: '#EEF2F7',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1E8F1'
  },
  chipActive: {
    backgroundColor: '#DCEAFF',
    borderColor: '#BFD4F8'
  },
  chipAtividade: {
    backgroundColor: '#EAF2FF',
    borderColor: '#BCD1F8'
  },
  chipAtividadeActive: {
    backgroundColor: '#D3E3FF',
    borderColor: '#99B9F0'
  },
  chipLeitura: {
    backgroundColor: '#FFF8E1',
    borderColor: '#F1DF9A'
  },
  chipLeituraActive: {
    backgroundColor: '#FFE9A8',
    borderColor: '#E2C563'
  },
  chipTrabalho: {
    backgroundColor: '#E8FFF3',
    borderColor: '#B8EACC'
  },
  chipTrabalhoActive: {
    backgroundColor: '#CBF8DE',
    borderColor: '#88D9AD'
  },
  chipProva: {
    backgroundColor: '#FFEDEC',
    borderColor: '#F2C2BE'
  },
  chipProvaActive: {
    backgroundColor: '#FFD8D5',
    borderColor: '#E59B95'
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    color: '#324863',
    fontSize: 12
  },
  chipTextAtividade: {
    color: '#2A4F95'
  },
  chipTextLeitura: {
    color: '#8E6A15'
  },
  chipTextTrabalho: {
    color: '#1C7A51'
  },
  chipTextProva: {
    color: '#A03C38'
  },
  chipTextActive: {
    fontFamily: 'Inter_700Bold',
    color: '#0E3F9E'
  },
  chipTextAtividadeActive: {
    color: '#1F407F'
  },
  chipTextLeituraActive: {
    color: '#6E5108'
  },
  chipTextTrabalhoActive: {
    color: '#0F6540'
  },
  chipTextProvaActive: {
    color: '#8D302C'
  }
});
