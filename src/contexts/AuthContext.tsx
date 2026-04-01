import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/config/supabase.config';
import { supabaseService } from '@/services/supabase.service';
import { Profile } from '@/types/database.types';

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, nome: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const result = await supabaseService.obterPerfil(userId);
    if (result.success && result.data) setProfile(result.data);
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user?.id) {
        await loadProfile(data.session.user.id);
      }
      setLoading(false);
    };

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user?.id) {
        await loadProfile(nextSession.user.id);
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
      signIn: async (email, password) => {
        const result = await supabaseService.login(email, password);
        return { success: result.success, error: result.error };
      },
      signUp: async (email, password, nome) => {
        const result = await supabaseService.registrarUsuario(email, password, nome);
        return { success: result.success, error: result.error };
      },
      signOut: async () => {
        await supabaseService.logout();
      },
      refreshProfile: async () => {
        if (!user?.id) return;
        await loadProfile(user.id);
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
