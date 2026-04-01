import React from 'react';
import { Text, View } from 'react-native';

import { styles } from '@/pages/chat-ia/styles';

export const ChatIAPage = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>CHAT I.A.</Text>
      <Text style={styles.title}>Assistente Inteligente</Text>
    </View>
  </View>
);
