import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { supabaseService } from '@/services/supabase.service';
import { Task, TaskFilters } from '@/types/app.types';
import { fromDbTask, mapTypeToDb, toDbTask } from '@/utils/task-mappers';
import { parseUiDate, sameDay, startOfDay } from '@/utils/date';

type TasksContextValue = {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTasks: string[];
  filters: TaskFilters;
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<{ success: boolean; error?: string }>;
  updateTask: (id: string, task: Partial<Task>) => Promise<{ success: boolean; error?: string }>;
  deleteTask: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  batchUpdate: (ids: string[], updates: Partial<Task>) => Promise<void>;
  batchDelete: (ids: string[]) => Promise<void>;
  toggleTaskSelection: (id: string) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  applyFilters: (next: Partial<TaskFilters>) => void;
  refreshTasks: () => Promise<void>;
};

const defaultFilters: TaskFilters = {
  period: 'Todos',
  type: 'Todos',
  status: 'Todos'
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [loading, setLoading] = useState(false);

  const refreshTasks = async () => {
    if (!user?.id) return;
    setLoading(true);
    const result = await supabaseService.listarTarefas(user.id);
    if (result.success && result.data) {
      setTasks(result.data.map(fromDbTask));
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshTasks();
  }, [user?.id]);

  const addTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    if (!user?.id) return { success: false, error: 'Usuário não autenticado.' };

    const result = await supabaseService.criarTarefa(toDbTask(task, user.id));
    if (!result.success) return { success: false, error: result.error };

    await refreshTasks();
    return { success: true };
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    const payload: Record<string, unknown> = {};
    if (task.title !== undefined) payload.titulo = task.title;
    if (task.description !== undefined) payload.descricao = task.description;
    if (task.date !== undefined) payload.data_entrega = parseUiDate(task.date);
    if (task.type !== undefined) payload.tipo = mapTypeToDb(task.type);
    if (task.completed !== undefined) payload.completed = task.completed;
    if (task.materiaId !== undefined) payload.materia_id = task.materiaId;

    const result = await supabaseService.atualizarTarefa(id, payload);
    if (!result.success) return { success: false, error: result.error };

    await refreshTasks();
    return { success: true };
  };

  const deleteTask = async (id: string) => {
    const result = await supabaseService.removerTarefa(id);
    if (!result.success) return { success: false, error: result.error };

    await refreshTasks();
    return { success: true };
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    await updateTask(id, { completed: !task.completed });
  };

  const batchUpdate = async (ids: string[], updates: Partial<Task>) => {
    for (const id of ids) {
      await updateTask(id, updates);
    }
    setSelectedTasks([]);
  };

  const batchDelete = async (ids: string[]) => {
    await supabaseService.removerTarefasEmLote(ids);
    setSelectedTasks([]);
    await refreshTasks();
  };

  const toggleTaskSelection = (id: string) => {
    setSelectedTasks((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const selectAllTasks = () => setSelectedTasks(tasks.map((task) => task.id));
  const clearSelection = () => setSelectedTasks([]);

  const filterByPeriod = (task: Task, period: TaskFilters['period']) => {
    if (period === 'Todos') return true;

    const now = new Date();
    const due = new Date(parseUiDate(task.date));

    if (period === 'Hoje') return sameDay(now, due);
    if (period === 'Próximos 7 dias') {
      const max = new Date();
      max.setDate(now.getDate() + 7);
      return due >= startOfDay(now) && due <= max;
    }
    if (period === 'Esta semana') {
      const max = new Date();
      max.setDate(now.getDate() + 6);
      return due >= startOfDay(now) && due <= max;
    }
    if (period === 'Este mês') {
      return due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear();
    }

    return true;
  };

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const typeOk = filters.type === 'Todos' || task.type === filters.type;
        const statusOk = filters.status === 'Todos' || task.completed;
        const periodOk = filterByPeriod(task, filters.period);

        return typeOk && statusOk && periodOk;
      }),
    [filters, tasks]
  );

  const applyFilters = (next: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

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
      refreshTasks
    }),
    [filteredTasks, filters, loading, selectedTasks, tasks]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasks = (): TasksContextValue => {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks deve ser usado dentro de TasksProvider');
  return context;
};
