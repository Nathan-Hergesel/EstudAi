/**
 * Tipos do banco de dados Supabase para EstudAI
 * Gerados baseados na estrutura do setup-database.sql
 */

export interface Profile {
    id: string;
    username: string | null;
    nome: string;
    email: string;
    instituicao: string | null;
    curso: string | null;
    avatar_url: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string;
}

export interface Materia {
    id: number;
    user_id: string;
    nome: string;
    professor: string | null;
    codigo: string | null;
    cor: string;
    created_at: string;
    updated_at: string;
}

export interface Tarefa {
    id: number;
    user_id: string;
    materia_id: number | null;
    titulo: string;
    descricao: string | null;
    tipo: 'Atividade' | 'Trabalho' | 'Prova' | 'Outro';
    dificuldade: 'Fácil' | 'Médio' | 'Difícil' | null;
    data_entrega: string | null;
    hora_entrega: string | null;
    completed: boolean;
    prioridade: number;
    created_at: string;
    updated_at: string;
}

export interface Horario {
    id: number;
    user_id: string;
    materia_id: number;
    dia_semana: number; // 0-6 (Domingo-Sábado)
    hora_inicio: string;
    hora_fim: string;
    local: string | null;
    observacoes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Configuracao {
    user_id: string;
    notificacoes_ativas: boolean;
    lembrete_tarefas: boolean;
    alerta_vencimento: boolean;
    horas_antecedencia: number;
    tema_escuro: boolean;
    mostrar_concluidas: boolean;
    sincronizacao_auto: boolean;
    created_at: string;
    updated_at: string;
}

// Views
export interface TarefaCompleta extends Tarefa {
    materia_nome: string | null;
    materia_professor: string | null;
    materia_codigo: string | null;
    materia_cor: string | null;
}

export interface HorarioCompleto extends Horario {
    materia_nome: string;
    materia_professor: string | null;
    materia_codigo: string | null;
    materia_cor: string;
}

// Database schema type
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
            };
            materias: {
                Row: Materia;
                Insert: Omit<Materia, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Materia, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
            };
            tarefas: {
                Row: Tarefa;
                Insert: Omit<Tarefa, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Tarefa, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
            };
            horarios: {
                Row: Horario;
                Insert: Omit<Horario, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Horario, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
            };
            configuracoes: {
                Row: Configuracao;
                Insert: Omit<Configuracao, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Configuracao, 'user_id' | 'created_at' | 'updated_at'>>;
            };
        };
        Views: {
            tarefas_completas: {
                Row: TarefaCompleta;
            };
            horarios_completos: {
                Row: HorarioCompleto;
            };
        };
        Functions: {
            get_tarefas_pendentes: {
                Args: { usuario_id: string };
                Returns: Array<{
                    id: number;
                    titulo: string;
                    tipo: string;
                    data_entrega: string;
                    materia_nome: string;
                    materia_cor: string;
                }>;
            };
            get_horarios_dia: {
                Args: { usuario_id: string; dia: number };
                Returns: Array<{
                    id: number;
                    materia_nome: string;
                    materia_cor: string;
                    hora_inicio: string;
                    hora_fim: string;
                    local: string;
                    professor: string;
                }>;
            };
        };
    };
}