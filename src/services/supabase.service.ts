import { supabase } from '@/config/supabase.config';
import {
  Configuracao,
  Horario,
  HorarioCompleto,
  Materia,
  Profile,
  Tarefa,
  TarefaCompleta
} from '@/types/database.types';

type Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const supabaseService = {
  async login(email: string, password: string): Promise<Result<unknown>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (e) {
      return { success: false, error: 'Falha ao fazer login.' };
    }
  },

  async registrarUsuario(email: string, password: string, nome: string): Promise<Result<unknown>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome } }
      });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch {
      return { success: false, error: 'Falha ao cadastrar usuario.' };
    }
  },

  async logout(): Promise<Result<null>> {
    const { error } = await supabase.auth.signOut();
    return error ? { success: false, error: error.message } : { success: true, data: null };
  },

  async obterPerfil(userId: string): Promise<Result<Profile>> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Profile };
  },

  async atualizarPerfil(userId: string, updates: Partial<Profile>): Promise<Result<Profile>> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Profile };
  },

  async listarMaterias(userId: string): Promise<Result<Materia[]>> {
    const { data, error } = await supabase.from('materias').select('*').eq('user_id', userId).order('nome');
    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as Materia[] };
  },

  async criarMateria(payload: Omit<Materia, 'id' | 'created_at'>): Promise<Result<Materia>> {
    const { data, error } = await supabase.from('materias').insert(payload).select('*').single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Materia };
  },

  async removerMateria(id: string): Promise<Result<null>> {
    const { error } = await supabase.from('materias').delete().eq('id', id);
    return error ? { success: false, error: error.message } : { success: true, data: null };
  },

  async listarTarefas(userId: string): Promise<Result<TarefaCompleta[]>> {
    const { data, error } = await supabase
      .from('tarefas_completas')
      .select('*')
      .eq('user_id', userId)
      .order('data_entrega', { ascending: true });
    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as TarefaCompleta[] };
  },

  async criarTarefa(payload: Omit<Tarefa, 'id' | 'created_at' | 'updated_at'>): Promise<Result<Tarefa>> {
    const { data, error } = await supabase.from('tarefas').insert(payload).select('*').single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Tarefa };
  },

  async atualizarTarefa(id: string, updates: Partial<Tarefa>): Promise<Result<Tarefa>> {
    const { data, error } = await supabase.from('tarefas').update(updates).eq('id', id).select('*').single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Tarefa };
  },

  async removerTarefa(id: string): Promise<Result<null>> {
    const { error } = await supabase.from('tarefas').delete().eq('id', id);
    return error ? { success: false, error: error.message } : { success: true, data: null };
  },

  async removerTarefasEmLote(ids: string[]): Promise<Result<null>> {
    const { error } = await supabase.from('tarefas').delete().in('id', ids);
    return error ? { success: false, error: error.message } : { success: true, data: null };
  },

  async listarHorarios(userId: string): Promise<Result<HorarioCompleto[]>> {
    const { data, error } = await supabase
      .from('horarios_completos')
      .select('*')
      .eq('user_id', userId)
      .order('dia_semana');
    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as HorarioCompleto[] };
  },

  async criarHorario(payload: Omit<Horario, 'id' | 'created_at'>): Promise<Result<Horario>> {
    const { data, error } = await supabase.from('horarios').insert(payload).select('*').single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Horario };
  },

  async removerHorario(id: string): Promise<Result<null>> {
    const { error } = await supabase.from('horarios').delete().eq('id', id);
    return error ? { success: false, error: error.message } : { success: true, data: null };
  },

  async obterConfiguracoes(userId: string): Promise<Result<Configuracao>> {
    const { data, error } = await supabase.from('configuracoes').select('*').eq('user_id', userId).single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Configuracao };
  },

  async atualizarConfiguracoes(
    userId: string,
    updates: Partial<Configuracao>
  ): Promise<Result<Configuracao>> {
    const { data, error } = await supabase
      .from('configuracoes')
      .update(updates)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Configuracao };
  }
};
