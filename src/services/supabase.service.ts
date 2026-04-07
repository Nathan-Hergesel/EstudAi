import { supabase } from '@/config/supabase.config';
import {
  Configuracao,
  GrupoDoUsuario,
  GrupoMembroDetalhado,
  GrupoEstudo,
  Horario,
  HorarioCompleto,
  Materia,
  Profile,
  ReuniaoGrupo,
  ReuniaoGrupoCompleta,
  Tarefa,
  TarefaCompleta,
  TarefaCompartilhadaCompleta,
  TarefaCompartilhadaGrupo,
  TarefaSalvaGrupo
} from '@/types/database.types';

type Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type ConviteGrupoResult = {
  email: string;
  status: 'convidado' | 'ja_eh_membro' | 'nao_encontrado';
  user_id: string | null;
};

const traduzirErroAuth = (message: string): string => {
  const normalized = message.trim().toLowerCase();

  if (normalized === 'invalid login credentials') {
    return 'Email ou senha inválidos.';
  }

  return message;
};

export const supabaseService = {
  async login(email: string, password: string): Promise<Result<unknown>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: traduzirErroAuth(error.message) };
      return { success: true, data };
    } catch (e) {
      return { success: false, error: 'Falha ao fazer login.' };
    }
  },

  async registrarUsuario(email: string, password: string, nome: string): Promise<Result<unknown>> {
    try {
      const redirectTo = process.env.EXPO_PUBLIC_SUPABASE_SIGNUP_REDIRECT_URL;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nome },
          ...(redirectTo ? { emailRedirectTo: redirectTo } : {})
        }
      });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch {
      return { success: false, error: 'Falha ao cadastrar usuário.' };
    }
  },

  async enviarResetSenha(email: string): Promise<Result<unknown>> {
    try {
      const redirectTo = process.env.EXPO_PUBLIC_SUPABASE_RESET_REDIRECT_URL;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        ...(redirectTo ? { redirectTo } : {})
      });

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch {
      return { success: false, error: 'Falha ao enviar email de redefinição de senha.' };
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

  async garantirPerfil(userId: string, nome: string, email: string): Promise<Result<Profile>> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          nome,
          email
        },
        { onConflict: 'id' }
      )
      .select('*')
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Profile };
  },

  async garantirConfiguracoes(userId: string): Promise<Result<Configuracao>> {
    const { data, error } = await supabase
      .from('configuracoes')
      .upsert({ user_id: userId }, { onConflict: 'user_id' })
      .select('*')
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Configuracao };
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
  },

  async listarGruposDoUsuario(userId: string): Promise<Result<GrupoDoUsuario[]>> {
    const { data, error } = await supabase
      .from('grupos_do_usuario')
      .select('*')
      .eq('user_id', userId)
      .order('nome');

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as GrupoDoUsuario[] };
  },

  async listarIntegrantesGrupo(grupoId: string): Promise<Result<GrupoMembroDetalhado[]>> {
    const mapMembers = (
      rawMembers: Array<{
        grupo_id?: string;
        user_id: string;
        papel: 'owner' | 'member';
        created_at?: string;
        nome?: string | null;
        email?: string | null;
        profiles?: { id: string; nome: string; email: string } | Array<{ id: string; nome: string; email: string }> | null;
      }>
    ): GrupoMembroDetalhado[] =>
      rawMembers.map((item) => {
        const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;

        return {
          grupo_id: item.grupo_id || grupoId,
          user_id: item.user_id,
          papel: item.papel,
          created_at: item.created_at,
          nome: item.nome || profile?.nome || null,
          email: item.email || profile?.email || null
        };
      });

    const rpcResult = await supabase.rpc('listar_integrantes_grupo', {
      grupo_uuid: grupoId
    });

    if (!rpcResult.error) {
      const mapped = mapMembers(
        (rpcResult.data || []) as Array<{
          user_id: string;
          papel: 'owner' | 'member';
          nome?: string | null;
          email?: string | null;
        }>
      );

      mapped.sort((a, b) => {
        if (a.papel === b.papel) {
          const nomeA = (a.nome || '').toLowerCase();
          const nomeB = (b.nome || '').toLowerCase();
          return nomeA.localeCompare(nomeB);
        }

        return a.papel === 'owner' ? -1 : 1;
      });

      return { success: true, data: mapped };
    }

    const rpcErrorLower = rpcResult.error.message.toLowerCase();
    const missingFunction =
      rpcErrorLower.includes('function') &&
      rpcErrorLower.includes('listar_integrantes_grupo') &&
      rpcErrorLower.includes('does not exist');

    if (!missingFunction) {
      return { success: false, error: rpcResult.error.message };
    }

    const { data, error } = await supabase
      .from('grupos_membros')
      .select('grupo_id, user_id, papel, created_at, profiles:profiles!grupos_membros_user_id_fkey(id, nome, email)')
      .eq('grupo_id', grupoId);

    if (error) return { success: false, error: error.message };

    const mapped = mapMembers(
      (data || []) as Array<{
        grupo_id: string;
        user_id: string;
        papel: 'owner' | 'member';
        created_at?: string;
        profiles?: { id: string; nome: string; email: string } | Array<{ id: string; nome: string; email: string }> | null;
      }>
    );

    mapped.sort((a, b) => {
      if (a.papel === b.papel) {
        const nomeA = (a.nome || '').toLowerCase();
        const nomeB = (b.nome || '').toLowerCase();
        return nomeA.localeCompare(nomeB);
      }

      return a.papel === 'owner' ? -1 : 1;
    });

    return { success: true, data: mapped };
  },

  async criarGrupoEstudo(payload: Pick<GrupoEstudo, 'nome' | 'descricao'>): Promise<Result<GrupoEstudo>> {
    const nome = payload.nome.trim();
    if (!nome) {
      return { success: false, error: 'Informe um nome para o grupo.' };
    }

    const descricao = payload.descricao?.trim() ? payload.descricao.trim() : null;

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    const insertGroup = async (ownerId: string) =>
      supabase
        .from('grupos_estudo')
        .insert({
          owner_id: ownerId,
          nome,
          descricao
        })
        .select('*')
        .single();

    let { data, error } = await insertGroup(authData.user.id);

    if (error && error.message.toLowerCase().includes('row-level security')) {
      const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
      let refreshedUserId = refreshedSession.user?.id || null;

      if (!refreshedUserId) {
        const { data: refreshedUser } = await supabase.auth.getUser();
        refreshedUserId = refreshedUser.user?.id || null;
      }

      if (!refreshError && refreshedUserId) {
        const retry = await insertGroup(refreshedUserId);
        data = retry.data;
        error = retry.error;
      }
    }

    if (error) {
      const rawError = error.message.toLowerCase();
      if (rawError.includes('row-level security')) {
        return {
          success: false,
          error: 'Sem permissão para criar grupo com a sessão atual. Faça logout e login novamente.'
        };
      }

      return { success: false, error: error.message };
    }

    return { success: true, data: data as GrupoEstudo };
  },

  async atualizarGrupoEstudo(
    grupoId: string,
    payload: Pick<GrupoEstudo, 'nome' | 'descricao'>
  ): Promise<Result<GrupoEstudo>> {
    const nome = payload.nome.trim();
    if (!nome) {
      return { success: false, error: 'Informe um nome para o grupo.' };
    }

    const descricao = payload.descricao?.trim() ? payload.descricao.trim() : null;

    const { data, error } = await supabase
      .from('grupos_estudo')
      .update({ nome, descricao })
      .eq('id', grupoId)
      .select('*')
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as GrupoEstudo };
  },

  async removerGrupoEstudo(grupoId: string): Promise<Result<null>> {
    const { error } = await supabase.from('grupos_estudo').delete().eq('id', grupoId);
    return error ? { success: false, error: error.message } : { success: true, data: null };
  },

  async convidarMembrosPorEmail(grupoId: string, emails: string[]): Promise<Result<ConviteGrupoResult[]>> {
    const emailsNormalizados = Array.from(
      new Set(
        emails
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean)
      )
    );

    if (emailsNormalizados.length === 0) {
      return { success: true, data: [] };
    }

    const { data, error } = await supabase.rpc('convidar_membros_grupo_por_email', {
      grupo_uuid: grupoId,
      emails_lista: emailsNormalizados
    });

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as ConviteGrupoResult[] };
  },

  async compartilharTarefaComGrupo(
    payload: Omit<TarefaCompartilhadaGrupo, 'id' | 'created_at'>
  ): Promise<Result<TarefaCompartilhadaGrupo>> {
    const { data, error } = await supabase
      .from('tarefas_compartilhadas_grupo')
      .insert(payload)
      .select('*')
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as TarefaCompartilhadaGrupo };
  },

  async listarTarefasCompartilhadasDoGrupo(grupoId: string): Promise<Result<TarefaCompartilhadaCompleta[]>> {
    const { data, error } = await supabase
      .from('tarefas_compartilhadas_completas')
      .select('*')
      .eq('grupo_id', grupoId)
      .order('compartilhado_em', { ascending: true });

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as TarefaCompartilhadaCompleta[] };
  },

  async salvarTarefaCompartilhada(payload: Omit<TarefaSalvaGrupo, 'created_at'>): Promise<Result<TarefaSalvaGrupo>> {
    const { data, error } = await supabase
      .from('tarefas_salvas_grupo')
      .upsert(payload, { onConflict: 'tarefa_compartilhada_id,user_id' })
      .select('*')
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as TarefaSalvaGrupo };
  },

  async listarTarefasSalvasDoUsuario(userId: string): Promise<Result<TarefaSalvaGrupo[]>> {
    const { data, error } = await supabase
      .from('tarefas_salvas_grupo')
      .select('*')
      .eq('user_id', userId);

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as TarefaSalvaGrupo[] };
  },

  async listarReunioesGrupo(grupoId: string): Promise<Result<ReuniaoGrupoCompleta[]>> {
    const { data, error } = await supabase
      .from('reunioes_grupo_completas')
      .select('*')
      .eq('grupo_id', grupoId)
      .order('data_reuniao', { ascending: true });

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as ReuniaoGrupoCompleta[] };
  },

  async criarReuniaoGrupo(payload: Omit<ReuniaoGrupo, 'id' | 'created_at' | 'updated_at'>): Promise<Result<ReuniaoGrupo>> {
    const { data, error } = await supabase.from('reunioes_grupo').insert(payload).select('*').single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as ReuniaoGrupo };
  }
};
