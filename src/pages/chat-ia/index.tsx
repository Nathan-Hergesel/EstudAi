import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { styles } from '@/pages/chat-ia/styles';

const quickPrompts = [
  'Monte um plano para prova',
  'Resuma esta matéria',
  'Crie questões de revisão',
  'Explique em linguagem simples'
];

const recentSessions = [
  {
    id: 'session-1',
    title: 'Resumo de Bioquímica',
    subtitle: '6 mensagens • há 1h',
    icon: 'flask-outline' as const
  },
  {
    id: 'session-2',
    title: 'Treino de Exercícios de Cálculo',
    subtitle: '10 mensagens • ontem',
    icon: 'calculator-variant-outline' as const
  },
  {
    id: 'session-3',
    title: 'Roteiro para Seminário',
    subtitle: '4 mensagens • 2 dias',
    icon: 'presentation-play' as const
  }
];

export const ChatIAPage = () => (
  <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>CHAT I.A.</Text>
      <Text style={styles.title}>Assistente Inteligente</Text>
    </View>

    <LinearGradient
      colors={['#08236E', '#00174F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroCard}
    >
      <View style={styles.heroTopRow}>
        <Text style={styles.heroLabel}>ESTUDAI COPILOT</Text>
        <View style={styles.heroStatusChip}>
          <View style={styles.heroStatusDot} />
          <Text style={styles.heroStatusText}>Online</Text>
        </View>
      </View>

      <Text style={styles.heroTitle}>Tire dúvidas e revise mais rápido</Text>
      <Text style={styles.heroSubtitle}>
        Pergunte em linguagem natural e receba explicações diretas, roteiros de estudo e exercícios.
      </Text>
    </LinearGradient>

    <Text style={styles.sectionTitle}>Atalhos de pergunta</Text>

    <View style={styles.promptGrid}>
      {quickPrompts.map((prompt) => (
        <Pressable key={prompt} style={styles.promptChip}>
          <Text style={styles.promptChipText}>{prompt}</Text>
        </Pressable>
      ))}
    </View>

    <Text style={styles.sectionTitle}>Sessões recentes</Text>

    <View style={styles.sessionsList}>
      {recentSessions.map((session) => (
        <Pressable key={session.id} style={styles.sessionCard}>
          <View style={styles.sessionIconWrap}>
            <MaterialCommunityIcons name={session.icon} size={16} color="#2E4E7D" />
          </View>

          <View style={styles.sessionTexts}>
            <Text style={styles.sessionTitle}>{session.title}</Text>
            <Text style={styles.sessionSubtitle}>{session.subtitle}</Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={18} color="#9AA8BC" />
        </Pressable>
      ))}
    </View>

    <View style={styles.composerCard}>
      <Text style={styles.composerLabel}>Faça uma nova pergunta</Text>
      <View style={styles.composerRow}>
        <Text style={styles.composerPlaceholder}>Ex: me explique termodinâmica em tópicos...</Text>
        <View style={styles.composerSendButton}>
          <MaterialCommunityIcons name="send" size={14} color="#FFFFFF" />
        </View>
      </View>
    </View>
  </ScrollView>
);
