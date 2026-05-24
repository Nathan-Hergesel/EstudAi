import { supabase } from '@/config/supabase.config';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type EdgeResponse = {
  text?: string;
  error?: string;
};

export const sendChatMessage = async (history: ChatMessage[]): Promise<string> => {
  const { data, error } = await supabase.functions.invoke<EdgeResponse>('chat-ia', {
    body: { messages: history },
  });

  if (error) throw new Error(error.message);
  if (!data?.text) throw new Error(data?.error ?? 'Resposta inesperada do servidor.');

  return data.text;
};
