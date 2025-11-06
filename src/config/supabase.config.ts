import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.SUPABASE_URL || 'https://igtkumuwkmoijhlfvnne.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlndGt1bXV3a21vaWpobGZ2bm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjg1NDksImV4cCI6MjA3Nzg0NDU0OX0.Io-t2_JzRU_EKmNIMpmKxoefA5jD-Y06QSlSPCnvvJE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
