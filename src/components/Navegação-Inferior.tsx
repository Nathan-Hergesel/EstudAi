/**
 * Navegação inferior (bottom tab) simples com três itens.
 * Exibe Agenda, Tarefas e Conta com ícones e estado ativo.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { CalendarIcon, MoreIcon, UserIcon } from '../assets/icons';
import { navegacaoInferiorStyles as styles } from '../global/styles';

/**
 * Propriedades aceitas pelo componente de navegação inferior.
 */
interface BottomNavigationProps {
  /** Aba atualmente ativa (chave: 'Agenda' | 'Tarefas' | 'Conta') */
  activeTab: string;
  /** Navega para a tela correspondente à chave informada */
  onNavigate: (screen: string) => void;
}

/**
 * Barra de navegação inferior fixa com três ações principais do app.
 */
const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onNavigate }) => {
    // Lista de itens exibidos na barra inferior e seus ícones
    const bottomNavItems = [
    { key: 'Agenda', label: 'Agenda', icon: CalendarIcon },
    { key: 'Tarefas', label: 'Tarefas', icon: MoreIcon },
    { key: 'Conta', label: 'Conta', icon: UserIcon },
  ];

  return (
  <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      {/* Container da barra de navegação alinhada ao fundo */}
      {/* Container da barra de navegação */}
      <View style={styles.bottomNavigation}>
        {bottomNavItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.bottomNavItem,
              activeTab === item.key && styles.bottomNavItemActive,
            ]}
            onPress={() => onNavigate(item.key)}
          >
            {/* Ícone do item */}
            <item.icon width={24} height={24} />
            <Text
              style={[
                styles.bottomNavText,
                activeTab === item.key && styles.bottomNavTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default BottomNavigation;
