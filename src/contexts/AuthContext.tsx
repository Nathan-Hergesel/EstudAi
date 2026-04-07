import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/config/supabase.config';
import { supabaseService } from '@/services/supabase.service';
import { Profile } from '@/types/database.types';

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
    rememberSession?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, nome: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const REMEMBER_SESSION_KEY = '@estudai:remember_session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const resolveName = (currentUser: User): string => {
    const rawName =
      typeof currentUser.user_metadata?.nome === 'string' ? currentUser.user_metadata.nome.trim() : '';

    if (rawName) return rawName;

    const email = currentUser.email || '';
    if (email.includes('@')) return email.split('@')[0];

    return 'Aluno';
  };

  const loadProfile = async (currentUser: User) => {
    const result = await supabaseService.obterPerfil(currentUser.id);
    if (result.success && result.data) {
      setProfile(result.data);
      return;
    }

    const fallbackEmail = currentUser.email || `${currentUser.id}@local.user`;
    const ensuredProfile = await supabaseService.garantirPerfil(
      currentUser.id,
      resolveName(currentUser),
      fallbackEmail
    );

    if (!ensuredProfile.success || !ensuredProfile.data) {
      setProfile(null);
      return;
    }

    await supabaseService.garantirConfiguracoes(currentUser.id);
    setProfile(ensuredProfile.data);
  };

  const persistRememberSession = async (rememberSession: boolean) => {
    try {
      await AsyncStorage.setItem(REMEMBER_SESSION_KEY, rememberSession ? 'true' : 'false');
    } catch {
      // Ignora falhas de persistencia para nao bloquear autenticacao.
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const rememberSession = await AsyncStorage.getItem(REMEMBER_SESSION_KEY);
        if (rememberSession !== 'true') {
          await supabase.auth.signOut({ scope: 'local' });
        }
      } catch {
        // Em caso de falha, segue com leitura de sessao atual.
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user?.id) {
        await loadProfile(data.session.user);
      }
      setLoading(false);
    };

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user?.id) {
        await loadProfile(nextSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      session,
      loading,
      signIn: async (email, password, rememberSession = false) => {
        const result = await supabaseService.login(email, password);
        if (result.success) {
          await persistRememberSession(rememberSession);
        }
        return { success: result.success, error: result.error };
      },
      signUp: async (email, password, nome) => {
        const result = await supabaseService.registrarUsuario(email, password, nome);
        if (result.success) {
          await persistRememberSession(false);
        }
        return { success: result.success, error: result.error };
      },
      requestPasswordReset: async (email) => {
        const result = await supabaseService.enviarResetSenha(email);
        return { success: result.success, error: result.error };
      },
      signOut: async () => {
        await supabaseService.logout();
        await persistRememberSession(false);
      },
      refreshProfile: async () => {
        if (!user) return;
        await loadProfile(user);
      }
    }),
    [loading, profile, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};
