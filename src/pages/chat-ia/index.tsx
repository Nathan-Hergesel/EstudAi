import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Markdown from 'react-native-markdown-display';

import { sendChatMessage, type ChatMessage } from '@/services/anthropic.service';
import {
  deleteConversation,
  formatConversationDate,
  loadConversations,
  saveConversation,
  type Conversation
} from '@/services/chat-history.service';
import { chatStyles, landingStyles, markdownStyles } from '@/pages/chat-ia/styles';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const QUICK_PROMPTS = [
  'Monte um plano para prova',
  'Resuma esta matéria',
  'Crie questões de revisão',
  'Explique em linguagem simples'
];

export const ChatIAPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [composerFocused, setComposerFocused] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    loadConversations().then(setConversations);
  }, []);

  const openConversation = useCallback((conv: Conversation) => {
    setActiveId(conv.id);
    setMessages(conv.messages.map((m, i) => ({ id: String(i), role: m.role, content: m.content })));
  }, []);

  const goBack = useCallback(() => {
    setActiveId(null);
    setMessages([]);
    setDraft('');
    loadConversations().then(setConversations);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const convId = activeId ?? Date.now().toString();
      if (!activeId) setActiveId(convId);

      const userMsg: Message = { id: `${Date.now()}-u`, role: 'user', content: trimmed };
      const nextMessages = [...messages, userMsg];

      setMessages(nextMessages);
      setDraft('');
      setLoading(true);

      const apiHistory: ChatMessage[] = nextMessages.map(({ role, content }) => ({ role, content }));

      try {
        const reply = await sendChatMessage(apiHistory);
        const assistantMsg: Message = { id: `${Date.now()}-a`, role: 'assistant', content: reply };
        const finalMessages = [...nextMessages, assistantMsg];

        setMessages(finalMessages);

        const conv: Conversation = {
          id: convId,
          preview: trimmed.length > 72 ? trimmed.slice(0, 72) + '…' : trimmed,
          createdAt: new Date().toISOString(),
          messages: finalMessages.map(({ role, content }) => ({ role, content }))
        };
        await saveConversation(conv);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido';
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-e`, role: 'assistant', content: `Não consegui responder agora. ${msg}` }
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, activeId]
  );

  const handleSend = useCallback(() => sendMessage(draft), [sendMessage, draft]);

  const displayMessages: Message[] = loading
    ? [...messages, { id: 'loading', role: 'assistant', content: '···' }]
    : messages;

  const inChat = activeId !== null;

  return (
    <KeyboardAvoidingView
      style={chatStyles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {inChat ? (
        <>
          <View style={chatStyles.chatHeader}>
            <Pressable style={chatStyles.backButton} onPress={goBack} hitSlop={8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color="#162944" />
            </Pressable>
            <Text style={chatStyles.chatHeaderTitle}>Assistente de estudos</Text>
            <View style={chatStyles.chatHeaderStatus}>
              <View style={chatStyles.chatHeaderStatusDot} />
              <Text style={chatStyles.chatHeaderStatusText}>Online</Text>
            </View>
          </View>

          <FlatList
            ref={listRef}
            data={displayMessages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={chatStyles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View
                style={[
                  chatStyles.bubble,
                  item.role === 'user' ? chatStyles.userBubble : chatStyles.assistantBubble
                ]}
              >
                {item.role === 'user' || item.id === 'loading' ? (
                  <Text
                    style={[
                      chatStyles.bubbleText,
                      item.role === 'user' ? chatStyles.userText : chatStyles.assistantText,
                      item.id === 'loading' && chatStyles.loadingDots
                    ]}
                  >
                    {item.content}
                  </Text>
                ) : (
                  <Markdown style={markdownStyles}>{item.content}</Markdown>
                )}
              </View>
            )}
          />
        </>
      ) : (
        <View style={landingStyles.landingRoot}>
          {/* Topo fixo: header, hero, sugestões */}
          <View style={landingStyles.landingTop}>
            <View style={landingStyles.header}>
              <Text style={landingStyles.eyebrow}>CHAT I.A.</Text>
              <Text style={landingStyles.title}>Assistente de estudos</Text>
            </View>

            <LinearGradient
              colors={['#08236E', '#00174F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={landingStyles.heroCard}
            >
              <View style={landingStyles.heroTopRow}>
                <Text style={landingStyles.heroLabel}>ESTUDAÍ</Text>
                <View style={landingStyles.heroStatusChip}>
                  <View style={landingStyles.heroStatusDot} />
                  <Text style={landingStyles.heroStatusText}>Online</Text>
                </View>
              </View>
              <Text style={landingStyles.heroTitle}>Tire dúvidas e revise mais rápido</Text>
              <Text style={landingStyles.heroSubtitle}>
                Pergunte em linguagem natural e receba respostas diretas, resumos e exercícios para estudo.
              </Text>
            </LinearGradient>

            <Text style={landingStyles.sectionTitle}>Sugestões rápidas</Text>

            <View style={landingStyles.promptGrid}>
              {QUICK_PROMPTS.map((prompt) => (
                <Pressable
                  key={prompt}
                  style={landingStyles.promptChip}
                  onPress={() => sendMessage(prompt)}
                >
                  <Text style={landingStyles.promptChipText}>{prompt}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Meio flexível: conversas recentes */}
          <View style={landingStyles.landingMiddle}>
            <Text style={landingStyles.sectionTitle}>Conversas recentes</Text>

            {conversations.length === 0 ? (
              <View style={landingStyles.emptyState}>
                <MaterialCommunityIcons name="robot-outline" size={32} color="#C0CEDF" />
                <Text style={landingStyles.emptyStateText}>Suas conversas aparecerão aqui</Text>
              </View>
            ) : (
              <FlatList
                data={conversations}
                keyExtractor={(c) => c.id}
                contentContainerStyle={landingStyles.recentList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item: conv }) => (
                  <Pressable
                    style={landingStyles.recentItem}
                    onPress={() => openConversation(conv)}
                  >
                    <View style={landingStyles.recentIconWrap}>
                      <MaterialCommunityIcons name="robot-outline" size={16} color="#2E4E7D" />
                    </View>
                    <View style={landingStyles.recentTexts}>
                      <Text style={landingStyles.recentPreview} numberOfLines={1}>
                        {conv.preview}
                      </Text>
                      <Text style={landingStyles.recentDate}>
                        {formatConversationDate(conv.createdAt)}
                      </Text>
                    </View>
                    <Pressable
                      style={landingStyles.recentDeleteButton}
                      onPress={() => handleDelete(conv.id)}
                      hitSlop={8}
                    >
                      <MaterialCommunityIcons name="close" size={15} color="#9AA8BC" />
                    </Pressable>
                  </Pressable>
                )}
              />
            )}
          </View>
        </View>
      )}

      <View style={chatStyles.composer}>
        <TextInput
          style={[chatStyles.composerInput, composerFocused && chatStyles.composerInputFocused]}
          value={draft}
          onChangeText={setDraft}
          placeholder="Escreva sua dúvida..."
          placeholderTextColor="#8996AA"
          selectionColor="#2563EB"
          underlineColorAndroid="transparent"
          maxLength={2000}
          editable={!loading}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          onFocus={() => setComposerFocused(true)}
          onBlur={() => setComposerFocused(false)}
        />
        <Pressable
          style={[chatStyles.sendButton, (!draft.trim() || loading) && chatStyles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!draft.trim() || loading}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="send" size={14} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};
