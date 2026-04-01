export type TaskType = 'ATIVIDADE' | 'LEITURA' | 'TRABALHO' | 'PROVA';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  type: TaskType;
  completed: boolean;
  materiaId?: string | null;
}

export interface TaskFilters {
  period: 'Todos' | 'Hoje' | 'Esta semana' | 'Este mês' | 'Próximos 7 dias';
  type: 'Todos' | TaskType;
  status: 'Todos' | 'Concluídas';
}
