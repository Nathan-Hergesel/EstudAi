export type TaskDbType = 'Atividade' | 'Leitura' | 'Trabalho' | 'Prova' | 'Outro';
export type TaskDbDifficulty = 'Facil' | 'Medio' | 'Dificil';

export interface Profile {
  id: string;
  nome: string;
  email: string;
  instituicao?: string | null;
  curso?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Materia {
  id: string;
  user_id: string;
  nome: string;
  codigo?: string | null;
  professor?: string | null;
  cor?: string | null;
  created_at?: string;
}

export interface Tarefa {
  id: string;
  user_id: string;
  materia_id?: string | null;
  tipo: TaskDbType;
  dificuldade: TaskDbDifficulty;
  titulo: string;
  descricao: string;
  data_entrega: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Horario {
  id: string;
  user_id: string;
  materia_id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  created_at?: string;
}

export interface Configuracao {
  user_id: string;
  notificacoes_ativas: boolean;
  lembrete_tarefas: boolean;
  alerta_vencimento: boolean;
  horas_antecedencia: 24 | 48 | 72;
  tema_escuro: boolean;
  mostrar_concluidas: boolean;
  sincronizacao_auto: boolean;
}

export interface TarefaCompleta extends Tarefa {
  materia_nome?: string | null;
}

export interface HorarioCompleto extends Horario {
  materia_nome?: string | null;
}
