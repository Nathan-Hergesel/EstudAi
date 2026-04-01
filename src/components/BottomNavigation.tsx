import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { spacing } from '@/constants/tokens';

type Screen = 'Agenda' | 'Tarefas' | 'Grupos' | 'ChatIA' | 'Conta';

type Props = {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
};

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const tabs: Screen[] = ['Agenda', 'Grupos', 'Tarefas', 'ChatIA', 'Conta'];

const tabIcons: Record<Screen, { active: IconName; inactive: IconName }> = {
  Agenda: { active: 'calendar', inactive: 'calendar-blank-outline' },
  Tarefas: { active: 'clipboard-text', inactive: 'clipboard-text-outline' },
  Grupos: { active: 'account-group', inactive: 'account-group-outline' },
  ChatIA: { active: 'robot', inactive: 'robot-outline' },
  Conta: { active: 'account', inactive: 'account-outline' }
};

export const BottomNavigation = ({ currentScreen, onNavigate }: Props) => (
  <View style={styles.container}>
    {tabs.map((tab) => {
      const active = currentScreen === tab;
      const icon = active ? tabIcons[tab].active : tabIcons[tab].inactive;

      return (
        <Pressable key={tab} style={styles.tab} onPress={() => onNavigate(tab)}>
          <MaterialCommunityIcons
            name={icon}
            size={active ? 27 : 25}
            color={active ? '#0A3D9F' : '#3E67B1'}
            style={active ? styles.activeIcon : styles.inactiveIcon}
          />
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DDE4EE',
    paddingHorizontal: spacing.sm,
    paddingTop: 3,
    paddingBottom: 4
  },
  tab: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeIcon: {
    opacity: 1,
    transform: [{ scale: 1.04 }]
  },
  inactiveIcon: {
    opacity: 0.78
  }
});
