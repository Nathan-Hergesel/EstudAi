// Modal para criar/editar tarefas com seleção de data e hora
// Possui fluxo em duas etapas: primeiro data, depois horário
import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,Modal,ScrollView,Alert,Platform,} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
// Tipos e cores do app
import { Task } from '../hooks/useTarefas';
import { colors } from '../constants/colors';
// Estilos compartilhados e específicos deste modal
import globalStyles from '../global/styles';
import { tarefaModalStyles } from '../global/styles';

// Propriedades do modal de tarefa
interface TarefaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  task?: Task | null;
  isEditing?: boolean;
}

const TarefaModal: React.FC<TarefaModalProps> = ({
  visible,
  onClose,
  onSave,
  task,
  isEditing = false,
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ATIVIDADE' as Task['type'],
    difficulty: 'Fácil' as Task['difficulty'],
    date: '',
  });
  // Controle de exibição dos seletores e data temporária entre etapas
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);


  // Converte a string dd/mm/aaaa HH:MM em objeto Date
  const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/;
    const m = dateStr.match(regex);
    if (!m) return null;
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10) - 1;
    const year = parseInt(m[3], 10);
    const hours = m[4] ? parseInt(m[4], 10) : 0;
    const minutes = m[5] ? parseInt(m[5], 10) : 0;
    return new Date(year, month, day, hours, minutes);
  };

  // Sincroniza o formulário na abertura do modal
  useEffect(() => {
    if (task && isEditing) {
      setFormData({
        title: task.title,
        description: task.description,
        type: task.type,
        difficulty: task.difficulty,
        date: task.date,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'ATIVIDADE',
        difficulty: 'Fácil',
        date: '',
      });
    }

    if (!visible) {
      setShowDatePicker(false);
      setShowTimePicker(false);
      setTempDate(null);
    }
  }, [task, isEditing, visible]);
  
  // Handler do componente de data; ao selecionar, abre o seletor de hora
  const handleDateChange = (event: any, selectedDate?: Date) => {

    const dismissed = event?.type === 'dismissed' || !selectedDate;
    setShowDatePicker(false);
    if (dismissed) {
  
      setTempDate(null);
      setShowTimePicker(false);
      return;
    }
  
    const dateOnly = new Date(selectedDate as Date);
    dateOnly.setHours(0, 0, 0, 0);
    setTempDate(dateOnly);
 
    setShowTimePicker(true);
  };

  // Handler do componente de hora; ao confirmar, formata e salva no formulário
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    const dismissed = event?.type === 'dismissed' || !selectedTime;
    setShowTimePicker(false);
    if (dismissed) {
     
      setTempDate(null);
      return;
    }
    const time = selectedTime as Date;
    const baseDate = tempDate ? new Date(tempDate) : new Date();
    const finalDate = new Date(baseDate);
    finalDate.setHours(time.getHours());
    finalDate.setMinutes(time.getMinutes());
 
    const formatted = `${finalDate.getDate().toString().padStart(2, '0')}/${(finalDate.getMonth()+1).toString().padStart(2, '0')}/${finalDate.getFullYear()} ${finalDate.getHours().toString().padStart(2, '0')}:${finalDate.getMinutes().toString().padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, date: formatted }));
    setTempDate(null);
  };

  // Abre o seletor de data (usa a data já preenchida, se houver)
  const handleOpenDatePicker = () => {
  
    const parsed = parseDateString(formData.date);
    setTempDate(parsed || new Date());
    setShowDatePicker(true);
  };

  // Fecha modal limpando estados do picker
  const handleClose = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    setTempDate(null);
    onClose();
  };

  // Validação básica do formulário e envio ao onSave
  const handleSave = () => {
    if (!formData.title.trim()) {
      Alert.alert('Erro', 'O título é obrigatório');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Erro', 'A descrição é obrigatória');
      return;
    }
    if (!formData.date.trim()) {
      Alert.alert('Erro', 'A data é obrigatória');
      return;
    }

    onSave(formData);
    onClose();
  };

  const typeOptions: Task['type'][] = ['ATIVIDADE', 'TRABALHO', 'PROVA'];
  const difficultyOptions: Task['difficulty'][] = ['Fácil', 'Médio', 'Difícil'];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[globalStyles.container, globalStyles.containerCompact]}>
        <View style={globalStyles.header}>
          {/* Cabeçalho com ações de Cancelar e Salvar */}
          <TouchableOpacity onPress={onClose} style={globalStyles.buttonSecondary}>
            <Text style={globalStyles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={globalStyles.title}>
            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={globalStyles.button}>
            <Text style={globalStyles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={globalStyles.content} showsVerticalScrollIndicator={false}>
          {/* Campo: Título */}
          <View style={globalStyles.section}>
            <Text style={tarefaModalStyles.label}>Título *</Text>
            <TextInput
              style={tarefaModalStyles.input}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="Digite o título da tarefa"
              placeholderTextColor={colors.textoTerciario}
            />
          </View>

          {/* Campo: Descrição */}
          <View style={globalStyles.section}>
            <Text style={tarefaModalStyles.label}>Descrição *</Text>
            <TextInput
              style={[tarefaModalStyles.input, tarefaModalStyles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Descreva a tarefa..."
              placeholderTextColor={colors.textoTerciario}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Campo: Categoria (ATIVIDADE/TRABALHO/PROVA) */}
          <View style={globalStyles.section}>
            <Text style={tarefaModalStyles.label}>Categoria *</Text>
            <View style={globalStyles.chipsRow}>
              {typeOptions.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    globalStyles.chip,
                    type === 'ATIVIDADE' && tarefaModalStyles.optionActivity,
                    type === 'TRABALHO' && tarefaModalStyles.optionWork,
                    type === 'PROVA' && tarefaModalStyles.optionExam,
                    formData.type === type && tarefaModalStyles.chipSelected,
                    formData.type === type && type === 'ATIVIDADE' && tarefaModalStyles.optionActivitySelected,
                    formData.type === type && type === 'TRABALHO' && tarefaModalStyles.optionWorkSelected,
                    formData.type === type && type === 'PROVA' && tarefaModalStyles.optionExamSelected,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, type }))}
                >
                  <Text
                    style={[
                      globalStyles.chipText,
                      formData.type === type && tarefaModalStyles.optionTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Campo: Dificuldade (Fácil/Médio/Difícil) */}
          <View style={globalStyles.section}>
            <Text style={tarefaModalStyles.label}>Dificuldade *</Text>
            <View style={globalStyles.chipsRow}>
              {difficultyOptions.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    globalStyles.chip,
                    difficulty === 'Fácil' && tarefaModalStyles.optionEasy,
                    difficulty === 'Médio' && tarefaModalStyles.optionMedium,
                    difficulty === 'Difícil' && tarefaModalStyles.optionHard,
                    formData.difficulty === difficulty && tarefaModalStyles.chipSelected,
                    formData.difficulty === difficulty && difficulty === 'Fácil' && tarefaModalStyles.optionEasySelected,
                    formData.difficulty === difficulty && difficulty === 'Médio' && tarefaModalStyles.optionMediumSelected,
                    formData.difficulty === difficulty && difficulty === 'Difícil' && tarefaModalStyles.optionHardSelected,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, difficulty }))}
                >
                  <Text
                    style={[
                      globalStyles.chipText,
                      formData.difficulty === difficulty && tarefaModalStyles.optionTextSelected,
                    ]}
                  >
                    {difficulty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Campo: Data e Hora (fluxo em duas etapas) */}
          <View style={globalStyles.section}>
            <Text style={tarefaModalStyles.label}>Data e Hora *</Text>
            <TouchableOpacity
              style={tarefaModalStyles.input}
              onPress={handleOpenDatePicker}
            >
              <Text style={{ color: formData.date ? colors.textoPrimario : colors.textoTerciario }}>
                {formData.date || 'Selecione a data e hora'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={tempDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                // Força locale em iOS; no Android usa o idioma do sistema
                locale={Platform.OS === 'ios' ? 'pt-BR' : undefined}
                onChange={handleDateChange}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={tempDate || new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                // Exibe relógio 24h no Android e locale pt-BR no iOS
                is24Hour={true}
                locale={Platform.OS === 'ios' ? 'pt-BR' : undefined}
                onChange={handleTimeChange}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default TarefaModal;
