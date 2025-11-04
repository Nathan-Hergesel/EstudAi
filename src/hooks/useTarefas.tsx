// Store de tarefas com Context API para compartilhamento entre telas (Tarefas/Agenda/Conta)
import React, { useState, createContext, useContext, useMemo } from 'react';

// Estrutura da Tarefa
export interface Task {
  id: number;
  type: 'ATIVIDADE' | 'TRABALHO' | 'PROVA';
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  title: string;
  description: string;
  date: string; // formato: dd/MM/yyyy HH:mm
  completed?: boolean;
}

// Estrutura dos filtros aplicáveis ao conjunto de tarefas
export interface FilterOptions {
  period: string;
  type: string;
  difficulty: string;
  status: string;
}

export type TasksContextValue = {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTasks: number[];
  filters: FilterOptions;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, updatedTask: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  toggleTaskCompletion: (id: number) => void;
  batchUpdate: (ids: number[], updates: Partial<Task>) => void;
  batchDelete: (ids: number[]) => void;
  toggleTaskSelection: (id: number) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  applyFilters: (f: FilterOptions) => void;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado principal de tarefas e auxiliares
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextId, setNextId] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'Todos',
    type: 'Todos',
    difficulty: 'Todos',
    status: 'Todos',
  });
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  // Adiciona uma nova tarefa. Por padrão, toda tarefa começa como PENDENTE (completed: false)
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: nextId,
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
    setNextId(prev => prev + 1);
  };

  // Atualiza campos de uma tarefa específica
  const updateTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, ...updatedTask } : task)));
  };

  // Remove uma tarefa pelo id
  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Alterna o estado de conclusão da tarefa
  const toggleTaskCompletion = (id: number) => {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  // Aplica atualizações em lote em várias tarefas
  const batchUpdate = (taskIds: number[], updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => (taskIds.includes(task.id) ? { ...task, ...updates } : task)));
  };

  // Exclui várias tarefas e limpa a seleção
  const batchDelete = (taskIds: number[]) => {
    setTasks(prev => prev.filter(task => !taskIds.includes(task.id)));
    setSelectedTasks([]);
  };

  // Alterna seleção de uma tarefa no modo de edição em lote
  const toggleTaskSelection = (id: number) => {
    setSelectedTasks(prev => (prev.includes(id) ? prev.filter(taskId => taskId !== id) : [...prev, id]));
  };

  // Seleciona todas as tarefas filtradas
  const selectAllTasks = () => {
    setSelectedTasks(filteredTasks.map(task => task.id));
  };

  // Limpa a seleção atual
  const clearSelection = () => {
    setSelectedTasks([]);
  };

  // Aplica novos filtros
  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Aplica filtros na lista de tarefas
  const filteredTasks = tasks.filter(task => {
    if (filters.type !== 'Todos' && task.type !== filters.type) return false;
    if (filters.difficulty !== 'Todos' && task.difficulty !== filters.difficulty) return false;
    if (filters.status === 'Concluídas' && task.completed !== true) return false;
    // TODO: Filtro por período pode ser expandido aqui
    return true;
  });

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
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
      applyFilters,
    }),
    [tasks, filteredTasks, selectedTasks, filters]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

// Hook consumidor para obter o store compartilhado
export const useTasks = (): TasksContextValue => {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks deve ser usado dentro de <TasksProvider>');
  }
  return ctx;
};
