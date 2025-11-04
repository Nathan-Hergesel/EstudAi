import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Task, FilterOptions } from './useTarefas';

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextId, setNextId] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'Todos',
    type: 'Todos',
    difficulty: 'Todos',
    status: 'Todos',
  });
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: nextId, completed: false };
    setTasks(prev => [...prev, newTask]);
    setNextId(prev => prev + 1);
  };

  const updateTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updatedTask } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const batchUpdate = (ids: number[], updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (ids.includes(t.id) ? { ...t, ...updates } : t)));
  };

  const batchDelete = (ids: number[]) => {
    setTasks(prev => prev.filter(t => !ids.includes(t.id)));
    setSelectedTasks([]);
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

export const useTasks = (): TasksContextValue => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks deve ser usado dentro de <TasksProvider>');
  return ctx;
};
