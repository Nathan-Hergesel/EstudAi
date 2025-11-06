/**
 * Tipos do banco de dados Supabase para EstudAI
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
