import { Task } from '@/types/app.types';
import { TaskDbType, Tarefa, TarefaCompleta } from '@/types/database.types';
import { formatUiDate, parseUiDate } from '@/utils/date';

export const mapTypeToDb = (type: Task['type']): TaskDbType => {
  if (type === 'ATIVIDADE') return 'Atividade';
  if (type === 'LEITURA') return 'Leitura';
  if (type === 'TRABALHO') return 'Trabalho';
  return 'Prova';
};

export const mapTypeFromDb = (type: TaskDbType): Task['type'] => {
  if (type === 'Atividade') return 'ATIVIDADE';
  if (type === 'Leitura') return 'LEITURA';
  if (type === 'Trabalho') return 'TRABALHO';
  if (type === 'Prova') return 'PROVA';
  return 'ATIVIDADE';
};

export const fromDbTask = (tarefa: Tarefa | TarefaCompleta): Task => ({
  id: tarefa.id,
  title: tarefa.titulo,
  description: tarefa.descricao,
  date: formatUiDate(tarefa.data_entrega),
  type: mapTypeFromDb(tarefa.tipo),
  completed: tarefa.completed,
  materiaId: tarefa.materia_id
});

export const toDbTask = (task: Omit<Task, 'id' | 'completed'>, userId: string): Omit<Tarefa, 'id'> => ({
  user_id: userId,
  materia_id: task.materiaId || null,
  tipo: mapTypeToDb(task.type),
  dificuldade: 'Medio',
  titulo: task.title,
  descricao: task.description,
  data_entrega: parseUiDate(task.date),
  completed: false
});
