import React from 'react';
import { Text, View } from 'react-native';

import { styles } from '@/pages/grupos/styles';

export const GruposPage = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>COLABORAÇÃO</Text>
      <Text style={styles.title}>Grupos de Estudo</Text>
    </View>
  </View>
);
