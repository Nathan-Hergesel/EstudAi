// App principal com navegação simples por estado
// Renderiza uma das três telas: Tarefas, Agenda ou Conta
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TarefasScreen from './src/pages/tarefas';
import AgendaScreen from './src/pages/agenda';
import ContaScreen from './src/pages/conta';
import BottomNavigation from './src/components/Navegação-Inferior';
import { colors } from './src/constants/colors';
import LoginScreen from './src/pages/login';
import { TasksProvider } from './src/hooks/TasksContext';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Tarefas');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Retorna o componente da tela atual
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Tarefas':
        return <TarefasScreen />;
      case 'Agenda':
        return <AgendaScreen onNavigate={setCurrentScreen} />;
      case 'Conta':
        return <ContaScreen />;
      default:
        return <TarefasScreen />;
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <TasksProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar style="dark" backgroundColor={colors.fundo} />
            <View style={styles.content}>
              <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
            </View>
          </SafeAreaView>
        </TasksProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <TasksProvider>
        <SafeAreaView style={styles.container}>
          {/* StatusBar com tema claro e fundo alinhado ao app */}
          <StatusBar style="dark" backgroundColor={colors.fundo} />
          <View style={styles.content}>{renderScreen()}</View>
          {/* Navegação inferior controlada por estado local */}
          <BottomNavigation activeTab={currentScreen} onNavigate={setCurrentScreen} />
        </SafeAreaView>
      </TasksProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  backgroundColor: colors.fundo,
  },
  content: {
    flex: 1,
  },
});
