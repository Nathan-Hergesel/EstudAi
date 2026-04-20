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

const featuredTopics = [
  {
    id: 'topic-1',
    title: 'Biologia celular',
    subtitle: 'Resumo, revisão e exercícios',
    icon: 'flask-outline' as const
  },
  {
    id: 'topic-2',
    title: 'Cálculo I',
    subtitle: 'Passo a passo com exemplos',
    icon: 'calculator-variant-outline' as const
  },
  {
    id: 'topic-3',
    title: 'Seminário e apresentação',
    subtitle: 'Organização de ideias e roteiro',
    icon: 'presentation-play' as const
  }
];

export const ChatIAPage = () => (
  <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>CHAT I.A.</Text>
      <Text style={styles.title}>Assistente de estudos</Text>
    </View>

    <LinearGradient
      colors={['#08236E', '#00174F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroCard}
    >
      <View style={styles.heroTopRow}>
        <Text style={styles.heroLabel}>ESTUDAÍ</Text>
        <View style={styles.heroStatusChip}>
          <View style={styles.heroStatusDot} />
          <Text style={styles.heroStatusText}>Online</Text>
        </View>
      </View>

      <Text style={styles.heroTitle}>Tire dúvidas e revise mais rápido</Text>
      <Text style={styles.heroSubtitle}>
        Pergunte em linguagem natural e receba respostas diretas, resumos e exercícios para estudo.
      </Text>
    </LinearGradient>

    <Text style={styles.sectionTitle}>Sugestões rápidas</Text>

    <View style={styles.promptGrid}>
      {quickPrompts.map((prompt) => (
        <Pressable key={prompt} style={styles.promptChip}>
          <Text style={styles.promptChipText}>{prompt}</Text>
        </Pressable>
      ))}
    </View>

    <Text style={styles.sectionTitle}>Tópicos em foco</Text>

    <View style={styles.topicList}>
      {featuredTopics.map((topic) => (
        <Pressable key={topic.id} style={styles.topicCard}>
          <View style={styles.topicIconWrap}>
            <MaterialCommunityIcons name={topic.icon} size={16} color="#2E4E7D" />
          </View>

          <View style={styles.topicTexts}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>
          </View>

          <MaterialCommunityIcons name="chevron-right" size={18} color="#9AA8BC" />
        </Pressable>
      ))}
    </View>

    <View style={styles.composerCard}>
      <Text style={styles.composerLabel}>Escreva sua dúvida</Text>
      <View style={styles.composerRow}>
        <Text style={styles.composerPlaceholder}>Ex: explique termodinâmica em tópicos...</Text>
        <View style={styles.composerSendButton}>
          <MaterialCommunityIcons name="send" size={14} color="#FFFFFF" />
        </View>
      </View>
    </View>
  </ScrollView>
);