import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import type { Task, FilterOptions } from './useTarefas';
import { useAuth } from '../contexts/AuthContext';
import * as supabaseService from '../services/supabase.service';
import { Alert } from 'react-native';

export type TasksContextValue = {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTasks: number[];
  filters: FilterOptions;
  loading: boolean;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: number, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskCompletion: (id: number) => Promise<void>;
  batchUpdate: (ids: number[], updates: Partial<Task>) => Promise<void>;
  batchDelete: (ids: number[]) => Promise<void>;
  toggleTaskSelection: (id: number) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  applyFilters: (f: FilterOptions) => void;
  refreshTasks: () => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

// Mapear tipos entre interface local e banco
const mapTipoToDb = (type: Task['type']): 'Atividade' | 'Trabalho' | 'Prova' | 'Outro' => {
  switch (type) {
    case 'ATIVIDADE': return 'Atividade';
    case 'TRABALHO': return 'Trabalho';
    case 'PROVA': return 'Prova';
    default: return 'Outro';
  }
};

const mapTipoFromDb = (tipo: string): Task['type'] => {
  switch (tipo) {
    case 'Atividade': return 'ATIVIDADE';
    case 'Trabalho': return 'TRABALHO';
    case 'Prova': return 'PROVA';
    default: return 'ATIVIDADE';
  }
};

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'Todos',
    type: 'Todos',
    difficulty: 'Todos',
    status: 'Todos',
  });
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  // Carregar tarefas do Supabase quando usuário logar
  useEffect(() => {
    if (user) {
      refreshTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const refreshTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await supabaseService.listarTarefas(user.id);
      if (result.success && result.data) {
        // Converter formato do banco para formato local
        const convertedTasks: Task[] = result.data.map(t => {
          // Parse da data: "2025-11-15" + "14:30:00" -> "15/11/2025 14:30"
          let dateStr = '';
          if (t.data_entrega) {
            const [year, month, day] = t.data_entrega.split('-');
            const time = t.hora_entrega ? t.hora_entrega.substring(0, 5) : '00:00';
            dateStr = `${day}/${month}/${year} ${time}`;
          }

          return {
            id: t.id,
            title: t.titulo,
            description: t.descricao || '',
            type: mapTipoFromDb(t.tipo),
            difficulty: (t.dificuldade || 'Fácil') as Task['difficulty'],
            date: dateStr,
            completed: t.completed,
          };
        });
        setTasks(convertedTasks);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para criar tarefas');
      return;
    }

    // Parse da data: "15/11/2025 14:30" -> data_entrega + hora_entrega
    let dataEntrega = null;
    let horaEntrega = null;
    if (task.date) {
      const match = task.date.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
      if (match) {
        const [_, day, month, year, hour, minute] = match;
        dataEntrega = `${year}-${month}-${day}`;
        horaEntrega = `${hour}:${minute}:00`;
      }
    }

    setLoading(true);
    try {
      const result = await supabaseService.criarTarefa(user.id, {
        titulo: task.title,
        descricao: task.description,
        tipo: mapTipoToDb(task.type),
        dificuldade: task.difficulty,
        data_entrega: dataEntrega,
        hora_entrega: horaEntrega,
        completed: false,
        prioridade: 0,
        materia_id: null,
      });

      if (result.success) {
        await refreshTasks();
      } else {
        Alert.alert('Erro', 'Não foi possível criar a tarefa');
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível criar a tarefa');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, updatedTask: Partial<Task>) => {
    if (!user) return;

    // Parse da data se foi atualizada
    let dataEntrega = undefined;
    let horaEntrega = undefined;
    if (updatedTask.date) {
      const match = updatedTask.date.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
      if (match) {
        const [_, day, month, year, hour, minute] = match;
        dataEntrega = `${year}-${month}-${day}`;
        horaEntrega = `${hour}:${minute}:00`;
      }
    }

    setLoading(true);
    try {
      const updates: any = {};
      if (updatedTask.title !== undefined) updates.titulo = updatedTask.title;
      if (updatedTask.description !== undefined) updates.descricao = updatedTask.description;
      if (updatedTask.type !== undefined) updates.tipo = mapTipoToDb(updatedTask.type);
      if (updatedTask.difficulty !== undefined) updates.dificuldade = updatedTask.difficulty;
      if (updatedTask.completed !== undefined) updates.completed = updatedTask.completed;
      if (dataEntrega !== undefined) updates.data_entrega = dataEntrega;
      if (horaEntrega !== undefined) updates.hora_entrega = horaEntrega;

      const result = await supabaseService.atualizarTarefa(id, updates);
      if (result.success) {
        await refreshTasks();
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar a tarefa');
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await supabaseService.removerTarefa(id);
      if (result.success) {
        await refreshTasks();
      } else {
        Alert.alert('Erro', 'Não foi possível deletar a tarefa');
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível deletar a tarefa');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    if (!user) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setLoading(true);
    try {
      const result = await supabaseService.toggleTarefaConcluida(id, !task.completed);
      if (result.success) {
        await refreshTasks();
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o status da tarefa');
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status da tarefa');
    } finally {
      setLoading(false);
    }
  };

  const batchUpdate = async (ids: number[], updates: Partial<Task>) => {
    if (!user) return;

    setLoading(true);
    try {
      for (const id of ids) {
        await updateTask(id, updates);
      }
      await refreshTasks();
    } finally {
      setLoading(false);
    }
  };

  const batchDelete = async (ids: number[]) => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await supabaseService.removerTarefasEmLote(ids);
      if (result.success) {
        setSelectedTasks([]);
        await refreshTasks();
      } else {
        Alert.alert('Erro', 'Não foi possível deletar as tarefas');
      }
    } catch (error) {
      console.error('Erro ao deletar tarefas:', error);
      Alert.alert('Erro', 'Não foi possível deletar as tarefas');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskSelection = (id: number) => {
    setSelectedTasks(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.type !== 'Todos' && task.type !== filters.type) return false;
    if (filters.difficulty !== 'Todos' && task.difficulty !== filters.difficulty) return false;
    if (filters.status === 'Concluídas' && task.completed !== true) return false;
    return true;
  });

  const selectAllTasks = () => setSelectedTasks(filteredTasks.map(t => t.id));
  const clearSelection = () => setSelectedTasks([]);
  const applyFilters = (f: FilterOptions) => setFilters(f);

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      filteredTasks,
      selectedTasks,
      filters,
      loading,
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
      refreshTasks,
    }),
    [tasks, filteredTasks, selectedTasks, filters, loading]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasks = (): TasksContextValue => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks deve ser usado dentro de <TasksProvider>');
  return ctx;
};
