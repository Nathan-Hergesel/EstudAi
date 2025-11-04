// Modal de edição em lote de tarefas
// Permite aplicar ações (concluir, marcar como pendente e excluir) em várias tarefas selecionadas ao mesmo tempo.
import React, { useState } from 'react';
import {View,Text,TouchableOpacity,Modal,ScrollView,Alert,} from 'react-native';
// Estilos globais compartilhados pelos modais e estilos específicos deste modal
import globalStyles from '../global/styles';
import { editarModalStyles } from '../global/styles';
import { colors } from '../constants/colors';
// Tipo de dados da Tarefa usado no aplicativo
import { Task } from '../hooks/useTarefas';

// Propriedades aceitas pelo componente de edição em lote
interface BatchEditModalProps {
  // Controla a visibilidade do modal
  visible: boolean;
  // Função chamada para fechar o modal
  onClose: () => void;
  // Lista de tarefas selecionadas que serão afetadas
  selectedTasks: Task[];
  // Atualiza várias tarefas de uma vez com os campos passados em "updates"
  onBatchUpdate: (taskIds: number[], updates: Partial<Task>) => void;
  // Exclui várias tarefas de uma vez
  onBatchDelete: (taskIds: number[]) => void;
}

// Componente funcional do modal de edição em lote
const BatchEditModal: React.FC<BatchEditModalProps> = ({
  visible,
  onClose,
  selectedTasks,
  onBatchUpdate,
  onBatchDelete,
}) => {
  // Estado local com a ação selecionada pelo usuário
  // Valores possíveis: 'complete' | 'delete' | ''
  const [selectedAction, setSelectedAction] = useState<string>('');

  // Aplica a ação escolhida às tarefas selecionadas
  const handleBatchAction = () => {
    if (!selectedAction) {
      Alert.alert('Erro', 'Selecione uma ação');
      return;
    }

    // Extrai apenas os IDs das tarefas selecionadas
    const taskIds = selectedTasks.map(task => task.id);

    switch (selectedAction) {
      case 'complete':
        // Marca todas as tarefas como concluídas
        onBatchUpdate(taskIds, { completed: true });
        Alert.alert('Sucesso', `${selectedTasks.length} tarefa(s) marcada(s) como concluída(s)`);
        break;
      // Removido: opção de marcar como pendentes (todas já nascem pendentes)
      case 'delete':
        // Solicita confirmação antes de excluir definitivamente
        Alert.alert(
          'Confirmar Exclusão',
          `Tem certeza que deseja excluir ${selectedTasks.length} tarefa(s)?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Excluir', 
              style: 'destructive', 
              onPress: () => {
                // Executa a exclusão em lote e informa sucesso
                onBatchDelete(taskIds);
                Alert.alert('Sucesso', `${selectedTasks.length} tarefa(s) excluída(s)`);
              }
            },
          ]
        );
        break;
    }

    // Fecha o modal após a ação
    onClose();
  };

  // Ações disponíveis para o usuário (com rótulo e cor de referência)
  const actionOptions = [
    { key: 'complete', label: 'Marcar como Concluídas', color: colors.sucesso },
    { key: 'delete', label: 'Excluir Tarefas', color: colors.erro },
  ];

  return (
    // Modal tipo folha de página, com animação de slide
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
  <View style={[globalStyles.container, globalStyles.containerCompact]}>
        {/* Cabeçalho do modal: botão de cancelar, título e espaço para centralizar */}
        <View style={globalStyles.header}>
          <TouchableOpacity onPress={onClose} style={globalStyles.buttonSecondary}>
            <Text style={globalStyles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={globalStyles.title}>Edição em Lote</Text>
          <View style={editarModalStyles.headerPlaceholder} />
        </View>

        {/* Conteúdo rolável do modal */}
        <ScrollView style={globalStyles.content} showsVerticalScrollIndicator={false}>
          <View>
            {/* Quantidade de tarefas selecionadas */}
            <Text style={globalStyles.text}>
              {selectedTasks.length} tarefa(s) selecionada(s)
            </Text>
          </View>

          <View>
            {/* Seção: escolher uma ação para aplicar em lote */}
            <Text style={globalStyles.label}>Selecione uma ação:</Text>

            {actionOptions.map((action) => {
              const isSelected = selectedAction === action.key;
              return (
                <TouchableOpacity
                  key={action.key}
                  style={[
                    editarModalStyles.actionItem,
                    { borderWidth: isSelected ? 2 : 1, borderColor: action.color },
                  ]}
                  onPress={() => setSelectedAction(action.key)}
                >
                  {/* Indicador visual da ação (ponto colorido) */}
                  <View style={[editarModalStyles.actionDot, { backgroundColor: action.color }]} />
                  <Text
                    style={[
                      editarModalStyles.actionLabel,
                      {
                        color: isSelected ? colors.textoPrimario : colors.textoSecundario,
                        fontWeight: isSelected ? '600' : '500',
                      },
                    ]}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View>
            {/* Lista simples das tarefas selecionadas (título e metadados) */}
            <Text style={globalStyles.label}>Tarefas selecionadas:</Text>
            {selectedTasks.map((task) => (
              <View key={task.id} style={editarModalStyles.taskItem}>
                <Text style={globalStyles.text}>{task.title}</Text>
                <Text style={globalStyles.text}>
                  {task.type} - {task.difficulty}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Rodapé com botão para aplicar a ação escolhida */}
        <View style={globalStyles.footer}>
          <TouchableOpacity
            style={[globalStyles.button, !selectedAction && { backgroundColor: colors.borda }]}
            onPress={handleBatchAction}
            disabled={!selectedAction}
          >
            <Text style={[globalStyles.buttonText, !selectedAction && { color: colors.textoTerciario }]}>
              Aplicar Ação
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BatchEditModal;


