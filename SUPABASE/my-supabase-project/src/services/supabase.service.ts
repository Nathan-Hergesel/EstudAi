/**
 * Serviço de Autenticação e Operações do Supabase
 * Este arquivo contém todas as funções necessárias para interagir com o banco de dados
 */

import { supabase } from '../config/supabase.config';
import type { 
    Profile, 
    Materia, 
    Tarefa, 
    Horario, 
    Configuracao,
    TarefaCompleta,
    HorarioCompleto
} from '../types/database.types';

// ====================================
// AUTENTICAÇÃO
// ====================================

/**
 * Registra um novo usuário
 */
export const registrarUsuario = async (
    email: string,
    senha: string,
    nome: string
) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password: senha,
            options: {
                data: {
                    nome,
                    username: email.split('@')[0]
                }
            }
        });

        if (error) throw error;
        return { success: true, user: data.user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Faz login do usuário
 */
export const login = async (email: string, senha: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: senha,
        });

        if (error) throw error;
        return { success: true, user: data.user, session: data.session };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Faz logout do usuário
 */
export const logout = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Obtém o usuário atual
 */
export const obterUsuarioAtual = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Reseta a senha do usuário
 */
export const resetarSenha = async (email: string) => {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// ====================================
// PERFIL
// ====================================

/**
 * Obtém o perfil do usuário
 */
export const obterPerfil = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Atualiza o perfil do usuário
 */
export const atualizarPerfil = async (
    userId: string,
    perfil: Partial<Profile>
) => {
    try {
        const { error } = await supabase
            .from('profiles')
            .update(perfil)
            .eq('id', userId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// ====================================
// MATÉRIAS
// ====================================

/**
 * Lista todas as matérias do usuário
 */
export const listarMaterias = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('materias')
            .select('*')
            .eq('user_id', userId)
            .order('nome', { ascending: true });

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
};

/**
 * Cria uma nova matéria
 */
export const criarMateria = async (
    userId: string,
    materia: Omit<Materia, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) => {
    try {
        const { data, error } = await supabase
            .from('materias')
            .insert({ ...materia, user_id: userId })
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Atualiza uma matéria
 */
export const atualizarMateria = async (
    materiaId: number,
    materia: Partial<Materia>
) => {
    try {
        const { error } = await supabase
            .from('materias')
            .update(materia)
            .eq('id', materiaId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Remove uma matéria
 */
export const removerMateria = async (materiaId: number) => {
    try {
        const { error } = await supabase
            .from('materias')
            .delete()
            .eq('id', materiaId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// ====================================
// TAREFAS
// ====================================

/**
 * Lista todas as tarefas do usuário (com informações da matéria)
 */
export const listarTarefas = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('tarefas_completas')
            .select('*')
            .eq('user_id', userId)
            .order('data_entrega', { ascending: true });

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
};

/**
 * Obtém tarefas pendentes
 */
export const obterTarefasPendentes = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .rpc('get_tarefas_pendentes', { usuario_id: userId });

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
};

/**
 * Cria uma nova tarefa
 */
export const criarTarefa = async (
    userId: string,
    tarefa: Omit<Tarefa, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) => {
    try {
        const { data, error } = await supabase
            .from('tarefas')
            .insert({ ...tarefa, user_id: userId })
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Atualiza uma tarefa
 */
export const atualizarTarefa = async (
    tarefaId: number,
    tarefa: Partial<Tarefa>
) => {
    try {
        const { error } = await supabase
            .from('tarefas')
            .update(tarefa)
            .eq('id', tarefaId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Marca/desmarca tarefa como concluída
 */
export const toggleTarefaConcluida = async (
    tarefaId: number,
    concluida: boolean
) => {
    try {
        const { error } = await supabase
            .from('tarefas')
            .update({ completed: concluida })
            .eq('id', tarefaId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Remove uma tarefa
 */
export const removerTarefa = async (tarefaId: number) => {
    try {
        const { error } = await supabase
            .from('tarefas')
            .delete()
            .eq('id', tarefaId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Remove múltiplas tarefas
 */
export const removerTarefasEmLote = async (tarefaIds: number[]) => {
    try {
        const { error } = await supabase
            .from('tarefas')
            .delete()
            .in('id', tarefaIds);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// ====================================
// HORÁRIOS
// ====================================

/**
 * Lista todos os horários do usuário
 */
export const listarHorarios = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('horarios_completos')
            .select('*')
            .eq('user_id', userId)
            .order('dia_semana', { ascending: true })
            .order('hora_inicio', { ascending: true });

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
};

/**
 * Obtém horários de um dia específico
 */
export const obterHorariosDia = async (userId: string, diaSemana: number) => {
    try {
        const { data, error } = await supabase
            .rpc('get_horarios_dia', { 
                usuario_id: userId, 
                dia: diaSemana 
            });

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
};

/**
 * Cria um novo horário
 */
export const criarHorario = async (
    userId: string,
    horario: Omit<Horario, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) => {
    try {
        const { data, error } = await supabase
            .from('horarios')
            .insert({ ...horario, user_id: userId })
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Atualiza um horário
 */
export const atualizarHorario = async (
    horarioId: number,
    horario: Partial<Horario>
) => {
    try {
        const { error } = await supabase
            .from('horarios')
            .update(horario)
            .eq('id', horarioId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Remove um horário
 */
export const removerHorario = async (horarioId: number) => {
    try {
        const { error } = await supabase
            .from('horarios')
            .delete()
            .eq('id', horarioId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// ====================================
// CONFIGURAÇÕES
// ====================================

/**
 * Obtém as configurações do usuário
 */
export const obterConfiguracoes = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('configuracoes')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Atualiza as configurações do usuário
 */
export const atualizarConfiguracoes = async (
    userId: string,
    configuracoes: Partial<Configuracao>
) => {
    try {
        const { error } = await supabase
            .from('configuracoes')
            .update(configuracoes)
            .eq('user_id', userId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// ====================================
// LISTENERS (Real-time)
// ====================================

/**
 * Escuta mudanças nas tarefas do usuário
 */
export const escutarTarefas = (
    userId: string,
    callback: (payload: any) => void
) => {
    return supabase
        .channel('tarefas_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'tarefas',
                filter: `user_id=eq.${userId}`
            },
            callback
        )
        .subscribe();
};

/**
 * Escuta mudanças nas matérias do usuário
 */
export const escutarMaterias = (
    userId: string,
    callback: (payload: any) => void
) => {
    return supabase
        .channel('materias_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'materias',
                filter: `user_id=eq.${userId}`
            },
            callback
        )
        .subscribe();
};

/**
 * Escuta mudanças nos horários do usuário
 */
export const escutarHorarios = (
    userId: string,
    callback: (payload: any) => void
) => {
    return supabase
        .channel('horarios_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'horarios',
                filter: `user_id=eq.${userId}`
            },
            callback
        )
        .subscribe();
};

export default {
    // Auth
    registrarUsuario,
    login,
    logout,
    obterUsuarioAtual,
    resetarSenha,
    // Perfil
    obterPerfil,
    atualizarPerfil,
    // Matérias
    listarMaterias,
    criarMateria,
    atualizarMateria,
    removerMateria,
    // Tarefas
    listarTarefas,
    obterTarefasPendentes,
    criarTarefa,
    atualizarTarefa,
    toggleTarefaConcluida,
    removerTarefa,
    removerTarefasEmLote,
    // Horários
    listarHorarios,
    obterHorariosDia,
    criarHorario,
    atualizarHorario,
    removerHorario,
    // Configurações
    obterConfiguracoes,
    atualizarConfiguracoes,
    // Listeners
    escutarTarefas,
    escutarMaterias,
    escutarHorarios,
};
