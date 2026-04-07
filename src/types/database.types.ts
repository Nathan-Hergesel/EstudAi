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
  mostrar_concluidas: boolean;
  sincronizacao_auto: boolean;
}

export interface GrupoEstudo {
  id: string;
  owner_id: string;
  nome: string;
  descricao?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type GrupoPapel = 'owner' | 'member';

export interface GrupoMembro {
  grupo_id: string;
  user_id: string;
  papel: GrupoPapel;
  created_at?: string;
}

export interface GrupoMembroDetalhado extends GrupoMembro {
  nome?: string | null;
  email?: string | null;
}

export interface TarefaCompartilhadaGrupo {
  id: string;
  grupo_id: string;
  tarefa_id: string;
  compartilhado_por: string;
  created_at?: string;
}

export interface TarefaSalvaGrupo {
  tarefa_compartilhada_id: string;
  user_id: string;
  created_at?: string;
}

export interface ReuniaoGrupo {
  id: string;
  grupo_id: string;
  criado_por: string;
  titulo: string;
  descricao?: string | null;
  data_reuniao: string;
  created_at?: string;
  updated_at?: string;
}

export interface GrupoDoUsuario {
  user_id: string;
  grupo_id: string;
  papel: GrupoPapel;
  nome: string;
  descricao?: string | null;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface TarefaCompartilhadaCompleta {
  id: string;
  grupo_id: string;
  grupo_nome: string;
  tarefa_id: string;
  compartilhado_por: string;
  compartilhado_por_nome?: string | null;
  compartilhado_em: string;
  tipo: TaskDbType;
  titulo: string;
  descricao: string;
  data_entrega: string;
  completed: boolean;
  materia_id?: string | null;
  materia_nome?: string | null;
}

export interface ReuniaoGrupoCompleta extends ReuniaoGrupo {
  grupo_nome: string;
  criado_por_nome?: string | null;
}

export interface TarefaCompleta extends Tarefa {
  materia_nome?: string | null;
}

export interface HorarioCompleto extends Horario {
  materia_nome?: string | null;
}
