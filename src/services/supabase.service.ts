/**
 * Serviço de Autenticação e Operações do Supabase
 */

import { supabase } from '../config/supabase.config';
import type { Profile, Materia, Tarefa, Horario, Configuracao, TarefaCompleta } from '../types/database.types';

// ====================================
// AUTENTICAÇÃO
// ====================================

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

export const logout = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const obterUsuarioAtual = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

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

export default {
    registrarUsuario,
    login,
    logout,
    obterUsuarioAtual,
    resetarSenha,
    obterPerfil,
    atualizarPerfil,
    listarMaterias,
    criarMateria,
    atualizarMateria,
    removerMateria,
    listarTarefas,
    obterTarefasPendentes,
    criarTarefa,
    atualizarTarefa,
    toggleTarefaConcluida,
    removerTarefa,
    removerTarefasEmLote,
    listarHorarios,
    obterHorariosDia,
    criarHorario,
    atualizarHorario,
    removerHorario,
    obterConfiguracoes,
    atualizarConfiguracoes,
};
