interface TaskCardProps {
  task: Task;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onToggleSelection: (id: number) => void;
  isSelected: boolean;
  isSelectionMode: boolean;
}
import {
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  EditIcon,
  DeleteIcon,
  CheckIcon,
} from '../../assets/icons';
// Tela principal de Tarefas
// Inclui: busca, filtros, seleção/batch, e modais de criação/edição e filtros
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { colors } from '../../constants/colors';
import { styles } from './styles';
import { useTasks } from '../../hooks/TasksContext';
import { Task, FilterOptions } from '../../hooks/useTarefas';
import TarefaModal from '../../components/TarefaModal';
import FilterModal from '../../components/FiltroModal';
import BatchEditModal from '../../components/EditarModal';
// Card de Tarefa exibido na lista
const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleComplete, 
  onToggleSelection, 
  isSelected, 
  isSelectionMode 
}) => {
  // Define estilo visual com base no tipo da tarefa
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'ATIVIDADE':
  // icons provided by src/assets/icons
        return styles.labelActivity;
      case 'TRABALHO':
        return styles.labelWork;
      case 'PROVA':
        return styles.labelExam;
      default:
        return styles.labelActivity;
    }
  };

  // Define estilo visual com base na dificuldade da tarefa
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return styles.labelDifficulty;
      case 'Médio':
        return styles.labelDifficultyMedium;
      case 'Difícil':
        return styles.labelDifficultyHard;
      default:
        return styles.labelDifficulty;
    }
  };

  // Confirmação de exclusão da tarefa
  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDelete(task.id) },
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[
        styles.taskCard, 
        task.completed && styles.taskCardCompleted,
        isSelected && styles.taskCardSelected
      ]}
      onPress={() => isSelectionMode ? onToggleSelection(task.id) : null}
      activeOpacity={isSelectionMode ? 0.7 : 1}
    >
  {/* Indicador visual: seleção usa fundo e borda; sem checkbox explícito */}
      
      <View style={styles.labelsContainer}>
        <View style={[styles.label, getTypeStyle(task.type)]}>
          <Text style={[styles.labelText, task.completed && styles.labelTextCompleted]}>{task.type}</Text>
        </View>
        <View style={[styles.label, getDifficultyStyle(task.difficulty)]}>
          <Text style={[styles.labelText, task.completed && styles.labelTextCompleted]}>{task.difficulty}</Text>
        </View>
        {/* Removidos indicadores de status em forma de círculo */}
      </View>
      
      <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
        {task.title}
      </Text>
      <Text style={[styles.taskDescription, task.completed && styles.taskDescriptionCompleted]}>
        {task.description}
      </Text>
      
      <View style={styles.dateTimeContainer}>
    <CalendarIcon width={16} height={16} style={styles.dateTimeIcon} />
        <Text style={[styles.dateTimeText, task.completed && styles.dateTimeTextCompleted]}>
          {task.date}
        </Text>
      </View>
      
      {!isSelectionMode && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onToggleComplete(task.id)}
          >
            <CheckIcon width={16} height={16} />
          </TouchableOpacity>
          {!task.completed && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onEdit(task.id)}
            >
              <EditIcon width={16} height={16} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleDelete}
          >
            <DeleteIcon width={16} height={16} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function TarefasScreen() {
  const [activeTab, setActiveTab] = useState('TAREFAS');
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [batchEditModalVisible, setBatchEditModalVisible] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const { 
    filteredTasks, 
    selectedTasks, 
    filters,
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskCompletion,
    batchUpdate,
    batchDelete,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    applyFilters
  } = useTasks();

  const topNavItems = ['Criar', 'TAREFAS', 'Editar'];

  // Abre o modal para criação de nova tarefa
  const handleCreateTask = () => {
    setEditingTask(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  // Abre o modal para edição da tarefa selecionada
  const handleEditTask = (id: number) => {
    const task = filteredTasks.find((t: Task) => t.id === id);
    if (task) {
      setEditingTask(task);
      setIsEditing(true);
      setModalVisible(true);
    }
  };

  // Salva: atualiza se estiver editando, senão cria nova tarefa
  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (isEditing && editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  // Remove tarefa
  const handleDeleteTask = (id: number) => {
    deleteTask(id);
  };

  // Alterna status concluída/pendente
  const handleToggleComplete = (id: number) => {
    toggleTaskCompletion(id);
  };

  // Ativa/Desativa modo de seleção para edição em lote
  const handleEditMode = () => {
    if (isSelectionMode) {
      setIsSelectionMode(false);
      clearSelection();
    } else {
      setIsSelectionMode(true);
    }
  };

  // Abre o modal de edição em lote (se houver itens selecionados)
  const handleBatchEdit = () => {
    if (selectedTasks.length === 0) {
      Alert.alert('Aviso', 'Selecione pelo menos uma tarefa para editar');
      return;
    }
    setBatchEditModalVisible(true);
  };

  // Aplica filtros vindos do modal de filtros
  const handleApplyFilters = (newFilters: FilterOptions) => {
    applyFilters(newFilters);
  };

  // Seleciona/Desmarca todas as tarefas atualmente filtradas
  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      clearSelection();
    } else {
      selectAllTasks();
    }
  };

  // Aplica busca textual sobre a lista já filtrada
  const searchFilteredTasks = filteredTasks.filter(task =>
    task.title.toLowerCase().includes(searchText.toLowerCase()) ||
    task.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // Dados das tarefas atualmente selecionadas (para o modal em lote)
  const selectedTasksData = filteredTasks.filter(task => selectedTasks.includes(task.id));

  return (
    <View style={styles.container}>
  <StatusBar barStyle="dark-content" backgroundColor={colors.fundo} />
      
  {/* Navegação Superior */}
      <View style={styles.topNavigation}>
        {topNavItems.map((item) => {
          // fornece feedback visual claro sobre o estado atual
          // 'Criar' deve aparecer ativo enquanto o modal de criação estiver aberto
          // 'Editar' deve aparecer ativo enquanto o modo de seleção/edição estiver habilitado
          const isActionCreate = item === 'Criar';
          const isActionEdit = item === 'Editar';
          const isActive = activeTab === item || (isActionCreate && modalVisible) || (isActionEdit && isSelectionMode);

          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.navButton,
                isActive ? styles.navButtonActive : styles.navButtonInactive,
              ]}
              onPress={() => {
                if (item === 'Criar') {
                  handleCreateTask();
                } else if (item === 'Editar') {
                  handleEditMode();
                } else {
                  setActiveTab(item);
                }
              }}
            >
              <Text
                style={[
                  styles.navButtonText,
                  isActive ? styles.navButtonTextActive : styles.navButtonTextInactive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

  {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon width={20} height={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            placeholderTextColor={colors.textoTerciario}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        <View style={styles.filtersContainer}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <FilterIcon width={20} height={20} style={styles.filterIcon} />
            <Text style={styles.filterButtonText}>Filtros</Text>
          </TouchableOpacity>
          
          {isSelectionMode && (
            <>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={handleSelectAll}
              >
                <Text style={styles.filterButtonText}>
                  {selectedTasks.length === filteredTasks.length ? 'Desmarcar' : 'Selecionar'} Todos
                </Text>
              </TouchableOpacity>
              
              {selectedTasks.length > 0 && (
                <TouchableOpacity 
                  style={[styles.filterButton, styles.batchEditButton]}
                  onPress={handleBatchEdit}
                >
                  <Text style={[styles.filterButtonText, styles.batchEditText]}>
                    Editar ({selectedTasks.length})
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

  {/* Lista de Tarefas */}
      <ScrollView style={styles.tasksContainer} showsVerticalScrollIndicator={false}>
        {searchFilteredTasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEdit={(id) => handleEditTask(id)}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onToggleSelection={toggleTaskSelection}
            isSelected={selectedTasks.includes(task.id)}
            isSelectionMode={isSelectionMode}
          />
        ))}
        {searchFilteredTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchText ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa cadastrada'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchText ? 'Tente ajustar sua pesquisa' : 'Toque em "Criar" para adicionar uma nova tarefa'}
            </Text>
          </View>
        )}
      </ScrollView>


  {/* Modal de Edição/Criação */}
      <TarefaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTask}
        task={editingTask}
        isEditing={isEditing}
      />

  {/* Modal de Filtros */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

  {/* Modal de Edição em Lote */}
      <BatchEditModal
        visible={batchEditModalVisible}
        onClose={() => setBatchEditModalVisible(false)}
        selectedTasks={selectedTasksData}
        onBatchUpdate={batchUpdate}
        onBatchDelete={batchDelete}
      />
    </View>
  );
}