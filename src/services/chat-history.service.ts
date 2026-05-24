import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@estudai:chats';
const MAX_CONVERSATIONS = 20;

export type StoredMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type Conversation = {
  id: string;
  preview: string;
  createdAt: string;
  messages: StoredMessage[];
};

export const loadConversations = async (): Promise<Conversation[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
};

export const saveConversation = async (conversation: Conversation): Promise<void> => {
  try {
    const all = await loadConversations();
    const idx = all.findIndex((c) => c.id === conversation.id);
    if (idx >= 0) {
      all[idx] = conversation;
    } else {
      all.unshift(conversation);
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, MAX_CONVERSATIONS)));
  } catch {
    // silently fail — non-critical
  }
};

export const deleteConversation = async (id: string): Promise<void> => {
  try {
    const all = await loadConversations();
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(all.filter((c) => c.id !== id))
    );
  } catch {}
};

export const formatConversationDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return 'Agora';
  if (diffMin < 60) return `Há ${diffMin} min`;
  if (diffH < 24 && date.getDate() === now.getDate()) return `Hoje, ${date.getHours()}h${String(date.getMinutes()).padStart(2, '0')}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.getDate() === yesterday.getDate()) return 'Ontem';

  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
};
